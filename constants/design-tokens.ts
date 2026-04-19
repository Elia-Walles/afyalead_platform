import { Platform } from 'react-native';

/** AfyaLead design tokens — use for home first, then app-wide. */
export const palette = {
  ink: '#0F172A',
  muted: '#64748B',
  mutedStrong: '#475569',
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
  surface: '#FFFFFF',
  /** Page background: soft mint-neutral */
  bg: '#F0F9F5',
  highlightTop: 'rgba(255,255,255,0.85)',
} as const;

export const brand = {
  primary: '#10B981',
  primaryDeep: '#059669',
  primarySoft: '#ECFDF5',
  /** Finance tile highlights */
  finance: '#14B8A6',
  financeSoft: '#CCFBF1',
  /** Insurance tile highlights */
  insurance: '#6366F1',
  insuranceSoft: '#EEF2FF',
} as const;

export const radius = {
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  full: 999,
} as const;

export const spacing = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 20,
  xl: 24,
} as const;

export const shadowCard = Platform.select({
  ios: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.09,
    shadowRadius: 22,
  },
  android: { elevation: 6 },
  default: {},
});

export const shadowTile = Platform.select({
  ios: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
  },
  android: { elevation: 4 },
  default: {},
});

/** Primary CTA gradient (brand green) */
export const gradientPrimary = [brand.primary, brand.primaryDeep] as const;

/** Hero inner wash */
export const gradientHeroInner = ['#FFFFFF', '#F0FDFA'] as const;

/** Tile body wash */
export const gradientTileBody = ['#FAFAFA', '#FFFFFF'] as const;

/**
 * Pamoja Bima / insurance surfaces — matches [`app/(app)/home`] product tile (shield) accents.
 * Use for Pamoja hub, quote wizards, and insurance CTAs so screens stay consistent with home.
 */
export const pamoja = {
  greenDeep: '#047857',
  accent: '#f97316',
  sheetBg: 'rgba(248,250,252,0.96)',
} as const;
