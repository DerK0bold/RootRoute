import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  content: { paddingBottom: 20 },

  hero: { padding: 28, paddingTop: 36, alignItems: 'center' },
  heroIcon: { fontSize: 52, marginBottom: 12 },
  heroTitle: { fontSize: 24, fontWeight: '800', color: '#FFFFFF', textAlign: 'center', marginBottom: 8 },
  heroSubtitle: { fontSize: 14, color: '#E0F2FE', textAlign: 'center', lineHeight: 20, paddingHorizontal: 8 },

  inputSection: { margin: 16 },
  inputLabel: {
    color: '#64748B', fontSize: 13, fontWeight: '600', marginBottom: 10,
    textTransform: 'uppercase', letterSpacing: 0.5,
  },
  inputRow: { flexDirection: 'row', gap: 10 },
  input: {
    flex: 1, backgroundColor: '#FFFFFF', borderRadius: 14,
    paddingHorizontal: 16, paddingVertical: 16,
    color: '#1E293B', fontSize: 15,
    borderWidth: 1.5, borderColor: '#006EB7',
  },
  trackBtn: {
    backgroundColor: '#006EB7', borderRadius: 14,
    width: 56, alignItems: 'center', justifyContent: 'center',
    shadowColor: '#006EB7', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 3, elevation: 2,
  },
  trackBtnDisabled: { backgroundColor: '#CBD5E1', shadowOpacity: 0, elevation: 0 },
  inputHint: { color: '#94A3B8', fontSize: 12, marginTop: 8, lineHeight: 16 },

  section: { marginHorizontal: 16, marginTop: 24 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#1E293B', marginBottom: 12 },
  sectionSubtitle: { color: '#64748B', fontSize: 13, marginTop: -8, marginBottom: 14 },

  recentCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#FFFFFF', borderRadius: 12,
    padding: 14, marginBottom: 8,
    borderWidth: 1, borderColor: '#E2E8F0',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1,
  },
  recentLogo: { fontSize: 28 },
  recentInfo: { flex: 1 },
  recentRetailer: { color: '#334155', fontSize: 14, fontWeight: '600' },
  recentId: { color: '#94A3B8', fontSize: 12, marginTop: 2 },
  recentStatus: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  statusDot: { width: 7, height: 7, borderRadius: 4 },
  dotActive: { backgroundColor: '#006EB7' },
  dotDone: { backgroundColor: '#94A3B8' },
  recentStatusText: { color: '#006EB7', fontSize: 12, fontWeight: '600' },
  recentStatusDone: { color: '#64748B' },

  exampleCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#F0F9FF', borderRadius: 12,
    padding: 14, marginBottom: 8,
    borderWidth: 1, borderColor: '#BAE6FD',
  },
  exampleLogo: { fontSize: 28 },
  exampleInfo: { flex: 1 },
  exampleLabel: { color: '#006EB7', fontSize: 14, fontWeight: '600' },
  exampleId: { color: '#64748B', fontSize: 12, marginTop: 2 },
  tryBtn: {
    backgroundColor: '#006EB7', borderRadius: 8,
    paddingHorizontal: 12, paddingVertical: 6,
    shadowColor: '#006EB7', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 2, elevation: 1,
  },
  tryBtnText: { color: '#fff', fontSize: 13, fontWeight: '700' },

  retailerGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  retailerChip: {
    backgroundColor: '#FFFFFF', borderRadius: 10,
    padding: 12, alignItems: 'center',
    width: '30%', flexGrow: 1,
    borderWidth: 1, borderColor: '#E2E8F0',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1,
  },
  retailerChipLogo: { fontSize: 22, marginBottom: 4 },
  retailerChipName: { color: '#334155', fontSize: 12, fontWeight: '600' },
  retailerChipPrefix: { color: '#94A3B8', fontSize: 10, marginTop: 2 },
});
