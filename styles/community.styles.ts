import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },

  // Leaderboard item
  leaderItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, gap: 12, backgroundColor: '#FFFFFF' },
  leaderItemMe: { backgroundColor: '#EFF6FF' },
  rankCol: { width: 32, alignItems: 'center' },
  medalText: { fontSize: 22 },
  rankText: { fontSize: 14, fontWeight: '700', color: '#94A3B8' },
  rankTextMe: { color: '#006EB7' },
  avatar: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#E2E8F0' },
  avatarEmoji: { fontSize: 20 },
  userInfo: { flex: 1 },
  userName: { fontSize: 14, fontWeight: '700', color: '#1E293B' },
  userNameMe: { color: '#006EB7' },
  userDetails: { fontSize: 11, color: '#94A3B8', marginTop: 2 },
  pointsBox: { alignItems: 'center', backgroundColor: '#F8FAFC', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 6, borderWidth: 1, borderColor: '#E2E8F0' },
  pointsBoxMe: { backgroundColor: '#DBEAFE', borderColor: '#93C5FD' },
  pointsValue: { fontSize: 15, fontWeight: '800', color: '#4B5563' },
  pointsLabel: { fontSize: 9, color: '#94A3B8', fontWeight: '600', textTransform: 'uppercase' },

  // List header — gradient
  gradientHeader: { paddingTop: 20, paddingHorizontal: 20, paddingBottom: 28, borderBottomLeftRadius: 28, borderBottomRightRadius: 28 },
  gradientTitle: { color: '#FFFFFF', fontSize: 26, fontWeight: '800' },
  gradientSubtitle: { color: '#BAE6FD', fontSize: 13, marginTop: 2, marginBottom: 20 },

  // Level card
  levelCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderRadius: 16, padding: 14, marginBottom: 14, backgroundColor: 'rgba(255,255,255,0.15)' },
  levelLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  levelLabel: { color: '#FFFFFF', fontSize: 18, fontWeight: '800' },
  levelScore: { color: '#BAE6FD', fontSize: 12, marginTop: 2 },
  rankBadge: { borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6, backgroundColor: 'rgba(255,255,255,0.2)' },
  rankBadgeText: { color: '#FFFFFF', fontWeight: '700', fontSize: 13 },

  // Progress bar
  progressBarBg: { height: 8, borderRadius: 4, overflow: 'hidden', backgroundColor: 'rgba(255,255,255,0.2)' },
  progressFill: { height: '100%', borderRadius: 4 },

  // Stats row
  statsRow: { flexDirection: 'row', gap: 10, marginHorizontal: 16, marginTop: 16, marginBottom: 4 },
  statCard: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 14, padding: 14, alignItems: 'center', gap: 4, borderWidth: 1, borderColor: '#E2E8F0' },
  statValue: { fontSize: 20, fontWeight: '800' },
  statLabel: { color: '#94A3B8', fontSize: 10, fontWeight: '600', textTransform: 'uppercase' },

  // Achievements button
  achievementsBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, marginHorizontal: 16, marginTop: 12, marginBottom: 4, backgroundColor: '#EFF6FF', borderRadius: 14, paddingHorizontal: 16, paddingVertical: 13, borderWidth: 1, borderColor: '#BFDBFE' },
  achievementsBtnText: { flex: 1, color: '#006EB7', fontWeight: '700', fontSize: 14 },

  // Leaderboard section header
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 16, marginTop: 20, marginBottom: 10 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1E293B' },
  sectionDate: { fontSize: 12, color: '#94A3B8' },

  separator: { height: 1, backgroundColor: '#F1F5F9', marginHorizontal: 16 },

  // Modal
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.45)' },
  modalInner: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingBottom: 40, maxHeight: '85%' },
  modalHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: '#E2E8F0', alignSelf: 'center', marginTop: 12, marginBottom: 4 },
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  modalTitle: { fontSize: 17, fontWeight: '800', color: '#1E293B' },
  modalCloseBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center' },
  achievementsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, padding: 16 },
  achievementCard: { backgroundColor: '#FFFFFF', borderRadius: 14, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: '#006EB7' },
  achievementCardLocked: { backgroundColor: '#F8FAFC', borderColor: '#E2E8F0' },
  achievementEmoji: { fontSize: 28, marginBottom: 6 },
  achievementEmojiLocked: { opacity: 0.3 },
  achievementTitle: { fontSize: 11, fontWeight: '700', textAlign: 'center', marginBottom: 3, color: '#1E293B' },
  achievementTitleLocked: { color: '#CBD5E1' },
  achievementDesc: { fontSize: 10, textAlign: 'center', lineHeight: 14, color: '#64748B' },
  achievementDescLocked: { color: '#CBD5E1' },
});
