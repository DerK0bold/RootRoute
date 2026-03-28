import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8FAFC' },
  container: { flex: 1, backgroundColor: '#F8FAFC' },

  // No API key state
  noKeyContainer: { flex: 1, backgroundColor: '#F8FAFC', alignItems: 'center', justifyContent: 'center', padding: 32 },
  noKeyEmoji: { fontSize: 56, marginBottom: 16 },
  noKeyTitle: { color: '#1E293B', fontSize: 22, fontWeight: '800', marginBottom: 12 },
  noKeyText: { color: '#64748B', fontSize: 15, textAlign: 'center', lineHeight: 24, marginBottom: 24 },
  noKeyCode: { color: '#006EB7', fontWeight: '700' },
  noKeySteps: { backgroundColor: '#FFFFFF', borderRadius: 14, padding: 16, width: '100%', borderWidth: 1, borderColor: '#E2E8F0', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 1 },
  noKeyStep: { color: '#1E293B', fontSize: 14, marginBottom: 8, lineHeight: 20 },

  // Header
  header: { paddingHorizontal: 16, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#004B87' },
  headerTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  backBtn: { padding: 4 },
  headerProductMain: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1, marginHorizontal: 12 },
  headerImage: { width: 44, height: 44, borderRadius: 8, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
  imagePlaceholderHeader: { backgroundColor: 'rgba(255,255,255,0.2)' },
  headerTextWrap: { flex: 1 },
  headerTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  headerSubtitle: { color: 'rgba(255,255,255,0.7)', fontSize: 12 },
  clearBtn: { padding: 4 },
  headerScores: { flexDirection: 'row', gap: 8 },
  headerScoreBadge: { flexDirection: 'column', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, minWidth: 70, alignItems: 'center' },
  headerScoreLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 9, fontWeight: '600', textTransform: 'uppercase' },
  headerScoreValue: { color: '#FFFFFF', fontSize: 14, fontWeight: '800' },

  // Suggestions
  suggestionsRow: { maxHeight: 52, flexGrow: 0, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  suggestionsContent: { paddingHorizontal: 14, paddingVertical: 10, gap: 8, flexDirection: 'row' },
  suggestionChip: { backgroundColor: '#F1F5F9', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 7, borderWidth: 1, borderColor: '#E2E8F0' },
  suggestionText: { color: '#475569', fontSize: 13, fontWeight: '500' },

  // Messages
  flatList: { flex: 1 },
  messageList: { paddingHorizontal: 14, paddingVertical: 12, gap: 12, flexGrow: 1 },
  messageRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  messageRowUser: { flexDirection: 'row-reverse' },
  aiAvatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#E0F2FE', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#BAE6FD', flexShrink: 0, marginBottom: 2 },
  aiAvatarEmoji: { fontSize: 16 },
  messageBubble: { maxWidth: '80%', borderRadius: 18, paddingHorizontal: 14, paddingVertical: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  aiBubble: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0', borderBottomLeftRadius: 4 },
  userBubble: { backgroundColor: '#006EB7', borderBottomRightRadius: 4 },
  messageText: { color: '#1E293B', fontSize: 15, lineHeight: 22 },
  userMessageText: { color: '#fff' },
  typingIndicator: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 2 },
  typingText: { color: '#006EB7', fontSize: 13, fontWeight: '500' },

  // Input bar
  inputBar: { flexDirection: 'row', alignItems: 'flex-end', paddingHorizontal: 14, paddingVertical: 10, gap: 10, borderTopWidth: 1, borderTopColor: '#E2E8F0', backgroundColor: '#FFFFFF' },
  textInput: { flex: 1, backgroundColor: '#F8FAFC', borderRadius: 22, paddingHorizontal: 16, paddingTop: 10, paddingBottom: 10, color: '#1E293B', fontSize: 15, borderWidth: 1, borderColor: '#E2E8F0' },
  sendBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#006EB7', alignItems: 'center', justifyContent: 'center', shadowColor: '#006EB7', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 3, elevation: 2 },
  sendBtnDisabled: { backgroundColor: '#CBD5E1', shadowOpacity: 0, elevation: 0 },
});
