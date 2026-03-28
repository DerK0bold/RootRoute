import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import styles from '../../styles/pantry.styles';
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

