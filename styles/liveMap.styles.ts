import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: { flex: 1 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F8FAFC' },
  errorText: { color: '#64748B', fontSize: 16 },
  map: { flex: 1 },

  backBtn: {
    position: 'absolute', top: 56, left: 16, zIndex: 10,
    backgroundColor: '#006EB7', borderRadius: 20,
    width: 40, height: 40, alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 3,
  },
  fitBtn: {
    position: 'absolute', top: 56, right: 16, zIndex: 10,
    backgroundColor: '#006EB7', borderRadius: 20,
    width: 40, height: 40, alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 3,
  },
  mapTypeBtn: {
    position: 'absolute', top: 112, right: 16, zIndex: 10,
    backgroundColor: '#006EB7', borderRadius: 20,
    width: 40, height: 40, alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 3,
  },
  reCenterBtn: {
    position: 'absolute', top: 168, right: 16, zIndex: 10,
    backgroundColor: '#006EB7', borderRadius: 20,
    width: 40, height: 40, alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 3,
  },
  zoomContainer: {
    position: 'absolute', top: 224, right: 16, zIndex: 10,
    gap: 8,
  },
  zoomBtn: {
    backgroundColor: '#006EB7', borderRadius: 20,
    width: 40, height: 40, alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 3,
  },
  zoomOutBtn: {
    backgroundColor: '#334155',
  },

  // Markers
  completedDot: {
    width: 20, height: 20, borderRadius: 10,
    backgroundColor: '#006EB7', borderWidth: 2, borderColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
  },
  activeMarkerContainer: { alignItems: 'center', justifyContent: 'center' },
  activePulse: {
    position: 'absolute', width: 50, height: 50, borderRadius: 25,
    backgroundColor: 'rgba(0,110,183,0.25)',
  },
  activeMarker: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: '#fff', borderWidth: 3, borderColor: '#006EB7',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#006EB7', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.6, shadowRadius: 8,
    elevation: 8,
  },
  activeMarkerEmoji: { fontSize: 22 },
  destinationMarker: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#334155', borderWidth: 2, borderColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
  },
  destinationEmoji: { fontSize: 20 },

  // Bottom card
  bottomCard: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 20, paddingBottom: 36,
    shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.1, shadowRadius: 12,
    elevation: 10, borderTopWidth: 1, borderTopColor: '#E2E8F0',
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  liveBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: '#E0F2FE', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4,
  },
  liveDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#006EB7' },
  liveText: { color: '#006EB7', fontSize: 11, fontWeight: '800', letterSpacing: 1 },
  cardRetailer: { color: '#64748B', fontSize: 12 },
  cardProductName: { color: '#1E293B', fontSize: 17, fontWeight: '700', marginBottom: 14 },
  statusRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16,
    backgroundColor: '#F8FAFC', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#E2E8F0',
  },
  statusEmoji: { fontSize: 26 },
  statusText: { flex: 1 },
  statusTitle: { color: '#1E293B', fontSize: 14, fontWeight: '700' },
  statusLocation: { color: '#64748B', fontSize: 12, marginTop: 2 },
  steps: { flexDirection: 'row', gap: 6, marginBottom: 12 },
  stepDot: { flex: 1, height: 4, borderRadius: 2, backgroundColor: '#E2E8F0' },
  stepCompleted: { backgroundColor: '#006EB7' },
  stepActive: { backgroundColor: '#BAE6FD' },
  deliveryRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  deliveryText: { color: '#94A3B8', fontSize: 13 },

  // Callouts
  calloutContainer: {
    backgroundColor: '#fff', borderRadius: 12, padding: 12, width: 200,
    borderWidth: 1, borderColor: '#E2E8F0',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4,
  },
  calloutActive: { borderColor: '#006EB7', borderWidth: 2 },
  calloutTitle: { fontSize: 14, fontWeight: '700', color: '#1E293B', marginBottom: 2 },
  calloutLocation: { fontSize: 12, color: '#64748B', marginBottom: 4 },
  calloutTime: { fontSize: 10, color: '#94A3B8' },
  calloutIot: {
    flexDirection: 'row', gap: 12, marginTop: 8, paddingTop: 8,
    borderTopWidth: 1, borderTopColor: '#F1F5F9',
  },
  iotItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  iotText: { fontSize: 12, fontWeight: '600', color: '#006EB7' },
  activeBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: '#E0F2FE', alignSelf: 'flex-start',
    paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginBottom: 6,
  },
  activeDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#006EB7' },
  activeBadgeText: { fontSize: 9, fontWeight: '800', color: '#006EB7' },
});
