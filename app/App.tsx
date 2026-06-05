import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useCallback, useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryProvider } from '@/api/QueryProvider';
import { AnimatedSplash } from '@/components';
import { RootNavigator } from '@/navigation/RootNavigator';
import { useSettingsStore } from '@/store/settingsStore';
import { SkyProvider } from '@/theme/SkyContext';

// Keep the native splash up until we're ready; it fades out (configured in app.json).
SplashScreen.preventAutoHideAsync().catch(() => {});

// Minimum time the branded splash stays visible, so it never just flashes.
const MIN_SPLASH_MS = 1000;

export default function App() {
  const hydrated = useSettingsStore((s) => s.hydrated);
  const [minTimePassed, setMinTimePassed] = useState(false);
  const [splashGone, setSplashGone] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMinTimePassed(true), MIN_SPLASH_MS);
    return () => clearTimeout(t);
  }, []);

  // App is ready once persisted settings have loaded and the min time elapsed.
  const ready = hydrated && minTimePassed;

  // Hand off from the native splash to our animated overlay as soon as the
  // first frame can render, so there's no white flash between them.
  const onLayoutRoot = useCallback(() => {
    SplashScreen.hideAsync().catch(() => {});
  }, []);

  return (
    <SafeAreaProvider onLayout={onLayoutRoot}>
      <QueryProvider>
        <SkyProvider>
          <StatusBar style="auto" />
          <RootNavigator />
          {!splashGone && (
            <AnimatedSplash ready={ready} onFinish={() => setSplashGone(true)} />
          )}
        </SkyProvider>
      </QueryProvider>
    </SafeAreaProvider>
  );
}
