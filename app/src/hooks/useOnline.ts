import NetInfo from '@react-native-community/netinfo';
import { useEffect, useState } from 'react';

/**
 * Tracks network connectivity. Returns true when the device is online.
 * Used to show an offline banner and switch the UI to cached-data mode.
 */
export function useOnline(): boolean {
  const [online, setOnline] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      // isInternetReachable can be null while unknown — treat null as online
      // so we don't flash an offline banner before the first real check.
      const reachable = state.isInternetReachable;
      setOnline(Boolean(state.isConnected) && reachable !== false);
    });
    return unsubscribe;
  }, []);

  return online;
}
