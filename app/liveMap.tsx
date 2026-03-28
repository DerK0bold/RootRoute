import { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Animated, Easing } from 'react-native';
import styles from '../styles/liveMap.styles';
import MapView, { Marker, Polyline, PROVIDER_DEFAULT, Callout } from 'react-native-maps';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { getOrCreateOrder, Order } from '../services/orderTracking';

export default function LiveMapScreen() {
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [mapType, setMapType] = useState<'standard' | 'satellite'>('standard');
  // This animation creates the "pulsing" effect for the truck on the map,
  // making the UI feel alive and real-time.
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    if (orderId) {
      const found = getOrCreateOrder(decodeURIComponent(orderId));
      setOrder(found);
    }
  }, [orderId]);

  // Pulsing animation for the active marker
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.4, duration: 800, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 800, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    ).start();
  }, []);

  if (!order) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Bestellung nicht gefunden</Text>
      </View>
    );
  }

  const eventsWithCoords = order.events.filter((e) => e.coordinate);
  const activeEvent = order.events.find((e) => e.status === 'active');
  const completedEvents = order.events.filter((e) => e.status === 'completed' && e.coordinate);

  const routeCoordinates = eventsWithCoords
    .filter((e) => e.status === 'completed' || e.status === 'active')
    .map((e) => e.coordinate!);

  const centerCoord = activeEvent?.coordinate ?? order.destination;

  const fitAllMarkers = () => {
    if (mapRef.current && eventsWithCoords.length > 0) {
      mapRef.current.fitToCoordinates(
        [...eventsWithCoords.map((e) => e.coordinate!), order.destination],
        { edgePadding: { top: 80, right: 60, bottom: 220, left: 60 }, animated: true }
      );
    }
  };

  const toggleMapType = () => {
    setMapType(prev => prev === 'standard' ? 'satellite' : 'standard');
  };

  const focusOnCoordinate = (coord: { latitude: number, longitude: number }) => {
    mapRef.current?.animateToRegion({
      ...coord,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    }, 1000);
  };

  const focusOnActive = () => {
    if (activeEvent?.coordinate) {
      focusOnCoordinate(activeEvent.coordinate);
    }
  };

  const zoomIn = async () => {
    const camera = await mapRef.current?.getCamera();
    if (camera) {
      mapRef.current?.animateCamera({ zoom: (camera.zoom || 10) + 1 }, { duration: 400 });
    }
  };

  const zoomOut = async () => {
    const camera = await mapRef.current?.getCamera();
    if (camera) {
      mapRef.current?.animateCamera({ zoom: (camera.zoom || 10) - 1 }, { duration: 400 });
    }
  };

  return (
    <View style={styles.container}>
      {/* Back button */}
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={22} color="#fff" />
      </TouchableOpacity>

      {/* Fit button */}
      <TouchableOpacity style={styles.fitBtn} onPress={fitAllMarkers}>
        <Ionicons name="expand-outline" size={20} color="#fff" />
      </TouchableOpacity>

      {/* Map type toggle */}
      <TouchableOpacity style={styles.mapTypeBtn} onPress={toggleMapType}>
        <Ionicons name={mapType === 'standard' ? "earth" : "map-outline"} size={20} color="#fff" />
      </TouchableOpacity>

      {/* Re-center active button */}
      {activeEvent?.coordinate && (
        <TouchableOpacity style={styles.reCenterBtn} onPress={focusOnActive}>
          <MaterialCommunityIcons name="crosshairs-gps" size={20} color="#fff" />
        </TouchableOpacity>
      )}

      {/* Zoom controls */}
      <View style={styles.zoomContainer}>
        <TouchableOpacity style={styles.zoomBtn} onPress={zoomIn}>
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.zoomBtn, styles.zoomOutBtn]} onPress={zoomOut}>
          <Ionicons name="remove" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

        {/* 
          We use Google Maps as the provider for a premium feel. 
          The initial region is centered on the current movement.
        */}
        <MapView
          ref={mapRef}
          style={styles.map}
          provider={PROVIDER_DEFAULT}
        initialRegion={{
          latitude: centerCoord.latitude,
          longitude: centerCoord.longitude,
          latitudeDelta: 0.8,
          longitudeDelta: 0.8,
        }}
        onMapReady={fitAllMarkers}
        mapType={mapType}
        showsUserLocation={true}
        showsCompass={true}
        showsScale={true}
      >
        {/* Completed route line */}
        {routeCoordinates.length > 1 && (
          <Polyline
            coordinates={routeCoordinates}
            strokeColor="#006EB7"
            strokeWidth={3}
            lineDashPattern={[0]}
          />
        )}

        {/* Pending route line */}
        {activeEvent?.coordinate && (
          <Polyline
            coordinates={[activeEvent.coordinate, order.destination]}
            strokeColor="#94A3B8"
            strokeWidth={2}
            lineDashPattern={[8, 6]}
          />
        )}

        {/* Completed station markers */}
        {completedEvents.map((event) => (
          <Marker
            key={event.id}
            coordinate={event.coordinate!}
            anchor={{ x: 0.5, y: 0.5 }}
            onPress={() => focusOnCoordinate(event.coordinate!)}
          >
            <View style={styles.completedDot}>
              <Ionicons name="checkmark" size={10} color="#fff" />
            </View>
            <Callout tooltip>
              <View style={styles.calloutContainer}>
                <Text style={styles.calloutTitle}>{event.title}</Text>
                <Text style={styles.calloutLocation}>{event.location}</Text>
                <Text style={styles.calloutTime}>{event.timestamp}</Text>
                {(event.temperature !== undefined || event.humidity !== undefined) && (
                  <View style={styles.calloutIot}>
                    {event.temperature !== undefined && (
                      <View style={styles.iotItem}>
                        <MaterialCommunityIcons name="thermometer" size={14} color="#006EB7" />
                        <Text style={styles.iotText}>{event.temperature}°C</Text>
                      </View>
                    )}
                    {event.humidity !== undefined && (
                      <View style={styles.iotItem}>
                        <MaterialCommunityIcons name="water-percent" size={16} color="#006EB7" />
                        <Text style={styles.iotText}>{event.humidity}%</Text>
                      </View>
                    )}
                  </View>
                )}
              </View>
            </Callout>
          </Marker>
        ))}

        {/* Active / current position marker */}
        {activeEvent?.coordinate && (
          <Marker
            coordinate={activeEvent.coordinate}
            anchor={{ x: 0.5, y: 0.5 }}
            onPress={() => focusOnCoordinate(activeEvent.coordinate!)}
          >
            <View style={styles.activeMarkerContainer}>
              <Animated.View style={[styles.activePulse, { transform: [{ scale: pulseAnim }] }]} />
              <View style={styles.activeMarker}>
                <Text style={styles.activeMarkerEmoji}>🚚</Text>
              </View>
            </View>
            <Callout tooltip>
              <View style={[styles.calloutContainer, styles.calloutActive]}>
                <View style={styles.activeBadge}>
                  <View style={styles.activeDot} />
                  <Text style={styles.activeBadgeText}>AKTUELL</Text>
                </View>
                <Text style={styles.calloutTitle}>{activeEvent.title}</Text>
                <Text style={styles.calloutLocation}>{activeEvent.location}</Text>
                {(activeEvent.temperature !== undefined || activeEvent.humidity !== undefined) && (
                  <View style={styles.calloutIot}>
                    {activeEvent.temperature !== undefined && (
                      <View style={styles.iotItem}>
                        <MaterialCommunityIcons name="thermometer" size={14} color="#006EB7" />
                        <Text style={styles.iotText}>{activeEvent.temperature}°C</Text>
                      </View>
                    )}
                    {activeEvent.humidity !== undefined && (
                      <View style={styles.iotItem}>
                        <MaterialCommunityIcons name="water-percent" size={16} color="#006EB7" />
                        <Text style={styles.iotText}>{activeEvent.humidity}%</Text>
                      </View>
                    )}
                  </View>
                )}
              </View>
            </Callout>
          </Marker>
        )}

        {/* 
          Destination: The final stop for the delivery.
          Matches the "Last Mile" logistics simulation.
        */}
        <Marker
          coordinate={order.destination}
          anchor={{ x: 0.5, y: 1 }}
          onPress={() => focusOnCoordinate(order.destination)}
        >
          <View style={styles.destinationMarker}>
            <Text style={styles.destinationEmoji}>🏠</Text>
          </View>
          <Callout tooltip>
            <View style={styles.calloutContainer}>
              <Text style={styles.calloutTitle}>Zieladresse</Text>
              <Text style={styles.calloutLocation}>Baden</Text>
            </View>
          </Callout>
        </Marker>
      </MapView>

      {/* Bottom info card */}
      <View style={styles.bottomCard}>
        <View style={styles.cardHeader}>
          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>LIVE</Text>
          </View>
          <Text style={styles.cardRetailer}>{order.retailer} #{order.orderId}</Text>
        </View>

        <Text style={styles.cardProductName} numberOfLines={1}>{order.productName}</Text>

        {activeEvent && (
          <View style={styles.statusRow}>
            <Text style={styles.statusEmoji}>{activeEvent.icon}</Text>
            <View style={styles.statusText}>
              <Text style={styles.statusTitle}>{activeEvent.title}</Text>
              <Text style={styles.statusLocation}>{activeEvent.location}</Text>
            </View>
          </View>
        )}

        {/* Step indicators */}
        <View style={styles.steps}>
          {order.events.map((event, i) => (
            <View
              key={event.id}
              style={[
                styles.stepDot,
                event.status === 'completed' && styles.stepCompleted,
                event.status === 'active' && styles.stepActive,
              ]}
            />
          ))}
        </View>

        <View style={styles.deliveryRow}>
          <Ionicons name="time-outline" size={14} color="#9CA3AF" />
          <Text style={styles.deliveryText}>Lieferung: {order.estimatedDelivery}</Text>
        </View>
      </View>
    </View>
  );
}

