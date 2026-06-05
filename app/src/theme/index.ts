/**
 * SkySync design tokens — premium theme with automatic light/dark support.
 *
 * Light: white background, deep-navy text, sky-blue accents.
 * Dark:  deep-navy background, light text, same sky-blue accents.
 * Inspired by Apple Weather + Linear. The active palette follows the phone's
 * system color scheme (see useTheme()).
 */

const palette = {
  // Shared brand blues (same in both schemes for a consistent accent)
  blue: '#3B82F6',
  blueDeep: '#2563EB',
  blueLight: '#60A5FA',
  success: '#22C55E',
  warning: '#F59E0B',
  danger: '#EF4444',
  white: '#FFFFFF',
} as const;

type ColorTokens = {
  background: string;
  backgroundAlt: string;
  surface: string;
  /** Translucent card fill that sits over the weather gradient. */
  cardSurface: string;
  surfaceMuted: string;
  primary: string;
  primaryDark: string;
  highlight: string;
  accent: string;
  cloud: string;
  tabActive: string;
  text: string;
  textMuted: string;
  textFaint: string;
  /** Warm accent for small section labels (adds life; contrast-tuned). */
  label: string;
  onPrimary: string;
  success: string;
  warning: string;
  danger: string;
  border: string;
  overlay: string;
  shadowColor: string;
  shadowOpacity: number;
  // Ambient weather backdrop
  gradient: [string, string, string]; // top -> bottom background wash
  glowSun: string; // warm radial glow (top-right)
  glowSky: string; // cool radial glow (lower-left)
};

export const lightColors: ColorTokens = {
  // Surfaces
  background: palette.white,
  backgroundAlt: '#F8FAFC',
  surface: '#F8FAFC',
  cardSurface: 'rgba(255,255,255,0.85)', // frosted white over the gradient
  surfaceMuted: '#EEF2F7',

  // Brand
  primary: palette.blue,
  primaryDark: palette.blueDeep,
  highlight: palette.blueLight,
  accent: palette.blue,
  cloud: palette.blueLight,
  tabActive: palette.blue, // active tab = blue in light mode

  // Text
  text: '#0F172A',
  textMuted: '#64748B',
  textFaint: '#94A3B8',
  label: '#B45309', // deep amber — readable on light cards
  onPrimary: palette.white,

  // Status
  success: palette.success,
  warning: palette.warning,
  danger: palette.danger,

  // Lines
  border: '#E2E8F0',
  overlay: 'rgba(15,23,42,0.35)',

  // Elevation
  shadowColor: '#0F172A',
  shadowOpacity: 0.06,

  // Ambient weather backdrop — airy sky wash, warm sun + soft blue glows
  gradient: ['#E8F2FF', '#F3F8FF', '#FFFFFF'],
  glowSun: 'rgba(245,196,72,0.20)',
  glowSky: 'rgba(96,165,250,0.18)',
};

export const darkColors: ColorTokens = {
  // Surfaces — modern deep navy (matches the weather gradient)
  background: '#0C1426',
  backgroundAlt: '#101B33',
  surface: '#172642',
  cardSurface: 'rgba(255,255,255,0.06)', // subtle frosted light over the gradient
  surfaceMuted: '#1E2C49',

  // Brand
  primary: palette.blueLight, // bright sky blue
  primaryDark: palette.blueDeep,
  highlight: palette.blueLight,
  accent: palette.blue,
  cloud: palette.blueLight,
  tabActive: palette.blueLight, // active tab = bright blue (modern)

  // Text — bright for strong contrast on navy
  text: '#F1F5F9',
  textMuted: '#AEB9CC',
  textFaint: '#7C8AA3',
  label: '#FBBF24', // bright gold — pops on dark cards
  onPrimary: '#0B1226',

  // Status
  success: '#34D399',
  warning: '#FBBF24',
  danger: '#F87171',

  // Lines
  border: 'rgba(255,255,255,0.12)',
  overlay: 'rgba(0,0,0,0.5)',

  // Elevation
  shadowColor: '#000000',
  shadowOpacity: 0.3,

  // Ambient weather backdrop — modern deep navy
  gradient: ['#0E1730', '#14213F', '#0B1226'],
  glowSun: 'rgba(96,165,250,0.10)',
  glowSky: 'rgba(96,165,250,0.12)',
};

export type Colors = ColorTokens;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 999,
} as const;

export const fontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 20,
  xl: 28,
  xxl: 40,
  display: 64,
} as const;

export const fontWeight = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  heavy: '800',
} as const;

/** Soft card elevation built from the active scheme's shadow values. */
export function cardShadow(colors: Colors) {
  return {
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: colors.shadowOpacity,
    shadowRadius: 12,
    elevation: 2,
  } as const;
}

export type ColorScheme = 'light' | 'dark';
