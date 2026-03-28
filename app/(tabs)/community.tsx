import { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import {
  getGamificationData,
  GamificationData,
  getTrustScore,
  getLevel,
  TOTAL_ACHIEVEMENTS,
  ALL_ACHIEVEMENTS,
} from '../../services/gamification';

interface LeaderboardUser {
  id: string;
  name: string;
  avatar: string;
  points: number;
  scans: number;
  level: string;
  isMe?: boolean;
}

const MOCK_LEADERBOARD: LeaderboardUser[] = [
  { id: '1', name: 'Lukas S.', avatar: '🧑‍💻', points: 1450, scans: 42, level: 'Experte' },
  { id: '2', name: 'Sarah M.', avatar: '👩‍🌾', points: 1280, scans: 38, level: 'Experte' },
  { id: '3', name: 'Marc B.', avatar: '👨‍🚀', points: 950, scans: 25, level: 'Fortgeschritten' },
  { id: '4', name: 'Elena K.', avatar: '👩‍🔬', points: 820, scans: 22, level: 'Fortgeschritten' },
  { id: '5', name: 'Thomas P.', avatar: '👨‍🎨', points: 610, scans: 15, level: 'Fortgeschritten' },
];

const RANK_MEDALS: Record<number, string> = { 0: '🥇', 1: '🥈', 2: '🥉' };
const RANK_COLORS = ['#F59E0B', '#94A3B8', '#CD7F32'];

export default function CommunityScreen() {
  const [userData, setUserData] = useState<GamificationData | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [showAchievements, setShowAchievements] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    const data = await getGamificationData();
    setUserData(data);

    const score = getTrustScore(data);
    const lvl = getLevel(score);

    const me: LeaderboardUser = {
      id: 'me',
      name: 'Du',
      avatar: '🥑',
      points: score * 10,
      scans: data.totalScans,
      level: lvl.label,
      isMe: true,
    };

    const sorted = [...MOCK_LEADERBOARD, me].sort((a, b) => b.points - a.points);
    setLeaderboard(sorted);
  };

  const trustScore = userData ? getTrustScore(userData) : 0;
  const level = getLevel(trustScore);
  const myRank = leaderboard.findIndex((u) => u.isMe) + 1;

  const renderLeaderItem = ({ item, index }: { item: LeaderboardUser; index: number }) => {
    const isTop3 = index < 3;
    return (
      <View style={[styles.leaderRow, item.isMe && styles.leaderRowMe]}>
        <View style={styles.leaderRank}>
          {isTop3 ? (
            <Text style={styles.leaderMedal}>{RANK_MEDALS[index]}</Text>
          ) : (
            <Text style={[styles.leaderRankNum, item.isMe && { color: '#006EB7' }]}>
              #{index + 1}
            </Text>
          )}
        </View>

        <View style={[styles.leaderAvatar, isTop3 && { borderColor: RANK_COLORS[index] }]}>
          <Text style={styles.leaderAvatarEmoji}>{item.avatar}</Text>
        </View>

        <View style={styles.leaderInfo}>
          <Text style={[styles.leaderName, item.isMe && styles.leaderNameMe]}>
            {item.name}
          </Text>
          <Text style={styles.leaderLevel}>{item.level} · {item.scans} Scans</Text>
        </View>

        <View style={[
          styles.leaderPointsBadge,
          item.isMe && styles.leaderPointsBadgeMe,
          isTop3 && { borderColor: RANK_COLORS[index] },
        ]}>
          <Text style={[
            styles.leaderPoints,
            item.isMe && { color: '#006EB7' },
            isTop3 && { color: RANK_COLORS[index] },
          ]}>
            {item.points}
          </Text>
          <Text style={styles.leaderPointsLabel}>Pkt.</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={leaderboard}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            {/* ── Gradient Header ── */}
            <LinearGradient colors={['#006EB7', '#004B87']} style={styles.header}>
              <Text style={styles.headerTitle}>Community</Text>
              <Text style={styles.headerSubtitle}>Dein Fortschritt auf einen Blick</Text>

              <View style={styles.levelCard}>
                <View style={styles.levelLeft}>
                  <Text style={styles.levelEmoji}>{level.emoji}</Text>
                  <View>
                    <Text style={styles.levelLabel}>{level.label}</Text>
                    <Text style={styles.levelSub}>Trust Score {trustScore}/100</Text>
                  </View>
                </View>
                {myRank > 0 && (
                  <View style={styles.rankBadge}>
                    <Text style={styles.rankBadgeText}>Rang #{myRank}</Text>
                  </View>
                )}
              </View>

              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: `${trustScore}%`, backgroundColor: level.color }]} />
              </View>
            </LinearGradient>

            {/* ── Stats Row ── */}
            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <Ionicons name="shield-checkmark-outline" size={20} color="#4ADE80" />
                <Text style={[styles.statValue, { color: '#4ADE80' }]}>{trustScore}</Text>
                <Text style={styles.statLabel}>Trust Score</Text>
              </View>
              <View style={styles.statCard}>
                <Ionicons name="barcode-outline" size={20} color="#60A5FA" />
                <Text style={[styles.statValue, { color: '#60A5FA' }]}>{userData?.totalScans ?? 0}</Text>
                <Text style={styles.statLabel}>Scans</Text>
              </View>
              <View style={styles.statCard}>
                <Ionicons name="trophy-outline" size={20} color="#F59E0B" />
                <Text style={[styles.statValue, { color: '#F59E0B' }]}>
                  {userData?.achievements.length ?? 0}/{TOTAL_ACHIEVEMENTS}
                </Text>
                <Text style={styles.statLabel}>Badges</Text>
              </View>
            </View>

            {/* ── Achievements Button ── */}
            <TouchableOpacity
              style={styles.achievementsBtn}
              onPress={() => setShowAchievements(true)}
              activeOpacity={0.8}
            >
              <Ionicons name="trophy-outline" size={18} color="#006EB7" />
              <Text style={styles.achievementsBtnText}>
                Errungenschaften ansehen ({userData?.achievements.length ?? 0}/{TOTAL_ACHIEVEMENTS})
              </Text>
              <Ionicons name="chevron-forward" size={16} color="#006EB7" />
            </TouchableOpacity>

            {/* ── Leaderboard Header ── */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>🏆 Bestenliste</Text>
              <Text style={styles.sectionDate}>März 2026</Text>
            </View>
          </>
        }
        renderItem={renderLeaderItem}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />

      {/* ── Achievements Modal ── */}
      <Modal
        visible={showAchievements}
        animationType="slide"
        transparent
        onRequestClose={() => setShowAchievements(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowAchievements(false)}
        >
          <TouchableOpacity activeOpacity={1} style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                🏅 Errungenschaften ({userData?.achievements.length ?? 0}/{TOTAL_ACHIEVEMENTS})
              </Text>
              <TouchableOpacity style={styles.modalClose} onPress={() => setShowAchievements(false)}>
                <Ionicons name="close" size={18} color="#64748B" />
              </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.achievementsGrid} style={{ padding: 16 }}>
              {ALL_ACHIEVEMENTS.map((ach) => {
                const unlocked = userData?.achievements.find((a) => a.id === ach.id);
                return (
                  <View
                    key={ach.id}
                    style={[styles.achievementBadge, !unlocked && styles.achievementBadgeLocked]}
                  >
                    <Text style={[styles.achievementEmoji, !unlocked && { opacity: 0.3 }]}>
                      {unlocked ? ach.emoji : '🔒'}
                    </Text>
                    <Text style={[styles.achievementName, !unlocked && styles.achievementTextLocked]}>
                      {ach.title}
                    </Text>
                    <Text style={[styles.achievementDesc, !unlocked && styles.achievementTextLocked]}>
                      {ach.description}
                    </Text>
                  </View>
                );
              })}
            </ScrollView>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },

  // Header
  header: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 28,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerTitle: { color: '#fff', fontSize: 26, fontWeight: '800' },
  headerSubtitle: { color: '#BAE6FD', fontSize: 13, marginTop: 2, marginBottom: 20 },

  levelCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
  },
  levelLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  levelEmoji: { fontSize: 36 },
  levelLabel: { color: '#fff', fontSize: 18, fontWeight: '800' },
  levelSub: { color: '#BAE6FD', fontSize: 12, marginTop: 2 },
  rankBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  rankBadgeText: { color: '#fff', fontWeight: '700', fontSize: 13 },

  progressBarBg: { height: 8, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 4, overflow: 'hidden' },
  progressBarFill: { height: '100%', borderRadius: 4 },

  // Stats
  statsRow: { flexDirection: 'row', gap: 10, marginHorizontal: 16, marginTop: 16, marginBottom: 4 },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1,
  },
  statValue: { fontSize: 20, fontWeight: '800' },
  statLabel: { color: '#94A3B8', fontSize: 10, fontWeight: '600', textTransform: 'uppercase' },

  // Achievements button
  achievementsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 4,
    backgroundColor: '#EFF6FF',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  achievementsBtnText: { flex: 1, color: '#006EB7', fontWeight: '700', fontSize: 14 },

  // Section header
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 10,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1E293B' },
  sectionDate: { fontSize: 12, color: '#94A3B8' },

  // Leaderboard
  listContent: { paddingBottom: 40 },
  separator: { height: 1, backgroundColor: '#F1F5F9', marginHorizontal: 16 },
  leaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  leaderRowMe: { backgroundColor: '#EFF6FF' },
  leaderRank: { width: 32, alignItems: 'center' },
  leaderMedal: { fontSize: 22 },
  leaderRankNum: { fontSize: 14, fontWeight: '700', color: '#94A3B8' },
  leaderAvatar: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: '#F1F5F9',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: '#E2E8F0',
  },
  leaderAvatarEmoji: { fontSize: 20 },
  leaderInfo: { flex: 1 },
  leaderName: { fontSize: 14, fontWeight: '700', color: '#1E293B' },
  leaderNameMe: { color: '#006EB7' },
  leaderLevel: { fontSize: 11, color: '#94A3B8', marginTop: 2 },
  leaderPointsBadge: {
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  leaderPointsBadgeMe: { backgroundColor: '#DBEAFE', borderColor: '#93C5FD' },
  leaderPoints: { fontSize: 15, fontWeight: '800', color: '#475569' },
  leaderPointsLabel: { fontSize: 9, color: '#94A3B8', fontWeight: '600', textTransform: 'uppercase' },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  modalSheet: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingBottom: 40, maxHeight: '85%' },
  modalHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: '#E2E8F0', alignSelf: 'center', marginTop: 12, marginBottom: 4 },
  modalHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: '#F1F5F9',
  },
  modalTitle: { fontSize: 17, fontWeight: '800', color: '#1E293B' },
  modalClose: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center' },

  // Achievements grid (used in modal)
  achievementsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  achievementBadge: {
    backgroundColor: '#FFFFFF', borderRadius: 14, padding: 14,
    alignItems: 'center', width: '30%', flexGrow: 1, minWidth: 90,
    borderWidth: 1, borderColor: '#006EB7',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1,
  },
  achievementBadgeLocked: { borderColor: '#E2E8F0', backgroundColor: '#F8FAFC' },
  achievementEmoji: { fontSize: 28, marginBottom: 6 },
  achievementName: { color: '#1E293B', fontSize: 11, fontWeight: '700', textAlign: 'center', marginBottom: 3 },
  achievementDesc: { color: '#64748B', fontSize: 10, textAlign: 'center', lineHeight: 14 },
  achievementTextLocked: { color: '#CBD5E1' },
});
