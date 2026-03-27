import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { getGamificationData, GamificationData, getTrustScore, getLevel } from '../../services/gamification';

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

export default function CommunityScreen() {
  const [userData, setUserData] = useState<GamificationData | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const data = await getGamificationData();
    setUserData(data);

    const score = getTrustScore(data);
    const level = getLevel(score);

    // Integrate current user into mock leaderboard
    const me: LeaderboardUser = {
      id: 'me',
      name: 'Du (Ich)',
      avatar: '🥑',
      points: score * 10, // Simulated points for demo
      scans: data.totalScans,
      level: level.label,
      isMe: true,
    };

    const sorted = [...MOCK_LEADERBOARD, me].sort((a, b) => b.points - a.points);
    setLeaderboard(sorted);
  };

  const renderLeaderItem = ({ item, index }: { item: LeaderboardUser; index: number }) => {
    const isTop3 = index < 3;
    const rankColors = ['#F59E0B', '#94A3B8', '#B45309'];

    return (
      <View style={[styles.leaderCard, item.isMe && styles.meCard]}>
        <View style={styles.rankContainer}>
          {isTop3 ? (
            <Ionicons name="trophy" size={20} color={rankColors[index]} />
          ) : (
            <Text style={styles.rankText}>{index + 1}</Text>
          )}
        </View>
        
        <View style={styles.avatarBox}>
          <Text style={styles.avatarEmoji}>{item.avatar}</Text>
        </View>

        <View style={styles.userInfo}>
          <Text style={[styles.userName, item.isMe && styles.meText]}>{item.name}</Text>
          <Text style={styles.userLevel}>{item.level}</Text>
        </View>

        <View style={styles.statsBox}>
          <Text style={styles.pointsText}>{item.points} Pkt.</Text>
          <Text style={styles.scansText}>{item.scans} Scans</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={['#006EB7', '#004B87']} style={styles.header}>
        <Text style={styles.headerTitle}>Community & Rank</Text>
        <Text style={styles.headerSubtitle}>Werden Sie ein Root Route-Experte!</Text>
        
        <View style={styles.myStatsRow}>
          <View style={styles.myStat}>
            <Text style={styles.myStatLabel}>Meine Punkte</Text>
            <Text style={styles.myStatValue}>{userData ? getTrustScore(userData) * 10 : 0}</Text>
          </View>
          <View style={styles.myStatDivider} />
          <View style={styles.myStat}>
            <Text style={styles.myStatLabel}>Rang</Text>
            <Text style={styles.myStatValue}>#{leaderboard.findIndex(u => u.isMe) + 1}</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Info Section */}
      <View style={styles.infoSection}>
        <View style={styles.infoIcon}>
          <Ionicons name="people" size={24} color="#006EB7" />
        </View>
        <View style={styles.infoTextContainer}>
          <Text style={styles.infoTitle}>Crowd Intelligence</Text>
          <Text style={styles.infoText}>
            Bestätige Daten von Produkten, um Punkte zu sammeln und die Transparenz für alle zu erhöhen.
          </Text>
        </View>
      </View>

      <View style={styles.listHeader}>
        <Text style={styles.listHeaderTitle}>🏆 Bestenliste</Text>
        <Text style={styles.listHeaderDate}>März 2026</Text>
      </View>

      <FlatList
        data={leaderboard}
        keyExtractor={(item) => item.id}
        renderItem={renderLeaderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { padding: 24, paddingBottom: 32, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  headerTitle: { color: '#FFFFFF', fontSize: 24, fontWeight: '800' },
  headerSubtitle: { color: '#E0F2FE', fontSize: 14, marginTop: 4, opacity: 0.9 },
  
  myStatsRow: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 16, marginTop: 24, padding: 16, alignItems: 'center' },
  myStat: { flex: 1, alignItems: 'center' },
  myStatLabel: { color: '#E0F2FE', fontSize: 12, marginBottom: 4 },
  myStatValue: { color: '#FFFFFF', fontSize: 20, fontWeight: '800' },
  myStatDivider: { width: 1, height: 30, backgroundColor: 'rgba(255,255,255,0.2)' },

  infoSection: { flexDirection: 'row', backgroundColor: '#FFFFFF', margin: 16, padding: 16, borderRadius: 16, alignItems: 'center', gap: 14, borderWidth: 1, borderColor: '#E2E8F0', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  infoIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#E0F2FE', alignItems: 'center', justifyContent: 'center' },
  infoTextContainer: { flex: 1 },
  infoTitle: { color: '#1E293B', fontSize: 15, fontWeight: '700', marginBottom: 2 },
  infoText: { color: '#64748B', fontSize: 12, lineHeight: 18 },

  listHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 20, marginBottom: 10, marginTop: 10 },
  listHeaderTitle: { fontSize: 16, fontWeight: '700', color: '#1E293B' },
  listHeaderDate: { fontSize: 13, color: '#64748B' },

  listContent: { padding: 16, paddingTop: 0 },
  leaderCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 14, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: '#E2E8F0' },
  meCard: { borderColor: '#006EB7', backgroundColor: '#F0F9FF', borderWidth: 2 },
  rankContainer: { width: 30, alignItems: 'center' },
  rankText: { fontSize: 15, fontWeight: '700', color: '#64748B' },
  avatarBox: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center', marginHorizontal: 10, borderWidth: 1, borderColor: '#E2E8F0' },
  avatarEmoji: { fontSize: 22 },
  userInfo: { flex: 1 },
  userName: { fontSize: 15, fontWeight: '700', color: '#1E293B' },
  meText: { color: '#006EB7' },
  userLevel: { fontSize: 12, color: '#64748B', marginTop: 2 },
  statsBox: { alignItems: 'flex-end', gap: 2 },
  pointsText: { fontSize: 14, fontWeight: '800', color: '#006EB7' },
  scansText: { fontSize: 11, color: '#94A3B8' },
});
