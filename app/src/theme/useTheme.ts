import { useColorScheme } from 'react-native';
import { useSettingsStore } from '@/store/settingsStore';
import { Colors, ColorScheme, darkColors, lightColors } from './index';

type ActiveTheme = {
  colors: Colors;
  scheme: ColorScheme;
  isDark: boolean;
};

/**
 * Returns the active palette. Honours the user's theme preference:
 *   'auto'  -> follow the device color scheme
 *   'light' -> always light
 *   'dark'  -> always dark
 * Re-renders when either the device scheme or the user's choice changes.
 */
export function useTheme(): ActiveTheme {
  const system = useColorScheme();
  const mode = useSettingsStore((s) => s.themeMode);

  const scheme: ColorScheme =
    mode === 'light'
      ? 'light'
      : mode === 'dark'
        ? 'dark'
        : system === 'dark'
          ? 'dark'
          : 'light';

  return {
    colors: scheme === 'dark' ? darkColors : lightColors,
    scheme,
    isDark: scheme === 'dark',
  };
}
