import { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import styles from '../../styles/orderId.styles';
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

