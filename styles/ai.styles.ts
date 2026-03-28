import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  // No API key screen
  noKeyContainer: { flex: 1, backgroundColor: '#F8FAFC', alignItems: 'center', justifyContent: 'center', padding: 32 },
  noKeyEmoji: { fontSize: 56, marginBottom: 16 },
  noKeyTitle: { color: '#1E293B', fontSize: 22, fontWeight: '800', marginBottom: 12 },
  noKeyText: { color: '#64748B', fontSize: 15, textAlign: 'center', lineHeight: 24, marginBottom: 24 },
  noKeyCode: { color: '#006EB7', fontWeight: '700' },
  noKeySteps: { backgroundColor: '#FFFFFF', borderRadius: 14, padding: 16, width: '100%', borderWidth: 1, borderColor: '#E2E8F0' },
  noKeyStep: { color: '#1E293B', fontSize: 14, marginBottom: 8, lineHeight: 20 },

  safeArea: { flex: 1, backgroundColor: '#006EB7' },
  keyboardView: { flex: 1, backgroundColor: '#F8FAFC' },

  // Header
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#004B87' },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  headerAvatarContainer: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: '#BAE6FD' },
  headerAvatarEmoji: { fontSize: 20 },
  headerTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  headerSubtitle: { color: '#E0F2FE', fontSize: 12 },
  clearBtn: { padding: 4 },

  // Suggestions
  suggestionsRow: { backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E2E8F0', maxHeight: 52, flexGrow: 0 },
  suggestionsContent: { paddingHorizontal: 14, paddingVertical: 10, gap: 8, flexDirection: 'row' },
  suggestionChip: { backgroundColor: '#F1F5F9', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 7, borderWidth: 1, borderColor: '#E2E8F0' },
  suggestionText: { color: '#4B5563', fontSize: 13, fontWeight: '500' },

  // Message list content container
  messageListContent: { paddingHorizontal: 14, paddingVertical: 12, gap: 12, flexGrow: 1 },

  // Loading message bubble
  loadingBubble: { maxWidth: '80%', borderRadius: 18, paddingHorizontal: 14, paddingVertical: 10, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0', borderBottomLeftRadius: 4 },
  loadingRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 2 },
  loadingText: { color: '#006EB7', fontSize: 13, fontWeight: '500' },

  // Message rows
  messageRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  messageRowUser: { flexDirection: 'row-reverse' },
  aiAvatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#E0F2FE', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#BAE6FD', flexShrink: 0, marginBottom: 2 },
  aiAvatarEmoji: { fontSize: 16 },
  userBubble: { maxWidth: '80%', borderRadius: 18, paddingHorizontal: 14, paddingVertical: 10, backgroundColor: '#006EB7', borderBottomRightRadius: 4 },
  aiBubble: { maxWidth: '80%', borderRadius: 18, paddingHorizontal: 14, paddingVertical: 10, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0', borderBottomLeftRadius: 4 },
  userMessageText: { fontSize: 15, lineHeight: 22, color: '#FFFFFF' },
  aiMessageText: { fontSize: 15, lineHeight: 22, color: '#1E293B' },

  // Input bar
  inputBar: { flexDirection: 'row', alignItems: 'flex-end', paddingHorizontal: 14, paddingVertical: 10, gap: 10, borderTopWidth: 1, borderTopColor: '#E2E8F0', backgroundColor: '#FFFFFF' },
  textInput: { flex: 1, backgroundColor: '#F8FAFC', borderRadius: 22, paddingHorizontal: 16, paddingTop: 10, paddingBottom: 10, color: '#1E293B', fontSize: 15, borderWidth: 1, borderColor: '#E2E8F0' },
  sendBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', backgroundColor: '#006EB7' },
  sendBtnDisabled: { backgroundColor: '#CBD5E1' },
});
