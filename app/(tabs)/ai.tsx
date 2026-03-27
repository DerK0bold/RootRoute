import { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { sendMessage, ChatMessage, QUICK_SUGGESTIONS } from '../../services/aiAssistant';
import { HAS_GEMINI_API_KEY } from '../../constants/config';

const API_KEY_SET = HAS_GEMINI_API_KEY;

interface Message extends ChatMessage {
  id: string;
  isLoading?: boolean;
}

const WELCOME_MESSAGE: Message = {
  id: 'welcome',
  role: 'assistant',
  content:
    'Hallo! Ich bin dein KI-Assistent für Lebensmittel. 🥗\n\nFrag mich über Inhaltsstoffe, Herkunft, Nachhaltigkeit oder Ernährung – ich helfe dir gerne weiter!',
};

export default function AIScreen() {
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  }, []);

  const handleSend = useCallback(async (text?: string) => {
    const messageText = (text ?? input).trim();
    if (!messageText || loading) return;

    setInput('');

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
    };

    const loadingMsg: Message = {
      id: 'loading',
      role: 'assistant',
      content: '',
      isLoading: true,
    };

    setMessages((prev) => [...prev, userMsg, loadingMsg]);
    setLoading(true);
    scrollToBottom();

    try {
      const history: ChatMessage[] = messages
        .filter((m) => !m.isLoading && m.id !== 'welcome')
        .map((m) => ({ role: m.role, content: m.content }));

      const reply = await sendMessage(history, messageText);

      setMessages((prev) => [
        ...prev.filter((m) => m.id !== 'loading'),
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: reply,
        },
      ]);
    } catch (err: any) {
      console.error("Gemini Error: ", err);
      const errText =
        err?.message?.includes('API key') || err?.status === 401 || err?.status === 403
          ? 'Gemini API-Key ungueltig oder gesperrt. Bitte setze EXPO_PUBLIC_GEMINI_API_KEY in .env.'
          : `Fehler: ${err?.message || 'Internetverbindung prüfen'}`;
      setMessages((prev) => [
        ...prev.filter((m) => m.id !== 'loading'),
        { id: (Date.now() + 1).toString(), role: 'assistant', content: errText },
      ]);
    } finally {
      setLoading(false);
      scrollToBottom();
    }
  }, [input, loading, messages, scrollToBottom]);

  const handleClear = useCallback(() => {
    setMessages([WELCOME_MESSAGE]);
  }, []);

  const renderMessage = useCallback(({ item }: { item: Message }) => {
    if (item.isLoading) {
      return (
        <View style={[styles.messageBubble, styles.aiBubble]}>
          <View style={styles.typingIndicator}>
            <ActivityIndicator size="small" color="#006EB7" />
            <Text style={styles.typingText}>Denkt nach…</Text>
          </View>
        </View>
      );
    }

    const isUser = item.role === 'user';
    return (
      <View style={[styles.messageRow, isUser && styles.messageRowUser]}>
        {!isUser && (
          <View style={styles.aiAvatar}>
            <Text style={styles.aiAvatarEmoji}>🤖</Text>
          </View>
        )}
        <View style={[styles.messageBubble, isUser ? styles.userBubble : styles.aiBubble]}>
          <Text style={[styles.messageText, isUser && styles.userMessageText]}>
            {item.content}
          </Text>
        </View>
      </View>
    );
  }, []);

  if (!API_KEY_SET) {
    return (
      <View style={styles.noKeyContainer}>
        <Text style={styles.noKeyEmoji}>🔑</Text>
        <Text style={styles.noKeyTitle}>API-Key benötigt</Text>
        <Text style={styles.noKeyText}>
          Setze deinen Google Gemini API-Key in{`\n`}
          <Text style={styles.noKeyCode}>.env</Text>
          {`\n`}als EXPO_PUBLIC_GEMINI_API_KEY.
        </Text>
        <View style={styles.noKeySteps}>
          <Text style={styles.noKeyStep}>1. Gehe zu aistudio.google.com</Text>
          <Text style={styles.noKeyStep}>2. Erstelle einen API-Key</Text>
          <Text style={styles.noKeyStep}>3. Speichere ihn in .env als EXPO_PUBLIC_GEMINI_API_KEY</Text>
          <Text style={styles.noKeyStep}>4. Starte Expo neu mit: npx expo start -c</Text>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
      {/* Header */}
      <LinearGradient colors={['#006EB7', '#004B87']} style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.headerAvatarCircle}>
            <Text style={styles.headerAvatarEmoji}>🤖</Text>
          </View>
          <View>
            <Text style={styles.headerTitle}>KI-Assistent</Text>
            <Text style={styles.headerSubtitle}>Lebensmittel-Experte</Text>
          </View>
        </View>
        <TouchableOpacity onPress={handleClear} style={styles.clearBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Ionicons name="trash-outline" size={20} color="#6B7280" />
        </TouchableOpacity>
      </LinearGradient>

      {/* Quick suggestions (only when no real conversation yet) */}
      {messages.length <= 1 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.suggestionsRow}
          contentContainerStyle={styles.suggestionsContent}
        >
          {QUICK_SUGGESTIONS.map((s, i) => (
            <TouchableOpacity
              key={i}
              style={styles.suggestionChip}
              onPress={() => handleSend(s)}
              activeOpacity={0.7}
            >
              <Text style={styles.suggestionText}>{s}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Message list */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.messageList}
        onContentSizeChange={scrollToBottom}
        showsVerticalScrollIndicator={false}
      />

      {/* Input bar */}
      <View style={styles.inputBar}>
        <TextInput
          style={styles.textInput}
          placeholder="Frag mich etwas über Lebensmittel…"
          placeholderTextColor="#4B5563"
          value={input}
          onChangeText={setInput}
          multiline
          maxLength={500}
          returnKeyType="send"
          onSubmitEditing={() => handleSend()}
          blurOnSubmit={false}
          editable={!loading}
        />
        <TouchableOpacity
          style={[styles.sendBtn, (!input.trim() || loading) && styles.sendBtnDisabled]}
          onPress={() => handleSend()}
          activeOpacity={0.8}
          disabled={!input.trim() || loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Ionicons name="send" size={20} color="#fff" />
          )}
        </TouchableOpacity>
      </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#006EB7', // match the header top to blend with safe area
  },
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  // No API key state
  noKeyContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  noKeyEmoji: { fontSize: 56, marginBottom: 16 },
  noKeyTitle: { color: '#1E293B', fontSize: 22, fontWeight: '800', marginBottom: 12 },
  noKeyText: { color: '#64748B', fontSize: 15, textAlign: 'center', lineHeight: 24, marginBottom: 24 },
  noKeyCode: { color: '#006EB7', fontWeight: '700' },
  noKeySteps: { backgroundColor: '#FFFFFF', borderRadius: 14, padding: 16, width: '100%', borderWidth: 1, borderColor: '#E2E8F0', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 1 },
  noKeyStep: { color: '#1E293B', fontSize: 14, marginBottom: 8, lineHeight: 20 },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#004B87',
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  headerAvatarCircle: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: '#BAE6FD',
  },
  headerAvatarEmoji: { fontSize: 20 },
  headerTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  headerSubtitle: { color: '#E0F2FE', fontSize: 12 },
  clearBtn: { padding: 4 },

  // Suggestions
  suggestionsRow: { maxHeight: 52, flexGrow: 0, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  suggestionsContent: { paddingHorizontal: 14, paddingVertical: 10, gap: 8, flexDirection: 'row' },
  suggestionChip: {
    backgroundColor: '#F1F5F9', borderRadius: 20,
    paddingHorizontal: 14, paddingVertical: 7,
    borderWidth: 1, borderColor: '#E2E8F0',
  },
  suggestionText: { color: '#475569', fontSize: 13, fontWeight: '500' },

  // Messages
  messageList: { paddingHorizontal: 14, paddingVertical: 12, gap: 12, flexGrow: 1 },

  messageRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  messageRowUser: { flexDirection: 'row-reverse' },

  aiAvatar: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: '#E0F2FE', alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: '#BAE6FD', flexShrink: 0, marginBottom: 2,
  },
  aiAvatarEmoji: { fontSize: 16 },

  messageBubble: {
    maxWidth: '80%',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1
  },
  aiBubble: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderBottomLeftRadius: 4,
  },
  userBubble: {
    backgroundColor: '#006EB7',
    borderBottomRightRadius: 4,
  },
  messageText: {
    color: '#1E293B',
    fontSize: 15,
    lineHeight: 22,
  },
  userMessageText: {
    color: '#fff',
  },

  // Typing indicator
  typingIndicator: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 2 },
  typingText: { color: '#006EB7', fontSize: 13, fontWeight: '500' },

  // Input bar
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  textInput: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    color: '#1E293B',
    fontSize: 15,
    maxHeight: 120,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sendBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: '#006EB7',
    alignItems: 'center', justifyContent: 'center', shadowColor: '#006EB7', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 3, elevation: 2
  },
  sendBtnDisabled: { backgroundColor: '#CBD5E1', shadowOpacity: 0, elevation: 0 },
});
