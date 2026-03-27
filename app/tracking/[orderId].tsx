import { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { getOrCreateOrder, Order, TrackingEvent } from '../../services/orderTracking';
import { scheduleDeliveryNotifications } from '../../services/notifications';

interface TempReading {
  location: string;
  icon: string;
  temp: number;
  humidity?: number;
  targetMin: number;
  targetMax: number;
  time: string;
  ok: boolean;
}

function generateIoTData(orderId: string, events: TrackingEvent[]): TempReading[] {
  // Use the data added to TrackingEvent in orderTracking.ts
  return events
    .filter(evt => evt.temperature !== undefined)
    .map(evt => ({
      location: evt.location.split(',')[0],
      icon: evt.icon,
      temp: evt.temperature!,
      humidity: evt.humidity,
      targetMin: 2,
      targetMax: 8,
      time: evt.timestamp.split(',')[0] || evt.timestamp,
      ok: evt.temperature! <= 8 && evt.temperature! >= 2,
    }));
}

export default function TrackingDetailScreen() {
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [notificationsActive, setNotificationsActive] = useState(false);

  useEffect(() => {
    if (orderId) {
      const found = getOrCreateOrder(decodeURIComponent(orderId));
      setOrder(found);
    }
  }, [orderId]);

  const handleNotifications = async () => {
    if (notificationsActive) {
      Alert.alert('Benachrichtigungen', 'Benachrichtigungen sind bereits aktiv.');
      return;
    }
    if (!order) return;
    const success = await scheduleDeliveryNotifications(
      order.orderId,
      order.productName,
      order.retailer
    );
    if (success) {
      setNotificationsActive(true);
      Alert.alert(
        '✅ Benachrichtigungen aktiviert',
        'Du wirst über Statusänderungen informiert. In ~30 Sek. kommt ein Demo-Update.'
      );
    } else {
      Alert.alert(
        'Kein Zugriff',
        'Bitte erlaube Benachrichtigungen in den App-Einstellungen.'
      );
    }
  };

  const handleOpenMap = () => {
    router.push({ pathname: '/liveMap', params: { orderId: order!.orderId } });
  };

  if (!order) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorIcon}>📦</Text>
        <Text style={styles.errorTitle}>Bestellung nicht gefunden</Text>
        <Text style={styles.errorText}>ID: {orderId}</Text>
      </View>
    );
  }

  const activeIndex = order.events.findIndex((e) => e.status === 'active');
  const activeEvent = order.events[activeIndex];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <LinearGradient colors={['#006EB7', '#004B87']} style={styles.header}>
        <View style={styles.retailerRow}>
          <Text style={styles.retailerLogo}>{order.retailerLogo}</Text>
          <View>
            <Text style={styles.retailerName}>{order.retailer} Online</Text>
            <Text style={styles.orderId}>#{order.orderId}</Text>
          </View>
        </View>
        <Text style={styles.productName}>{order.productName}</Text>
        <View style={styles.statusBadge}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>{order.currentStatus}</Text>
        </View>
        <View style={styles.deliveryRow}>
          <Ionicons name="calendar-outline" size={16} color="#E0F2FE" />
          <Text style={styles.deliveryText}>Lieferung: {order.estimatedDelivery}</Text>
        </View>
      </LinearGradient>

      {/* Live Status */}
      {activeEvent && (
        <View style={styles.liveCard}>
          <View style={styles.liveIndicator}>
            <View style={styles.liveDot} />
            <Text style={styles.liveLabel}>LIVE STATUS</Text>
          </View>
          <Text style={styles.liveTitle}>{activeEvent.title}</Text>
          <Text style={styles.liveDescription}>{activeEvent.description}</Text>
          <View style={styles.liveLocationRow}>
            <Ionicons name="location-outline" size={14} color="#006EB7" />
            <Text style={styles.liveLocation}>{activeEvent.location}</Text>
          </View>
        </View>
      )}

      {/* MAP BUTTON - prominent */}
      <TouchableOpacity style={styles.mapButton} onPress={handleOpenMap} activeOpacity={0.85}>
        <LinearGradient
          colors={['#006EB7', '#004B87']}
          style={styles.mapButtonGradient}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
        >
          <View style={styles.mapButtonLeft}>
            <Text style={styles.mapButtonEmoji}>🗺️</Text>
            <View>
              <Text style={styles.mapButtonTitle}>Live auf Karte verfolgen</Text>
              <Text style={styles.mapButtonSubtitle}>Aktuellen Standort des Pakets anzeigen</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#BAE6FD" />
        </LinearGradient>
      </TouchableOpacity>

      {/* Progress bar */}
      <View style={styles.progressSection}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${((activeIndex + 1) / order.events.length) * 100}%` }]} />
        </View>
        <Text style={styles.progressText}>{activeIndex + 1} von {order.events.length} Schritten</Text>
      </View>

      {/* Timeline */}
      <View style={styles.timeline}>
        <Text style={styles.timelineTitle}>📍 Lieferverlauf</Text>
        {order.events.map((event, index) => (
          <TimelineItem key={event.id} event={event} isLast={index === order.events.length - 1} />
        ))}
      </View>

      {/* IoT Temperaturüberwachung */}
      <View style={styles.iotSection}>
        <Text style={styles.iotTitle}>🌡️ Kühlketten-Monitor (IoT)</Text>
        <Text style={styles.iotSubtitle}>Echtzeit-Sensordaten aus dem Transportbehälter</Text>
        {generateIoTData(order.orderId, order.events).map((reading, i) => (
          <View key={i} style={[styles.iotCard, reading.ok ? styles.iotOk : styles.iotAlert]}>
            <View style={styles.iotCardLeft}>
              <Text style={styles.iotIcon}>{reading.icon}</Text>
              <View>
                <Text style={styles.iotLocation}>{reading.location}</Text>
                <Text style={styles.iotTime}>{reading.time}</Text>
                {reading.humidity !== undefined && (
                  <View style={styles.iotSensorSmallBadge}>
                    <Ionicons name="water-outline" size={10} color="#64748B" />
                    <Text style={styles.iotSensorSmallText}>{reading.humidity}% rH</Text>
                  </View>
                )}
              </View>
            </View>
            <View style={styles.iotCardRight}>
              <Text style={[styles.iotTemp, { color: reading.ok ? '#10B981' : '#EF4444' }]}>
                {reading.temp}°C
              </Text>
              <Text style={styles.iotTarget}>Ziel: {reading.targetMin}–{reading.targetMax}°C</Text>
              <View style={[styles.iotBadge, reading.ok ? styles.iotBadgeOk : styles.iotBadgeAlert]}>
                <Text style={[styles.iotBadgeText, { color: reading.ok ? '#10B981' : '#EF4444' }]}>
                  {reading.ok ? '✓ OK' : '⚠ Alarm'}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </View>

      {/* Supply Chain */}
      <View style={styles.supplySection}>
        <Text style={styles.supplySectionTitle}>🌍 Lieferkette</Text>
        <Text style={styles.supplySectionSubtitle}>Bevor dein Produkt zu dir kommt, reist es durch mehrere Stationen.</Text>
        <View style={styles.supplySteps}>
          <SupplyStep emoji="🌱" title="Rohstoffe" desc="Weltweit" />
          <Text style={styles.supplyArrow}>→</Text>
          <SupplyStep emoji="🏭" title="Produktion" desc="Verarbeitung" />
          <Text style={styles.supplyArrow}>→</Text>
          <SupplyStep emoji="🏪" title={order.retailer} desc="Händler" />
          <Text style={styles.supplyArrow}>→</Text>
          <SupplyStep emoji="🏠" title="Du" desc="Zuhause" />
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionBtn, notificationsActive && styles.actionBtnActive]}
          onPress={handleNotifications}
        >
          <Ionicons
            name={notificationsActive ? 'notifications' : 'notifications-outline'}
            size={20}
            color={notificationsActive ? '#006EB7' : '#006EB7'}
          />
          <View style={styles.actionTextBlock}>
            <Text style={styles.actionText}>
              {notificationsActive ? 'Benachrichtigungen aktiv ✓' : 'Benachrichtigungen aktivieren'}
            </Text>
            {!notificationsActive && (
              <Text style={styles.actionSubtext}>Werde über Statusänderungen informiert</Text>
            )}
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.mapActionBtn} onPress={handleOpenMap}>
          <Ionicons name="map-outline" size={20} color="#006EB7" />
          <Text style={[styles.actionText, { color: '#006EB7' }]}>Auf Karte anzeigen</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

function TimelineItem({ event, isLast }: { event: TrackingEvent; isLast: boolean }) {
  const isCompleted = event.status === 'completed';
  const isActive = event.status === 'active';
  const isPending = event.status === 'pending';

  return (
    <View style={styles.timelineItem}>
      <View style={styles.timelineLeft}>
        <View style={[
          styles.timelineDot,
          isCompleted && styles.dotCompleted,
          isActive && styles.dotActive,
          isPending && styles.dotPending,
        ]}>
          {isCompleted && <Ionicons name="checkmark" size={12} color="#fff" />}
          {isActive && <View style={styles.dotInner} />}
        </View>
        {!isLast && (
          <View style={[styles.timelineLine, (isCompleted || isActive) && styles.lineCompleted]} />
        )}
      </View>
      <View style={[styles.timelineContent, isPending && styles.contentPending]}>
        <View style={styles.timelineRow}>
          <Text style={styles.timelineEventIcon}>{event.icon}</Text>
          <View style={styles.timelineTextArea}>
            <Text style={[styles.timelineEventTitle, isPending && styles.textPending, isActive && styles.textActive]}>
              {event.title}
            </Text>
            <Text style={[styles.timelineEventDesc, isPending && styles.textPending]}>
              {event.description}
            </Text>
            
            {event.temperature !== undefined && (
              <View style={styles.timelineIotBadge}>
                <Ionicons name="thermometer" size={10} color={event.temperature > 8 ? '#EF4444' : '#10B981'} />
                <Text style={[styles.timelineIotText, event.temperature > 8 && { color: '#EF4444' }]}>
                  {event.temperature}°C
                </Text>
                {event.humidity !== undefined && (
                  <>
                    <View style={styles.timelineIotDivider} />
                    <Ionicons name="water" size={10} color="#006EB7" />
                    <Text style={styles.timelineIotText}>{event.humidity}% rH</Text>
                  </>
                )}
              </View>
            )}

            <View style={styles.timelineLocationRow}>
              <Ionicons name="location-outline" size={12} color={isPending ? '#4B5563' : '#6B7280'} />
              <Text style={[styles.timelineLocation, isPending && styles.textPending]}>{event.location}</Text>
            </View>
            <Text style={[styles.timelineTimestamp, isPending && styles.textPending]}>{event.timestamp}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

function SupplyStep({ emoji, title, desc }: { emoji: string; title: string; desc: string }) {
  return (
    <View style={styles.supplyStep}>
      <Text style={styles.supplyStepEmoji}>{emoji}</Text>
      <Text style={styles.supplyStepTitle}>{title}</Text>
      <Text style={styles.supplyStepDesc}>{desc}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, backgroundColor: '#F8FAFC' },
  errorIcon: { fontSize: 64, marginBottom: 16 },
  errorTitle: { color: '#1E293B', fontSize: 22, fontWeight: '700', marginBottom: 8 },
  errorText: { color: '#64748B', fontSize: 14 },

  header: { padding: 24, paddingTop: 32 },
  retailerRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  retailerLogo: { fontSize: 40 },
  retailerName: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  orderId: { color: '#E0F2FE', fontSize: 13, marginTop: 2, opacity: 0.8 },
  productName: { color: '#FFFFFF', fontSize: 18, fontWeight: '600', marginBottom: 12 },
  statusBadge: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF',
    alignSelf: 'flex-start', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6,
    gap: 6, marginBottom: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 1
  },
  statusDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#006EB7' },
  statusText: { color: '#006EB7', fontSize: 13, fontWeight: '700' },
  deliveryRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  deliveryText: { color: '#E0F2FE', fontSize: 14 },

  liveCard: {
    margin: 16, backgroundColor: '#FFFFFF', borderRadius: 16,
    padding: 18, borderWidth: 1, borderColor: '#E2E8F0',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2
  },
  liveIndicator: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#006EB7' },
  liveLabel: { color: '#006EB7', fontSize: 11, fontWeight: '800', letterSpacing: 1 },
  liveTitle: { color: '#1E293B', fontSize: 16, fontWeight: '700', marginBottom: 4 },
  liveDescription: { color: '#64748B', fontSize: 14, lineHeight: 20, marginBottom: 8 },
  liveLocationRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  liveLocation: { color: '#006EB7', fontSize: 13 },

  mapButton: { marginHorizontal: 16, marginBottom: 16, borderRadius: 16, overflow: 'hidden', shadowColor: '#006EB7', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
  mapButtonGradient: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: 18, gap: 12,
  },
  mapButtonLeft: { flexDirection: 'row', alignItems: 'center', gap: 14, flex: 1 },
  mapButtonEmoji: { fontSize: 32 },
  mapButtonTitle: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  mapButtonSubtitle: { color: '#E0F2FE', fontSize: 12, marginTop: 2 },

  progressSection: { marginHorizontal: 16, marginBottom: 8 },
  progressBar: { height: 6, backgroundColor: '#E2E8F0', borderRadius: 3, overflow: 'hidden', marginBottom: 6 },
  progressFill: { height: '100%', backgroundColor: '#006EB7', borderRadius: 3 },
  progressText: { color: '#94A3B8', fontSize: 12, textAlign: 'right' },

  timeline: { margin: 16 },
  timelineTitle: { color: '#1E293B', fontSize: 16, fontWeight: '700', marginBottom: 16 },
  timelineItem: { flexDirection: 'row', gap: 12 },
  timelineLeft: { alignItems: 'center', width: 28 },
  timelineDot: {
    width: 28, height: 28, borderRadius: 14, backgroundColor: '#FFFFFF',
    alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#CBD5E1', zIndex: 1,
  },
  dotCompleted: { backgroundColor: '#006EB7', borderColor: '#006EB7' },
  dotActive: { backgroundColor: '#FFFFFF', borderColor: '#006EB7' },
  dotPending: { backgroundColor: '#F8FAFC', borderColor: '#E2E8F0' },
  dotInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#006EB7' },
  timelineLine: { width: 2, flex: 1, backgroundColor: '#E2E8F0', marginVertical: 2 },
  lineCompleted: { backgroundColor: '#006EB7' },
  timelineContent: { flex: 1, paddingBottom: 20 },
  contentPending: { opacity: 0.5 },
  timelineRow: { flexDirection: 'row', gap: 10 },
  timelineEventIcon: { fontSize: 22, marginTop: 2 },
  timelineTextArea: { flex: 1 },
  timelineEventTitle: { color: '#1E293B', fontSize: 14, fontWeight: '700', marginBottom: 3 },
  textPending: { color: '#94A3B8' },
  textActive: { color: '#006EB7' },
  timelineEventDesc: { color: '#64748B', fontSize: 13, lineHeight: 18, marginBottom: 4 },
  timelineLocationRow: { flexDirection: 'row', alignItems: 'center', gap: 3, marginBottom: 2 },
  timelineLocation: { color: '#94A3B8', fontSize: 12 },
  timelineTimestamp: { color: '#94A3B8', fontSize: 11 },
  timelineIotBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
    marginBottom: 6,
    alignSelf: 'flex-start',
    gap: 4,
  },
  timelineIotText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#475569',
  },
  timelineIotDivider: {
    width: 1,
    height: 8,
    backgroundColor: '#CBD5E1',
    marginHorizontal: 2,
  },

  supplySection: { marginHorizontal: 16, marginBottom: 20 },
  supplySectionTitle: { color: '#1E293B', fontSize: 16, fontWeight: '700', marginBottom: 6 },
  supplySectionSubtitle: { color: '#64748B', fontSize: 13, marginBottom: 16, lineHeight: 18 },
  supplySteps: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF',
    borderRadius: 14, padding: 16, gap: 4, borderWidth: 1, borderColor: '#E2E8F0', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1
  },
  supplyStep: { flex: 1, alignItems: 'center' },
  supplyStepEmoji: { fontSize: 22, marginBottom: 4 },
  supplyStepTitle: { color: '#334155', fontSize: 10, fontWeight: '700', textAlign: 'center' },
  supplyStepDesc: { color: '#94A3B8', fontSize: 9, textAlign: 'center', marginTop: 2 },
  supplyArrow: { color: '#CBD5E1', fontSize: 14 },

  iotSection: { marginHorizontal: 16, marginBottom: 20 },
  iotTitle: { color: '#1E293B', fontSize: 16, fontWeight: '700', marginBottom: 4 },
  iotSubtitle: { color: '#64748B', fontSize: 12, marginBottom: 14 },
  iotCard: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    borderRadius: 12, padding: 14, marginBottom: 10, borderWidth: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1
  },
  iotOk: { backgroundColor: '#F0FDF4', borderColor: '#BBF7D0' },
  iotAlert: { backgroundColor: '#FEF2F2', borderColor: '#FECACA' },
  iotCardLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  iotIcon: { fontSize: 22 },
  iotLocation: { color: '#1E293B', fontSize: 13, fontWeight: '600' },
  iotTime: { color: '#64748B', fontSize: 11, marginTop: 2 },
  iotCardRight: { alignItems: 'flex-end', gap: 4 },
  iotTemp: { fontSize: 20, fontWeight: '800' },
  iotTarget: { color: '#64748B', fontSize: 11 },
  iotBadge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2, borderWidth: 1 },
  iotBadgeOk: { borderColor: '#10B981', backgroundColor: '#DCFCE7' },
  iotBadgeAlert: { borderColor: '#EF4444', backgroundColor: '#FEE2E2' },
  iotBadgeText: { fontSize: 11, fontWeight: '700' },
  iotSensorSmallBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  iotSensorSmallText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },

  actions: { marginHorizontal: 16, gap: 10 },
  actionBtn: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF',
    borderRadius: 12, padding: 16, gap: 12, borderWidth: 1, borderColor: '#E2E8F0', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1
  },
  actionBtnActive: { borderColor: '#006EB7', backgroundColor: '#F0F9FF' },
  mapActionBtn: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF',
    borderRadius: 12, padding: 16, gap: 12, borderWidth: 1, borderColor: '#E2E8F0', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1
  },
  actionTextBlock: { flex: 1 },
  actionText: { color: '#006EB7', fontSize: 14, fontWeight: '600' },
  actionSubtext: { color: '#64748B', fontSize: 11, marginTop: 2 },
});
