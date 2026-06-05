/**
 * SkySync design tokens.
 * Colors derived from the brand logo (deep purple background, sunny yellow,
 * sky blues). Keep all visual constants here so screens/components stay clean.
 */

export const colors = {
  // Brand
  background: '#250E52',
  backgroundAlt: '#2E1A66',
  surface: '#352074',
  surfaceMuted: '#3D2A80',

  // Accents
  primary: '#7FD7FF', // sky blue
  accent: '#F4C430', // sun yellow
  cloud: '#36BFFA',

  // Text
  text: '#FFFFFF',
  textMuted: '#B8AEDC',
  textFaint: '#8A7FB8',

  // Status
  success: '#34D399',
  warning: '#FBBF24',
  danger: '#F87171',

  // Lines / borders
  border: 'rgba(255,255,255,0.10)',
  overlay: 'rgba(0,0,0,0.35)',
} as const;

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

export type ThemeColor = keyof typeof colors;

export const theme = {
  colors,
  spacing,
  radius,
  fontSize,
  fontWeight,
} as const;

export type Theme = typeof theme;
