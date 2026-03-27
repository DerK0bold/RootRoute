import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#006EB7' },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: { fontWeight: 'bold' },
          contentStyle: { backgroundColor: '#F8FAFC' },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="product/[barcode]"
          options={{
            title: 'Produkt Details',
            headerBackTitle: 'Zurück',
          }}
        />
        <Stack.Screen
          name="tracking/[orderId]"
          options={{
            title: 'Lieferverfolgung',
            headerBackTitle: 'Zurück',
          }}
        />
        <Stack.Screen
          name="productAi/[barcode]"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="liveMap"
          options={{
            headerShown: false,
            presentation: 'fullScreenModal',
          }}
        />
      </Stack>
    </>
  );
}
