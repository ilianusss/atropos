import { useContext, useEffect } from 'react';
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppProvider, HydratedContext } from '../store/AppContext';

SplashScreen.preventAutoHideAsync();

function AppContent() {
  const hydrated = useContext(HydratedContext);

  const [fontsLoaded, fontError] = useFonts({
    'LondrinaSolid-Regular': require('../assets/fonts/LondrinaSolid/LondrinaSolid-Regular.ttf'),
    'LondrinaSolid-Light': require('../assets/fonts/LondrinaSolid/LondrinaSolid-Light.ttf'),
    'LondrinaSolid-Black': require('../assets/fonts/LondrinaSolid/LondrinaSolid-Black.ttf'),
    'Poppins-Regular': require('../assets/fonts/Poppins/Poppins-Regular.ttf'),
    'Poppins-Medium': require('../assets/fonts/Poppins/Poppins-Medium.ttf'),
    'Poppins-SemiBold': require('../assets/fonts/Poppins/Poppins-SemiBold.ttf'),
  });

  const ready = (fontsLoaded || !!fontError) && hydrated;

  useEffect(() => {
    if (ready) {
      SplashScreen.hideAsync();
    }
  }, [ready]);

  if (!ready) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen
        name="game/[id]"
        options={{
          presentation: 'card',
          animation: 'slide_from_right',
        }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </GestureHandlerRootView>
  );
}
