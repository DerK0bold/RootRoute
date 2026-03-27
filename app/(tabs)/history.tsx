import { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { getHistory, clearHistory, ScanHistoryItem } from '../../services/scanHistory';
import { getNutriScoreColor, getEcoScoreColor } from '../../services/openFoodFacts';
import {
  getGamificationData,
  getTrustScore,
  getLevel,
  GamificationData,
  TOTAL_ACHIEVEMENTS,
} from '../../services/gamification';

// ── Community Leaderboard helpers ─────────────────────────────────────────────

interface LeaderboardEntry {
  rank: number;
  name: string;
  score: number;
  level: string;
  emoji: string;
  isMe: boolean;
}

/** Stable pseudo-random number based on a seed string — no external lib needed */
function seededRandom(seed: string): () => number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (Math.imul(31, hash) + seed.charCodeAt(i)) | 0;
  }
  return () => {
    hash ^= hash << 13;
    hash ^= hash >> 17;
    hash ^= hash << 5;
    return ((hash >>> 0) / 0xffffffff);
  };
}

const COMMUNITY_NAMES = [
  'LenaM', 'MaxK', 'SarahB', 'TomF', 'AnnaN',
  'FelixR', 'LaraS', 'NoahW', 'MiaH', 'LukasP',
  'EmmaG', 'DavidZ', 'HannaV', 'JanT', 'LisaC',
];

/** Build a leaderboard with 10 simulated players + the real user inserted at rank. */
function buildLeaderboard(myScore: number, myLevelLabel: string, myLevelEmoji: string): LeaderboardEntry[] {
  const rng = seededRandom('foodtrace-community-2025');

  // Generate 10 community members with fixed scores
  const community: LeaderboardEntry[] = COMMUNITY_NAMES.slice(0, 10).map((name) => {
    const score = Math.round(rng() * 95) + 5; // 5–99
    const lvl = getLevel(score);
    return { rank: 0, name, score, level: lvl.label, emoji: lvl.emoji, isMe: false };
  });

  // Add real user
  community.push({
    rank: 0,
    name: 'Du',
    score: myScore,
    level: myLevelLabel,
    emoji: myLevelEmoji,
    isMe: true,
  });

  // Sort descending by score; keep only top 10
  community.sort((a, b) => b.score - a.score);
  const top10 = community.slice(0, 10);

  // Assign final ranks
  return top10.map((entry, idx) => ({ ...entry, rank: idx + 1 }));
}

const MEDAL: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' };

export default function HistoryScreen() {
  const [history, setHistory] = useState<ScanHistoryItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [gameData, setGameData] = useState<GamificationData | null>(null);
  const router = useRouter();

  const loadData = async () => {
    const [hist, game] = await Promise.all([getHistory(), getGamificationData()]);
    setHistory(hist);
    setGameData(game);
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleClear = () => {
    Alert.alert(
      'Verlauf löschen',
      'Möchtest du deinen gesamten Scan-Verlauf löschen?',
      [
        { text: 'Abbrechen', style: 'cancel' },
        {
          text: 'Löschen',
          style: 'destructive',
          onPress: async () => {
            await clearHistory();
            setHistory([]);
          },
        },
      ]
    );
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);

    if (diffMins < 1) return 'Gerade eben';
    if (diffMins < 60) return `vor ${diffMins} Minuten`;
    if (diffHours < 24) return `vor ${diffHours} Stunden`;
    return date.toLocaleDateString('de-CH', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  };

  const trustScore = gameData ? getTrustScore(gameData) : 0;
  const level = getLevel(trustScore);

  const GamificationHeader = () => (
    <View>
      {/* Stats Card */}
      <View style={styles.statsCard}>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: level.color }]}>{level.emoji} {level.label}</Text>
            <Text style={styles.statLabel}>Level</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: '#4ADE80' }]}>{trustScore}</Text>
            <Text style={styles.statLabel}>Trust Score</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: '#60A5FA' }]}>{gameData?.totalScans ?? 0}</Text>
            <Text style={styles.statLabel}>Scans</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: '#F59E0B' }]}>
              {gameData?.achievements.length ?? 0}/{TOTAL_ACHIEVEMENTS}
            </Text>
            <Text style={styles.statLabel}>Badges</Text>
          </View>
        </View>

        {/* Trust Score Bar */}
        <View style={styles.trustBarContainer}>
          <View style={[styles.trustBarFill, { width: `${trustScore}%`, backgroundColor: level.color }]} />
        </View>
      </View>

      {/* Achievements */}
      {gameData && gameData.achievements.length > 0 && (
        <View style={styles.achievementsSection}>
          <Text style={styles.achievementsTitle}>🏆 Errungenschaften</Text>
          <View style={styles.achievementsGrid}>
            {gameData.achievements.map((ach) => (
              <View key={ach.id} style={styles.achievementBadge}>
                <Text style={styles.achievementEmoji}>{ach.emoji}</Text>
                <Text style={styles.achievementTitle}>{ach.title}</Text>
                <Text style={styles.achievementDesc}>{ach.description}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Community Leaderboard */}
      <View style={styles.leaderboardSection}>
        <Text style={styles.leaderboardTitle}>🌍 Community Leaderboard</Text>
        <Text style={styles.leaderboardSubtitle}>Vergleiche deinen Trust Score mit anderen Nutzern</Text>
        <View style={styles.leaderboardCard}>
          {buildLeaderboard(trustScore, level.label, level.emoji).map((entry) => (
            <View
              key={entry.name}
              style={[
                styles.leaderboardRow,
                entry.isMe && styles.leaderboardRowMe,
                entry.rank < 3 && styles.leaderboardRowTop,
              ]}
            >
              {/* Rank / medal */}
              <Text style={styles.leaderboardRank}>
                {MEDAL[entry.rank] ?? `#${entry.rank}`}
              </Text>

              {/* Name + level */}
              <View style={styles.leaderboardInfo}>
                <Text style={[styles.leaderboardName, entry.isMe && styles.leaderboardNameMe]}>
                  {entry.emoji} {entry.name}
                </Text>
                <Text style={styles.leaderboardLevel}>{entry.level}</Text>
              </View>

              {/* Score pill */}
              <View style={[
                styles.leaderboardScorePill,
                entry.rank === 1 && { backgroundColor: '#FEF08A', borderColor: '#F59E0B' },
                entry.rank === 2 && { backgroundColor: '#E2E8F0', borderColor: '#94A3B8' },
                entry.rank === 3 && { backgroundColor: '#FED7AA', borderColor: '#EA580C' },
                entry.isMe && { backgroundColor: '#DBEAFE', borderColor: '#006EB7' },
              ]}>
                <Text style={[
                  styles.leaderboardScore,
                  entry.rank === 1 && { color: '#B45309' },
                  entry.rank === 2 && { color: '#475569' },
                  entry.rank === 3 && { color: '#C2410C' },
                  entry.isMe && { color: '#006EB7' },
                ]}>
                  {entry.score} pts
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* List header row */}
      <View style={styles.listHeader}>
        <Text style={styles.headerCount}>{history.length} gescannte Produkte</Text>
        {history.length > 0 && (
          <TouchableOpacity onPress={handleClear}>
            <Text style={styles.clearText}>Löschen</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  if (history.length === 0 && (!gameData || gameData.totalScans === 0)) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyIcon}>📷</Text>
        <Text style={styles.emptyTitle}>Noch keine Scans</Text>
        <Text style={styles.emptyText}>Scanne ein Produkt im Scanner-Tab, um es hier zu sehen.</Text>
        <TouchableOpacity style={styles.scanNowBtn} onPress={() => router.push('/')}>
          <Text style={styles.scanNowText}>Jetzt scannen</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={history}
        keyExtractor={(item) => item.barcode + item.scannedAt}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#006EB7" />
        }
        ListHeaderComponent={<GamificationHeader />}
        ListEmptyComponent={
          <View style={styles.emptyList}>
            <Text style={styles.emptyListText}>Noch keine Scans. Scanne ein Produkt!</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/product/${item.barcode}`)}
            activeOpacity={0.75}
          >
            {item.imageUrl ? (
              <Image source={{ uri: item.imageUrl }} style={styles.productImage} resizeMode="contain" />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Text style={styles.imagePlaceholderText}>📦</Text>
              </View>
            )}
            <View style={styles.cardContent}>
              <Text style={styles.cardName} numberOfLines={2}>{item.productName}</Text>
              {item.brand && <Text style={styles.cardBrand}>{item.brand}</Text>}
              <Text style={styles.cardTime}>{formatDate(item.scannedAt)}</Text>
              <View style={styles.scoreBadges}>
                {item.nutriscore && (
                  <View style={[styles.badge, { backgroundColor: getNutriScoreColor(item.nutriscore) + '22', borderColor: getNutriScoreColor(item.nutriscore) }]}>
                    <Text style={[styles.badgeText, { color: getNutriScoreColor(item.nutriscore) }]}>
                      {item.nutriscore.toUpperCase()}
                    </Text>
                  </View>
                )}
                {item.ecoscore && (
                  <View style={[styles.badge, { backgroundColor: getEcoScoreColor(item.ecoscore) + '22', borderColor: getEcoScoreColor(item.ecoscore) }]}>
                    <Text style={[styles.badgeText, { color: getEcoScoreColor(item.ecoscore) }]}>
                      Eco {item.ecoscore.toUpperCase()}
                    </Text>
                  </View>
                )}
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#4B5563" style={styles.chevron} />
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, backgroundColor: '#F8FAFC' },
  emptyIcon: { fontSize: 64, marginBottom: 16 },
  emptyTitle: { color: '#1E293B', fontSize: 22, fontWeight: '700', marginBottom: 8 },
  emptyText: { color: '#64748B', fontSize: 14, textAlign: 'center', lineHeight: 20, marginBottom: 24 },
  scanNowBtn: { backgroundColor: '#006EB7', borderRadius: 12, paddingHorizontal: 24, paddingVertical: 12, shadowColor: '#006EB7', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 3, elevation: 2 },
  scanNowText: { color: '#fff', fontWeight: '700', fontSize: 15 },

  // Stats Card
  statsCard: {
    margin: 16,
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1
  },
  statsRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 15, fontWeight: '800', marginBottom: 2 },
  statLabel: { color: '#94A3B8', fontSize: 10, fontWeight: '600', textTransform: 'uppercase' },
  statDivider: { width: 1, height: 32, backgroundColor: '#E2E8F0' },
  trustBarContainer: { height: 6, backgroundColor: '#E2E8F0', borderRadius: 3, overflow: 'hidden' },
  trustBarFill: { height: '100%', borderRadius: 3 },

  // Achievements
  achievementsSection: { marginHorizontal: 16, marginBottom: 8 },
  achievementsTitle: { color: '#1E293B', fontSize: 15, fontWeight: '700', marginBottom: 12 },
  achievementsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  achievementBadge: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    width: '30%',
    flexGrow: 1,
    borderWidth: 1,
    borderColor: '#006EB7',
    minWidth: 90,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1
  },
  achievementEmoji: { fontSize: 26, marginBottom: 6 },
  achievementTitle: { color: '#1E293B', fontSize: 11, fontWeight: '700', textAlign: 'center', marginBottom: 3 },
  achievementDesc: { color: '#64748B', fontSize: 10, textAlign: 'center', lineHeight: 14 },

  // Community Leaderboard
  leaderboardSection: { marginHorizontal: 16, marginBottom: 8 },
  leaderboardTitle: { color: '#1E293B', fontSize: 15, fontWeight: '700', marginBottom: 4 },
  leaderboardSubtitle: { color: '#94A3B8', fontSize: 11, marginBottom: 12 },
  leaderboardCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1,
  },
  leaderboardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    gap: 12,
  },
  leaderboardRowMe: {
    backgroundColor: '#EFF6FF',
  },
  leaderboardRowTop: {
    backgroundColor: '#FAFAF9',
  },
  leaderboardRank: { fontSize: 20, width: 34, textAlign: 'center' },
  leaderboardInfo: { flex: 1 },
  leaderboardName: { color: '#1E293B', fontSize: 13, fontWeight: '600' },
  leaderboardNameMe: { color: '#006EB7', fontWeight: '800' },
  leaderboardLevel: { color: '#94A3B8', fontSize: 11, marginTop: 1 },
  leaderboardScorePill: {
    backgroundColor: '#F1F5F9',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  leaderboardScore: { color: '#475569', fontSize: 12, fontWeight: '700' },

  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    paddingTop: 4,
  },
  headerCount: { color: '#64748B', fontSize: 13 },
  clearText: { color: '#EF4444', fontSize: 13, fontWeight: '600' },

  emptyList: { paddingVertical: 40, alignItems: 'center' },
  emptyListText: { color: '#94A3B8', fontSize: 14 },

  list: { paddingBottom: 40 },
  separator: { height: 1, backgroundColor: '#E2E8F0', marginHorizontal: 16 },
  card: { flexDirection: 'row', alignItems: 'center', padding: 14, paddingHorizontal: 16, gap: 12 },
  productImage: { width: 56, height: 56, borderRadius: 10, backgroundColor: '#F1F5F9' },
  imagePlaceholder: { width: 56, height: 56, borderRadius: 10, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#E2E8F0' },
  imagePlaceholderText: { fontSize: 28 },
  cardContent: { flex: 1 },
  cardName: { color: '#1E293B', fontSize: 14, fontWeight: '600', marginBottom: 2 },
  cardBrand: { color: '#64748B', fontSize: 12, marginBottom: 2 },
  cardTime: { color: '#94A3B8', fontSize: 11, marginBottom: 6 },
  scoreBadges: { flexDirection: 'row', gap: 6 },
  badge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2, borderWidth: 1 },
  badgeText: { fontSize: 11, fontWeight: '700' },
  chevron: { marginLeft: 4 },
});
