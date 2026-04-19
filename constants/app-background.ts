/**
 * Full-screen hero used across auth, home, Pamoja Bima, Microfinance, and tab shells.
 * High-res Unsplash — healthcare / community wellness (AfyaLead).
 */
export const APP_HERO_BACKGROUND_URI =
  'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1600&q=88';

/**
 * Single canonical gradient overlay — use behind all hero UIs for a consistent look.
 * (Same stops as Pamoja Bima hub and login.)
 */
export const APP_HERO_GRADIENT_COLORS = [
  'rgba(6,30,24,0.55)',
  'rgba(4,72,56,0.82)',
  'rgba(4,48,40,0.92)',
] as const;

export const appHeroGradientProps = {
  colors: [...APP_HERO_GRADIENT_COLORS] as string[],
  start: { x: 0.5, y: 0 },
  end: { x: 0.5, y: 1 },
};
