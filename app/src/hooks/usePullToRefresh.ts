import { useCallback, useState } from 'react';
import { RefreshResult } from './useAppWeather';

/**
 * Shared pull-to-refresh state for the weather screens.
 * - `pulling` drives the RefreshControl spinner.
 * - On a cooldown result, briefly flips `upToDate` so the UI can confirm
 *   "Already up to date" without any banner or countdown.
 */
export function usePullToRefresh(refresh: () => Promise<RefreshResult>) {
  const [pulling, setPulling] = useState(false);
  const [upToDate, setUpToDate] = useState(false);

  const onRefresh = useCallback(async () => {
    setPulling(true);
    const result = await refresh();
    if (result.status === 'cooldown') {
      setUpToDate(true);
      setTimeout(() => setUpToDate(false), 2000);
    }
    setPulling(false);
  }, [refresh]);

  return { pulling, upToDate, onRefresh };
}
