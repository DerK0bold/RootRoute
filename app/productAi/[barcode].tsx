import { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Keyboard,
  ActivityIndicator,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { sendMessage, ChatMessage, ProductContext } from '../../services/aiAssistant';
import { fetchProductByBarcode, parseIngredientsList, getNutriScoreColor, getEcoScoreColor } from '../../services/openFoodFacts';
import { GEMINI_API_KEY } from '../../constants/config';
import { findIngredientOrigin } from '../../constants/ingredientOrigins';
import { getTraceability, getBarcodeFromLot } from '../../services/traceabilityService';

const API_KEY_SET = (GEMINI_API_KEY as string) !== 'DEIN_API_KEY_HIER';
const STORAGE_PREFIX = '@product_ai_chat_';

interface Message extends ChatMessage {
  id: string;
  isLoading?: boolean;
}

const PRODUCT_SUGGESTIONS = [
  'Ist das Produkt gesund? 🥗',
  'Wie nachhaltig ist es? 🌍',
  'Woher kommen die Hauptzutaten? 🚜',
  'Was bedeutet der CO₂-Score? ☁️',
  'Gibt es gesündere Alternativen? ✨',
  'Bedankliche Inhaltsstoffe? ⚠️',
];

export default function ProductAiScreen() {
  const { barcode: id, isLot, ean, name, brand, image, nutriscore, ecoscore, carbon, carbonGrade, origins, manufacturing } =
    useLocalSearchParams<{
      barcode: string;
      isLot?: string;
      ean?: string;
      name: string;
      brand?: string;
      image?: string;
      nutriscore?: string;
      ecoscore?: string;
      carbon?: string;
      carbonGrade?: string;
      origins?: string;
      manufacturing?: string;
    }>();

  const barcode = isLot === 'true' ? ean || getBarcodeFromLot(id) || id : id;
  const lotNumber = isLot === 'true' ? id : undefined;

  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [context, setContext] = useState<ProductContext | null>(null);
  const [inputHeight, setInputHeight] = useState(44);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    const show = Keyboard.addListener('keyboardDidShow', (e) => setKeyboardHeight(e.endCoordinates.height));
    const hide = Keyboard.addListener('keyboardDidHide', () => setKeyboardHeight(0));
    return () => { show.remove(); hide.remove(); };
  }, []);

  // --- Chat Persistence & Context ---
  // We save the chat history so the user can come back and see 
  // what they discussed about this specific product.
  useEffect(() => {
    if (!barcode) return;

    const loadChat = async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_PREFIX + barcode);
        if (saved) {
          setMessages(JSON.parse(saved));
        } else {
          const welcome: Message = {
            id: 'welcome',
            role: 'assistant',
            content: `Hallo! Ich bin dein FoodTrace-Experte. Ich habe alle Infos zu **${name || 'diesem Produkt'}** geladen. Was möchtest du wissen? 🔍`,
          };
          setMessages([welcome]);
        }
      } catch (err) {
        console.error("Failed to load chat:", err);
      }
    };

    loadChat();

    // This 'context' object is what we send to Gemini so it "knows" 
    // exactly what product the user is looking at.
    const ctx: ProductContext = {
      name: name || 'Unbekanntes Produkt',
      brand: brand,
      nutriscore: nutriscore,
      ecoscore: ecoscore,
      carbonCO2: carbon ? Number(carbon) : undefined,
      carbonGrade: carbonGrade,
      manufacturing: manufacturing,
      origins: origins ? JSON.parse(origins) : [],
    };
    setContext(ctx);

    // Load ingredients and Traceability async
    const traceability = lotNumber ? getTraceability(lotNumber) : null;
    
    fetchProductByBarcode(barcode).then((result) => {
      if (result.found && result.product) {
        const ings = parseIngredientsList(result.product);
        const ingsWithOrigins = ings.map(ing => {
          const origin = findIngredientOrigin(ing);
          if (origin) {
            return `${ing} (aus ${origin.countries.map(c => c.name).join(', ')})`;
          }
          return ing;
        });
        setContext((prev) => (prev ? { 
          ...prev, 
          ingredients: ingsWithOrigins,
          lotNumber: lotNumber,
          manufacturing: traceability?.origin || prev.manufacturing
        } : prev));
      }
    });

  }, [barcode, lotNumber]);

  // Persistence: Save chat
  const saveChat = useCallback(async (msgs: Message[]) => {
    if (!barcode) return;
    try {
      await AsyncStorage.setItem(STORAGE_PREFIX + barcode, JSON.stringify(msgs));
    } catch (err) {
      console.error("Failed to save chat:", err);
    }
  }, [barcode]);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  }, []);

  /**
   * Sends the user's question along with the product context to the AI.
   * We also include the chat history for a coherent conversation.
   */
  const handleSend = useCallback(async (text?: string) => {
    const messageText = (text ?? input).trim();
    if (!messageText || loading) return;

    setInput('');
    setInputHeight(44);

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: messageText };
    const loadingMsg: Message = { id: 'loading', role: 'assistant', content: '', isLoading: true };

    const newMsgs = [...messages, userMsg, loadingMsg];
    setMessages(newMsgs);
    setLoading(true);
    scrollToBottom();

    try {
      const history: ChatMessage[] = messages
        .filter((m) => !m.isLoading && m.id !== 'welcome')
        .map((m) => ({ role: m.role, content: m.content }));

      const reply = await sendMessage(history, messageText, context ?? undefined);

      const finalMsgs: Message[] = [
        ...newMsgs.filter((m) => m.id !== 'loading'),
        { id: (Date.now() + 1).toString(), role: 'assistant', content: reply },
      ];
      setMessages(finalMsgs);
      saveChat(finalMsgs);
    } catch (err: any) {
      console.error("Gemini Error: ", err);
      const errText =
        err?.status === 401 || err?.message?.includes('API key')
          ? 'API-Key ungültig. Bitte trage einen gültigen Key in constants/config.ts ein.'
          : `Fehler: ${err?.message || 'Bitte Internetverbindung prüfen.'}`;
      const finalMsgs: Message[] = [
        ...newMsgs.filter((m) => m.id !== 'loading'),
        { id: (Date.now() + 1).toString(), role: 'assistant', content: errText },
      ];
      setMessages(finalMsgs);
    } finally {
      setLoading(false);
      scrollToBottom();
    }
  }, [input, loading, messages, context, scrollToBottom, saveChat]);

  const handleClear = useCallback(() => {
    Alert.alert(
      'Chat löschen?',
      'Möchtest du den gesamten Gesprächsverlauf für dieses Produkt löschen?',
      [
        { text: 'Abbrechen', style: 'cancel' },
        { 
          text: 'Löschen', 
          style: 'destructive',
          onPress: async () => {
            const welcome: Message = {
              id: 'welcome',
              role: 'assistant',
              content: `Ich habe den Verlauf gelöscht. Wie kann ich dir noch zu **${name || 'diesem Produkt'}** helfen? 🔍`,
            };
            setMessages([welcome]);
            if (barcode) await AsyncStorage.removeItem(STORAGE_PREFIX + barcode);
          }
        }
      ]
    );
  }, [name, barcode]);

  const renderMessage = useCallback(({ item }: { item: Message }) => {
    if (item.isLoading) {
      return (
        <View style={[styles.messageBubble, styles.aiBubble]}>
          <View style={styles.typingIndicator}>
            <ActivityIndicator size="small" color="#006EB7" />
            <Text style={styles.typingText}>Analysiere Produkt…</Text>
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
          Trage deinen Google Gemini API-Key in{'\n'}
          <Text style={styles.noKeyCode}>constants/config.ts</Text>
          {'\n'}ein, um den KI-Assistenten zu nutzen.
        </Text>
        <View style={styles.noKeySteps}>
          <Text style={styles.noKeyStep}>1. Gehe zu aistudio.google.com</Text>
          <Text style={styles.noKeyStep}>2. Erstelle einen API-Key</Text>
          <Text style={styles.noKeyStep}>3. Trage ihn in config.ts ein</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <LinearGradient colors={['#006EB7', '#004C89']} style={[styles.header, { paddingTop: insets.top + 10 }]}>
          <View style={styles.headerTopRow}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            
            <View style={styles.headerProductMain}>
              {image ? (
                <Image source={{ uri: image }} style={styles.headerImage} resizeMode="contain" />
              ) : (
                <View style={[styles.headerImage, styles.imagePlaceholderHeader]}>
                  <Text style={{ fontSize: 16 }}>📦</Text>
                </View>
              )}
              <View style={styles.headerTextWrap}>
                <Text style={styles.headerTitle} numberOfLines={1}>
                  {name || 'KI-Assistent'}
                </Text>
                <Text style={styles.headerSubtitle} numberOfLines={1}>
                  {brand || 'Produkt-Analyse'}
                </Text>
              </View>
            </View>

            <TouchableOpacity onPress={handleClear} style={styles.clearBtn} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
              <Ionicons name="trash-outline" size={22} color="rgba(255,255,255,0.7)" />
            </TouchableOpacity>
          </View>

          {/* Header Score Badges */}
          <View style={styles.headerScores}>
            {nutriscore && (
              <View style={[styles.headerScoreBadge, { backgroundColor: getNutriScoreColor(nutriscore) }]}>
                <Text style={styles.headerScoreLabel}>Nutri-Score</Text>
                <Text style={styles.headerScoreValue}>{nutriscore.toUpperCase()}</Text>
              </View>
            )}
            {ecoscore && (
              <View style={[styles.headerScoreBadge, { backgroundColor: getEcoScoreColor(ecoscore) }]}>
                <Text style={styles.headerScoreLabel}>Eco-Score</Text>
                <Text style={styles.headerScoreValue}>{ecoscore.toUpperCase()}</Text>
              </View>
            )}
            {carbon && (
              <View style={[styles.headerScoreBadge, { backgroundColor: getEcoScoreColor(carbonGrade || 'c') }]}>
                <Text style={styles.headerScoreLabel}>CO₂-Score</Text>
                <Text style={styles.headerScoreValue}>{carbonGrade?.toUpperCase() || 'C'}</Text>
              </View>
            )}
            {lotNumber ? (
              <View style={[styles.headerScoreBadge, { backgroundColor: '#7C3AED', borderWidth: 1, borderColor: '#DDD6FE' }]}>
                <Text style={styles.headerScoreLabel}>Lot / Charge</Text>
                <Text style={styles.headerScoreValue}>{lotNumber}</Text>
              </View>
            ) : barcode ? (
              <View style={[styles.headerScoreBadge, { backgroundColor: 'rgba(0,0,0,0.2)', borderWidth: 0 }]}>
                <Text style={styles.headerScoreLabel}>EAN / GTIN</Text>
                <Text style={styles.headerScoreValue}>{barcode.slice(-4)}</Text>
              </View>
            ) : null}
          </View>
        </LinearGradient>

        {/* Quick suggestions (only when no real conversation yet) */}
        {messages.length <= 1 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.suggestionsRow}
            contentContainerStyle={styles.suggestionsContent}
          >
            {PRODUCT_SUGGESTIONS.map((s, i) => (
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
          style={styles.flatList}
          contentContainerStyle={styles.messageList}
          onContentSizeChange={scrollToBottom}
          showsVerticalScrollIndicator={false}
        />

        {/* Input bar */}
        <View style={[styles.inputBar, { marginBottom: keyboardHeight > 0 ? keyboardHeight + 8 : insets.bottom }]}>
          <TextInput
            style={[styles.textInput, { height: Math.min(Math.max(inputHeight, 44), 120) }]}
            placeholder="Frag über dieses Produkt…"
            placeholderTextColor="#4B5563"
            value={input}
            onChangeText={setInput}
            onContentSizeChange={(e) => setInputHeight(e.nativeEvent.contentSize.height + 20)}
            multiline
            maxLength={500}
            returnKeyType="send"
            onSubmitEditing={() => handleSend()}
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
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
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
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#004B87',
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  backBtn: { padding: 4 },
  headerProductMain: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 12, 
    flex: 1, 
    marginHorizontal: 12 
  },
  headerImage: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePlaceholderHeader: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  headerTextWrap: { flex: 1 },
  headerTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  headerSubtitle: { color: 'rgba(255,255,255,0.7)', fontSize: 12 },
  clearBtn: { padding: 4 },

  headerScores: {
    flexDirection: 'row',
    gap: 8,
  },
  headerScoreBadge: {
    flexDirection: 'column',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    minWidth: 70,
    alignItems: 'center',
  },
  headerScoreLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 9,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  headerScoreValue: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },

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
  flatList: { flex: 1 },
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
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1,
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
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sendBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: '#006EB7',
    alignItems: 'center', justifyContent: 'center', shadowColor: '#006EB7', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 3, elevation: 2,
  },
  sendBtnDisabled: { backgroundColor: '#CBD5E1', shadowOpacity: 0, elevation: 0 },
});
