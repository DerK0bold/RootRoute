import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getPantryItems, removeFromPantry, PantryItem } from '../../services/pantryService';
import { LinearGradient } from 'expo-linear-gradient';

export default function PantryScreen() {
  const [items, setItems] = useState<PantryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPantry = async () => {
    setLoading(true);
    const data = await getPantryItems();
    setItems(data);
    setLoading(false);
  };

  useEffect(() => {
    loadPantry();
  }, []);

  const handleDelete = (id: string) => {
    Alert.alert('Löschen', 'Produkt aus dem Vorratsschrank entfernen?', [
      { text: 'Abbrechen', style: 'cancel' },
      {
        text: 'Löschen',
        style: 'destructive',
        onPress: async () => {
          await removeFromPantry(id);
          loadPantry();
        },
      },
    ]);
  };

  const getUrgencyColor = (days: number) => {
    if (days <= 2) return '#EF4444'; // Red
    if (days <= 5) return '#F59E0B'; // Orange
    return '#10B981'; // Green
  };

  const renderItem = ({ item }: { item: PantryItem }) => {
    const color = getUrgencyColor(item.daysLeft);
    const progress = Math.max(0, Math.min(100, (item.daysLeft / 14) * 100)); // Simulating max 14 days for progress bar

    return (
      <View style={styles.card}>
        {item.imageUrl ? (
          <Image source={{ uri: item.imageUrl }} style={styles.itemImage} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text>📦</Text>
          </View>
        )}
        
        <View style={styles.content}>
          <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.brand}>{item.brand || 'Unbekannte Marke'}</Text>
          
          <View style={styles.statusRow}>
            <Text style={[styles.daysText, { color }]}>
              {item.daysLeft <= 0 ? 'Abgelaufen' : `Noch ca. ${item.daysLeft} Tage`}
            </Text>
            <TouchableOpacity onPress={() => handleDelete(item.id)}>
              <Ionicons name="trash-outline" size={18} color="#94A3B8" />
            </TouchableOpacity>
          </View>

          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${progress}%`, backgroundColor: color }]} />
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#006EB7', '#004B87']} style={styles.header}>
        <Text style={styles.headerTitle}>Mein Vorratsschrank</Text>
        <Text style={styles.headerSubtitle}>{items.length} Produkte werden überwacht</Text>
      </LinearGradient>

      {items.length === 0 && !loading ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="archive-outline" size={64} color="#CBD5E1" />
          <Text style={styles.emptyTitle}>Dein Schrank ist leer</Text>
          <Text style={styles.emptyText}>Scanne Produkte und lege sie hier ab, um die Haltbarkeit zu tracken.</Text>
        </View>
      ) : (
        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshing={loading}
          onRefresh={loadPantry}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { padding: 24, paddingTop: 40, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  headerTitle: { color: '#fff', fontSize: 24, fontWeight: '800' },
  headerSubtitle: { color: 'rgba(255,255,255,0.8)', fontSize: 14, marginTop: 4 },
  list: { padding: 16 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 12, flexDirection: 'row', marginBottom: 16, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4 },
  itemImage: { width: 80, height: 80, borderRadius: 12 },
  imagePlaceholder: { width: 80, height: 80, borderRadius: 12, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center' },
  content: { flex: 1, marginLeft: 12, justifyContent: 'center' },
  name: { fontSize: 16, fontWeight: '700', color: '#1E293B' },
  brand: { fontSize: 13, color: '#64748B', marginBottom: 6 },
  statusRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  daysText: { fontSize: 12, fontWeight: '700' },
  progressBarBg: { height: 6, backgroundColor: '#E2E8F0', borderRadius: 3, overflow: 'hidden' },
  progressBarFill: { height: '100%', borderRadius: 3 },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: '#475569', marginTop: 16 },
  emptyText: { fontSize: 14, color: '#94A3B8', textAlign: 'center', marginTop: 8, lineHeight: 20 },
});
