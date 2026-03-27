import { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, KeyboardAvoidingView, Platform, FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { getOrCreateOrder, getAllOrders, saveOrder, Order } from '../../services/orderTracking';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HISTORY_KEY = '@foodtrace_order_history';

async function loadOrderHistory(): Promise<string[]> {
  try {
    const data = await AsyncStorage.getItem(HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch { return []; }
}

async function addToOrderHistory(orderId: string): Promise<void> {
  const existing = await loadOrderHistory();
  const updated = [orderId, ...existing.filter((id) => id !== orderId)].slice(0, 10);
  await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
}

const EXAMPLE_ORDERS = [
  { id: 'MIG-X7K2P9QR4', label: 'Migros Online', logo: '🛒' },
  { id: 'COOP-8B3TN1LZW', label: 'Coop', logo: '🏪' },
  { id: 'POST-994567890124', label: 'Post CH', logo: '📮' },
  { id: 'DHL-1Z999AA10123456784', label: 'DHL', logo: '📦' },
];

export default function TrackingTab() {
  const router = useRouter();
  const [input, setInput] = useState('');
  const [recentIds, setRecentIds] = useState<string[]>([]);

  useFocusEffect(
    useCallback(() => {
      loadOrderHistory().then(setRecentIds);
    }, [])
  );

  const handleTrack = async (orderId: string) => {
    const id = orderId.trim();
    if (!id) return;
    const order = getOrCreateOrder(id);
    saveOrder(order);
    await addToOrderHistory(id);
    setInput('');
    router.push(`/tracking/${encodeURIComponent(id)}`);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {/* Hero */}
        <LinearGradient colors={['#006EB7', '#004B87']} style={styles.hero}>
          <Text style={styles.heroIcon}>📦</Text>
          <Text style={styles.heroTitle}>Lieferung verfolgen</Text>
          <Text style={styles.heroSubtitle}>
            Gib deine Bestellnummer ein – von Migros, Coop, Post, DHL oder einem anderen Anbieter.
          </Text>
        </LinearGradient>

        {/* Input */}
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Bestellnummer eingeben</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="z.B. MIG-X7K2P9QR4 oder 9945678..."
              placeholderTextColor="#4B5563"
              value={input}
              onChangeText={setInput}
              autoCapitalize="characters"
              returnKeyType="search"
              onSubmitEditing={() => handleTrack(input)}
            />
            <TouchableOpacity
              style={[styles.trackBtn, !input.trim() && styles.trackBtnDisabled]}
              onPress={() => handleTrack(input)}
              disabled={!input.trim()}
            >
              <Ionicons name="search" size={22} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.inputHint}>
            Die Bestellnummer findest du in der Bestätigungs-E-Mail des Händlers.
          </Text>
        </View>

        {/* Recent orders */}
        {recentIds.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Zuletzt verfolgt</Text>
            {recentIds.map((id) => {
              const order = getOrCreateOrder(id);
              return (
                <TouchableOpacity
                  key={id}
                  style={styles.recentCard}
                  onPress={() => handleTrack(id)}
                  activeOpacity={0.75}
                >
                  <Text style={styles.recentLogo}>{order.retailerLogo}</Text>
                  <View style={styles.recentInfo}>
                    <Text style={styles.recentRetailer}>{order.retailer}</Text>
                    <Text style={styles.recentId}>{id}</Text>
                  </View>
                  <View style={styles.recentStatus}>
                    <View style={[
                      styles.statusDot,
                      order.currentStatus === 'Zugestellt' ? styles.dotDone : styles.dotActive,
                    ]} />
                    <Text style={[
                      styles.recentStatusText,
                      order.currentStatus === 'Zugestellt' && styles.recentStatusDone,
                    ]}>
                      {order.currentStatus}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color="#4B5563" />
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* Example orders */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Beispiele ausprobieren</Text>
          <Text style={styles.sectionSubtitle}>Tippe auf eine Demo-Bestellnummer um es auszuprobieren.</Text>
          {EXAMPLE_ORDERS.map((ex) => (
            <TouchableOpacity
              key={ex.id}
              style={styles.exampleCard}
              onPress={() => handleTrack(ex.id)}
              activeOpacity={0.75}
            >
              <Text style={styles.exampleLogo}>{ex.logo}</Text>
              <View style={styles.exampleInfo}>
                <Text style={styles.exampleLabel}>{ex.label}</Text>
                <Text style={styles.exampleId}>{ex.id}</Text>
              </View>
              <View style={styles.tryBtn}>
                <Text style={styles.tryBtnText}>Verfolgen</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Supported retailers */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Unterstützte Anbieter</Text>
          <View style={styles.retailerGrid}>
            {[
              { name: 'Migros', logo: '🛒', prefix: 'MIG-...' },
              { name: 'Coop', logo: '🏪', prefix: 'COOP-...' },
              { name: 'Post CH', logo: '📮', prefix: '98/99...' },
              { name: 'DHL', logo: '📦', prefix: 'DHL-...' },
              { name: 'Amazon', logo: '🟠', prefix: 'AMZ-...' },
              { name: 'Andere', logo: '🏷️', prefix: 'Beliebig' },
            ].map((r) => (
              <View key={r.name} style={styles.retailerChip}>
                <Text style={styles.retailerChipLogo}>{r.logo}</Text>
                <Text style={styles.retailerChipName}>{r.name}</Text>
                <Text style={styles.retailerChipPrefix}>{r.prefix}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  content: { paddingBottom: 20 },

  hero: { padding: 28, paddingTop: 36, alignItems: 'center' },
  heroIcon: { fontSize: 52, marginBottom: 12 },
  heroTitle: { fontSize: 24, fontWeight: '800', color: '#FFFFFF', textAlign: 'center', marginBottom: 8 },
  heroSubtitle: { fontSize: 14, color: '#E0F2FE', textAlign: 'center', lineHeight: 20, paddingHorizontal: 8 },

  inputSection: { margin: 16 },
  inputLabel: { color: '#64748B', fontSize: 13, fontWeight: '600', marginBottom: 10,
    textTransform: 'uppercase', letterSpacing: 0.5 },
  inputRow: { flexDirection: 'row', gap: 10 },
  input: {
    flex: 1, backgroundColor: '#FFFFFF', borderRadius: 14,
    paddingHorizontal: 16, paddingVertical: 16,
    color: '#1E293B', fontSize: 15,
    borderWidth: 1.5, borderColor: '#006EB7',
  },
  trackBtn: {
    backgroundColor: '#006EB7', borderRadius: 14,
    width: 56, alignItems: 'center', justifyContent: 'center', shadowColor: '#006EB7', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 3, elevation: 2
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
    borderWidth: 1, borderColor: '#E2E8F0', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1
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
    paddingHorizontal: 12, paddingVertical: 6, shadowColor: '#006EB7', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 2, elevation: 1
  },
  tryBtnText: { color: '#fff', fontSize: 13, fontWeight: '700' },

  retailerGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  retailerChip: {
    backgroundColor: '#FFFFFF', borderRadius: 10,
    padding: 12, alignItems: 'center',
    width: '30%', flexGrow: 1,
    borderWidth: 1, borderColor: '#E2E8F0', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1
  },
  retailerChipLogo: { fontSize: 22, marginBottom: 4 },
  retailerChipName: { color: '#334155', fontSize: 12, fontWeight: '600' },
  retailerChipPrefix: { color: '#94A3B8', fontSize: 10, marginTop: 2 },
});
