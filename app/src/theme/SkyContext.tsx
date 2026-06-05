import { createContext, ReactNode, useContext, useMemo, useState } from 'react';
import {
  conditionFromText,
  resolveSky,
  Sky,
  SkyCondition,
  timeOfDayFromHour,
  TimeOfDay,
} from './sky';
import { useTheme } from './useTheme';

type SkyInput = {
  condition?: SkyCondition;
  conditionText?: string;
  hour?: number;
  timeOfDay?: TimeOfDay;
};

type SkyContextValue = {
  sky: Sky | null;
  setSky: (input: SkyInput | null) => void;
};

const SkyContext = createContext<SkyContextValue | undefined>(undefined);

export function SkyProvider({ children }: { children: ReactNode }) {
  const { scheme } = useTheme();
  const [input, setInput] = useState<SkyInput | null>(null);

  const sky = useMemo<Sky | null>(() => {
    if (!input) return null;
    const condition: SkyCondition =
      input.condition ?? conditionFromText(input.conditionText);
    const tod: TimeOfDay =
      input.timeOfDay ??
      (input.hour != null ? timeOfDayFromHour(input.hour) : 'day');
    return resolveSky(condition, tod, scheme);
  }, [input, scheme]);

  const value = useMemo<SkyContextValue>(() => ({ sky, setSky: setInput }), [sky]);

  return <SkyContext.Provider value={value}>{children}</SkyContext.Provider>;
}

export function useSky(): SkyContextValue {
  const ctx = useContext(SkyContext);
  if (!ctx) throw new Error('useSky must be used within <SkyProvider>');
  return ctx;
}
