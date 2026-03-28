import { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { getHistory, clearHistory, ScanHistoryItem } from '../../services/scanHistory';
import { getNutriScoreColor, getEcoScoreColor } from '../../services/openFoodFacts';
import styles from '../../styles/history.styles';

export default function HistoryScreen() {
  const [history, setHistory] = useState<ScanHistoryItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const loadData = async () => {
    const hist = await getHistory();
    setHistory(hist);
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleClear = () => {
    Alert.alert(
      'Verlauf löschen',
      'Möchtest du deinen gesamten Scan-Verlauf löschen?',
      [
        { text: 'Abbrechen', style: 'cancel' },
        {
          text: 'Löschen',
          style: 'destructive',
          onPress: async () => {
            await clearHistory();
            setHistory([]);
          },
        },
      ]
    );
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);

    if (diffMins < 1) return 'Gerade eben';
    if (diffMins < 60) return `vor ${diffMins} Minuten`;
    if (diffHours < 24) return `vor ${diffHours} Stunden`;
    return date.toLocaleDateString('de-CH', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  };

  if (history.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyIcon}>📷</Text>
        <Text style={styles.emptyTitle}>Noch keine Scans</Text>
        <Text style={styles.emptyText}>Scanne ein Produkt im Scanner-Tab, um es hier zu sehen.</Text>
        <TouchableOpacity style={styles.scanNowBtn} onPress={() => router.push('/')}>
          <Text style={styles.scanNowText}>Jetzt scannen</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={history}
        keyExtractor={(item) => item.barcode + item.scannedAt}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#006EB7" />
        }
        ListHeaderComponent={
          <View style={styles.listHeader}>
            <Text style={styles.headerCount}>{history.length} gescannte Produkte</Text>
            <TouchableOpacity onPress={handleClear}>
              <Text style={styles.clearText}>Löschen</Text>
            </TouchableOpacity>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/product/${item.barcode}`)}
            activeOpacity={0.75}
          >
            {item.imageUrl ? (
              <Image source={{ uri: item.imageUrl }} style={styles.productImage} resizeMode="contain" />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Text style={styles.imagePlaceholderText}>📦</Text>
              </View>
            )}
            <View style={styles.cardContent}>
              <Text style={styles.cardName} numberOfLines={2}>{item.productName}</Text>
              {item.brand && <Text style={styles.cardBrand}>{item.brand}</Text>}
              <Text style={styles.cardTime}>{formatDate(item.scannedAt)}</Text>
              <View style={styles.scoreBadges}>
                {item.nutriscore && (
                  <View
                    style={[styles.badge, { backgroundColor: getNutriScoreColor(item.nutriscore) + '22', borderColor: getNutriScoreColor(item.nutriscore) }]}
                  >
                    <Text style={[styles.badgeText, { color: getNutriScoreColor(item.nutriscore) }]}>
                      {item.nutriscore.toUpperCase()}
                    </Text>
                  </View>
                )}
                {item.ecoscore && (
                  <View
                    style={[styles.badge, { backgroundColor: getEcoScoreColor(item.ecoscore) + '22', borderColor: getEcoScoreColor(item.ecoscore) }]}
                  >
                    <Text style={[styles.badgeText, { color: getEcoScoreColor(item.ecoscore) }]}>
                      Eco {item.ecoscore.toUpperCase()}
                    </Text>
                  </View>
                )}
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#4B5563" style={styles.chevron} />
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}
