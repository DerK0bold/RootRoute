import { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  TextInput, KeyboardAvoidingView, Platform, FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { getOrCreateOrder, getAllOrders, saveOrder, Order } from '../../services/orderTracking';
import styles from '../../styles/tracking.styles';
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

