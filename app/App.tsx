import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryProvider } from '@/api/QueryProvider';
import { RootNavigator } from '@/navigation/RootNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <QueryProvider>
        <StatusBar style="light" />
        <RootNavigator />
      </QueryProvider>
    </SafeAreaProvider>
  );
}
