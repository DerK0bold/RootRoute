import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, backgroundColor: '#F8FAFC' },
  emptyIcon: { fontSize: 64, marginBottom: 16 },
  emptyTitle: { color: '#1E293B', fontSize: 22, fontWeight: '700', marginBottom: 8 },
  emptyText: { color: '#64748B', fontSize: 14, textAlign: 'center', lineHeight: 20, marginBottom: 24 },
  scanNowBtn: { backgroundColor: '#006EB7', borderRadius: 12, paddingHorizontal: 24, paddingVertical: 12 },
  scanNowText: { color: '#fff', fontWeight: '700', fontSize: 15 },

  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerCount: { color: '#64748B', fontSize: 13 },
  clearText: { color: '#EF4444', fontSize: 13, fontWeight: '600' },

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
