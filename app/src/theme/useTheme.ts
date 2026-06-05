import { useColorScheme } from 'react-native';
import { Colors, ColorScheme, darkColors, lightColors } from './index';

type ActiveTheme = {
  colors: Colors;
  scheme: ColorScheme;
  isDark: boolean;
};

/**
 * Returns the active palette based on the phone's system color scheme.
 * Re-renders automatically when the user switches light/dark on their device.
 */
export function useTheme(): ActiveTheme {
  const system = useColorScheme();
  const scheme: ColorScheme = system === 'dark' ? 'dark' : 'light';
  return {
    colors: scheme === 'dark' ? darkColors : lightColors,
    scheme,
    isDark: scheme === 'dark',
  };
}
