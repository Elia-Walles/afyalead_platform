import { AppHeroLayers } from '@/components/AppHeroLayers';
import { APP_HERO_BACKGROUND_SOURCE } from '@/constants/app-background';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { pamoja, palette } from '@/constants/design-tokens';
import { PAMOJA_PROVIDER_LOGOS } from '@/constants/pamoja-provider-logos';
import {
  PAMOJA_PROVIDER_ORDER,
  type InsuranceProvider,
  useMockApp,
} from '@/context/mock-app-context';
import { useResponsive } from '@/utils/responsive';

const TAB_BAR = 118;
const GRID_GAP = 12;

const HIGHLIGHTS: { icon: keyof typeof MaterialCommunityIcons.glyphMap; label: string }[] = [
  { icon: 'hospital-building', label: 'OPD & IPD' },
  { icon: 'account-group-outline', label: 'Family cover' },
  { icon: 'card-account-details-outline', label: 'Digital card' },
];

export default function PamojaBimaHomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const responsive = useResponsive();
  const { providers, policies, quotes, claims } = useMockApp();

  const orderedProviders = useMemo(() => {
    return PAMOJA_PROVIDER_ORDER.map((id) => providers.find((p) => p.id === id)).filter(
      (p): p is InsuranceProvider => p != null
    );
  }, [providers]);

  const openProvider = (id: string) => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (id === 'britam') {
      router.push('/pamoja-bima/britam/quote');
    } else {
      router.push({ pathname: '/pamoja-bima/quote/[id]', params: { id } });
    }
  };

  const statNav = (path: '/pamoja-bima/policies' | '/pamoja-bima/quotes' | '/pamoja-bima/claims') => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Route to BRITAM-specific screens for policies
    if (path === '/pamoja-bima/policies') {
      router.push('/pamoja-bima/britam/policies');
    } else {
      router.push(path);
    }
  };

  return (
    <View style={styles.root}>
      <AppHeroLayers />
      <View style={styles.mainColumn}>
        <LinearGradient
          colors={['rgba(4,120,87,0.35)', 'rgba(4,120,87,0.2)', 'transparent']}
          style={[styles.hero, { paddingTop: insets.top + 10 }]}
        >
          <Pressable
            onPress={() => {
              void Haptics.selectionAsync();
              router.replace('/home');
            }}
            style={styles.backBtn}
            hitSlop={12}
          >
            <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
          </Pressable>

          <View style={styles.heroRow}>
            <View style={styles.heroIconWrap}>
              <MaterialCommunityIcons name="shield-check" size={30} color="#fff" />
            </View>
            <View style={styles.heroTextCol}>
              <Text style={styles.heroTitle}>Pamoja Bima</Text>
              <Text style={styles.heroTagline}>Health cover · quotes · claims</Text>
              <View style={styles.heroLine} />
            </View>
          </View>
        </LinearGradient>

        <View
          style={[
            styles.sheet,
            { flex: 1, minHeight: 0, paddingBottom: Math.max(insets.bottom, 8) + TAB_BAR + 6 },
          ]}
        >
          <View style={styles.sheetBody}>
            <View style={styles.patternLayer} pointerEvents="none">
              {(
                [
                  ['shield-outline', 40, 12, 20],
                  ['heart-pulse', 36, 80, 140],
                  ['medical-bag', 38, 140, 40],
                ] as const
              ).map(([icon, size, top, left], i) => (
                <MaterialCommunityIcons
                  key={i}
                  name={icon}
                  size={size}
                  color="#cbd5e1"
                  style={[styles.patternIcon, { top, left, opacity: 0.07 }]}
                />
              ))}
            </View>

            <Pressable
              style={({ pressed }) => [styles.summaryCard, pressed && { opacity: 0.96 }]}
              onPress={() => statNav('/pamoja-bima/policies')}
            >
              <View style={styles.summaryTop}>
                <View>
                  <Text style={styles.summaryKicker}>Your cover</Text>
                  <Text style={styles.summaryTitle}>
                    {policies.length > 0 ? `Policy · •••• ${policies[0].policyNumber.slice(-4)}` : 'No active policy yet'}
                  </Text>
                  <Text style={styles.summarySub}>
                    {policies.length > 0 ? policies[0].packageName : 'Pick an insurer below to get a quote'}
                  </Text>
                </View>
                <View style={styles.afyaBadge}>
                  <Text style={styles.afyaBadgeText}>AfyaLead</Text>
                </View>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.statsRow}>
                <Pressable style={styles.statCell} onPress={() => statNav('/pamoja-bima/policies')}>
                  <Text style={styles.statNum}>{policies.length}</Text>
                  <Text style={styles.statLabel}>Policies</Text>
                </Pressable>
                <View style={styles.statSep} />
                <Pressable style={styles.statCell} onPress={() => statNav('/pamoja-bima/quotes')}>
                  <Text style={styles.statNum}>{quotes.length}</Text>
                  <Text style={styles.statLabel}>Quotes</Text>
                </Pressable>
                <View style={styles.statSep} />
                <Pressable style={styles.statCell} onPress={() => statNav('/pamoja-bima/claims')}>
                  <Text style={styles.statNum}>{claims.length}</Text>
                  <Text style={styles.statLabel}>Claims</Text>
                </Pressable>
              </View>
            </Pressable>

            <View style={styles.highlightsRow}>
              {HIGHLIGHTS.map((h) => (
                <View key={h.label} style={styles.highlightPill}>
                  <MaterialCommunityIcons name={h.icon} size={16} color={pamoja.greenDeep} />
                  <Text style={styles.highlightText}>{h.label}</Text>
                </View>
              ))}
            </View>

            <View style={styles.sectionHead}>
              <Text style={styles.sectionEyebrow}>Insurers</Text>
              <Text style={styles.sectionTitle}>Choose a provider</Text>
            </View>

            <View style={[styles.grid, { gap: GRID_GAP }]}>
              {[0, 2].map((rowStart) => (
                <View key={rowStart} style={[styles.gridRow, { gap: GRID_GAP }]}>
                  {orderedProviders.slice(rowStart, rowStart + 2).map((p) => (
                    <Pressable
                      key={p.id}
                      style={({ pressed }) => [styles.gridTile, pressed && styles.gridTilePressed]}
                      onPress={() => openProvider(p.id)}
                    >
                      <View style={[styles.logoFrame, { borderColor: `${p.themeColor}40` }]}>
                        <Image
                          source={PAMOJA_PROVIDER_LOGOS[p.id]}
                          style={styles.logoImage}
                          contentFit="contain"
                          transition={150}
                        />
                      </View>
                      <Text style={[styles.brandName, { color: p.themeColor }]} numberOfLines={2}>
                        {p.name}
                      </Text>
                      <Text style={styles.pkgLine}>{p.packages.length} plans</Text>
                    </Pressable>
                  ))}
                </View>
              ))}
            </View>

            <Pressable
              style={styles.promoBanner}
              onPress={() => {
                void Haptics.selectionAsync();
                router.push('/pamoja-bima/quotes');
              }}
            >
              <Image source={APP_HERO_BACKGROUND_SOURCE} style={styles.promoImg} contentFit="cover" />
              <LinearGradient
                colors={['transparent', 'rgba(4,72,56,0.9)']}
                style={styles.promoOverlay}
              />
              <View style={styles.promoInner}>
                <MaterialCommunityIcons name="shield-half-full" size={22} color="#fff" />
                <Text style={styles.promoTitle}>Quotes &amp; renewals</Text>
                <Text style={styles.promoHint}>View your cover journey</Text>
              </View>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: pamoja.greenDeep,
  },
  mainColumn: {
    flex: 1,
    minHeight: 0,
  },
  hero: {
    flexShrink: 0,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  backBtn: {
    alignSelf: 'flex-start',
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
  },
  heroTextCol: {
    flex: 1,
  },
  heroIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: -0.5,
  },
  heroTagline: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.88)',
  },
  heroLine: {
    marginTop: 10,
    width: 48,
    height: 4,
    borderRadius: 2,
    backgroundColor: pamoja.accent,
  },
  sheet: {
    marginTop: -14,
    backgroundColor: pamoja.sheetBg,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.55)',
    overflow: 'hidden',
  },
  sheetBody: {
    flex: 1,
    minHeight: 0,
    zIndex: 1,
  },
  patternLayer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  patternIcon: {
    position: 'absolute',
  },
  summaryCard: {
    zIndex: 1,
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: palette.border,
    ...Platform.select({
      ios: {
        shadowColor: palette.ink,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
      },
      android: { elevation: 5 },
      default: {},
    }),
  },
  summaryTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  summaryKicker: {
    fontSize: 10,
    fontWeight: '900',
    color: pamoja.greenDeep,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  summaryTitle: {
    marginTop: 6,
    fontSize: 17,
    fontWeight: '800',
    color: palette.ink,
  },
  summarySub: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: '600',
    color: palette.muted,
  },
  afyaBadge: {
    backgroundColor: pamoja.accent,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  afyaBadgeText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 11,
    letterSpacing: 0.4,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginVertical: 10,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4,
  },
  statSep: {
    width: 1,
    height: 36,
    backgroundColor: '#e2e8f0',
  },
  statNum: {
    fontSize: 22,
    fontWeight: '900',
    color: pamoja.greenDeep,
  },
  statLabel: {
    marginTop: 2,
    fontSize: 11,
    fontWeight: '700',
    color: palette.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  highlightsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
    zIndex: 1,
  },
  highlightPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: 'rgba(4,120,87,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(4,120,87,0.15)',
  },
  highlightText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#14532d',
  },
  sectionHead: {
    marginBottom: 8,
    zIndex: 1,
  },
  sectionEyebrow: {
    fontSize: 11,
    fontWeight: '800',
    color: palette.muted,
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },
  sectionTitle: {
    marginTop: 4,
    fontSize: 18,
    fontWeight: '900',
    color: palette.ink,
    letterSpacing: -0.3,
  },
  grid: {
    flex: 1,
    minHeight: 0,
    width: '100%',
    marginBottom: 8,
    zIndex: 1,
  },
  gridRow: {
    flex: 1,
    minHeight: 0,
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  gridTile: {
    flex: 1,
    minHeight: 0,
    backgroundColor: '#fff',
    borderRadius: 18,
    paddingVertical: 10,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: palette.border,
    gap: 8,
    ...Platform.select({
      ios: {
        shadowColor: palette.ink,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.07,
        shadowRadius: 14,
      },
      android: { elevation: 4 },
      default: {},
    }),
  },
  gridTilePressed: {
    opacity: 0.92,
    transform: [{ scale: 0.98 }],
  },
  logoFrame: {
    width: 56,
    height: 56,
    borderRadius: 12,
    borderWidth: 2,
    backgroundColor: '#fff',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    width: 48,
    height: 48,
  },
  brandName: {
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.4,
    textAlign: 'center',
  },
  pkgLine: {
    fontSize: 12,
    fontWeight: '600',
    color: palette.muted,
  },
  promoBanner: {
    flexShrink: 0,
    height: 84,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 0,
    borderWidth: 1,
    borderColor: palette.border,
    zIndex: 1,
  },
  promoImg: {
    ...StyleSheet.absoluteFillObject,
  },
  promoOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
  },
  promoInner: {
    padding: 12,
  },
  promoTitle: {
    marginTop: 2,
    color: '#fff',
    fontSize: 15,
    fontWeight: '900',
    textShadowColor: 'rgba(0,0,0,0.35)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  promoHint: {
    marginTop: 4,
    color: 'rgba(255,255,255,0.9)',
    fontSize: 12,
    fontWeight: '600',
  },
});
