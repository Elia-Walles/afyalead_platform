import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { type Href, useRouter } from 'expo-router';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { APP_HERO_BACKGROUND_URI, APP_HERO_GRADIENT_COLORS } from '@/constants/app-background';
import { pamoja, palette } from '@/constants/design-tokens';
const TAB_BAR_SPACE = 118;
const HEADER_BG_H = 248;
const GRID_GAP = 12;

const PRODUCTS: {
  key: string;
  href: Href;
  title: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  accent: string;
  iconBg: string;
}[] = [
  {
    key: 'microfinance',
    href: '/microfinance',
    title: 'Microfinance',
    icon: 'bank-outline',
    accent: pamoja.greenDeep,
    iconBg: 'rgba(4,120,87,0.14)',
  },
  {
    key: 'pamoja-bima',
    href: '/pamoja-bima',
    title: 'Pamoja Bima',
    icon: 'shield-check-outline',
    accent: pamoja.accent,
    iconBg: 'rgba(249,115,22,0.14)',
  },
];

/** Quick links into common flows. */
const SHORTCUTS: {
  key: string;
  label: string;
  href: Href;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  product: 'mf' | 'pb';
}[] = [
  {
    key: 'apply-loan',
    label: 'Apply for loan',
    href: '/microfinance/apply-loan',
    icon: 'file-document-edit-outline',
    product: 'mf',
  },
  {
    key: 'loans',
    label: 'Loans & repay',
    href: '/microfinance/loans',
    icon: 'cash-sync',
    product: 'mf',
  },
  {
    key: 'quotes',
    label: 'Cover quotes',
    href: '/pamoja-bima/quotes',
    icon: 'clipboard-text-outline',
    product: 'pb',
  },
  {
    key: 'claims',
    label: 'Claims',
    href: '/pamoja-bima/claims',
    icon: 'hospital-building',
    product: 'pb',
  },
];

export default function AppHomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const contentPad = 16;

  const open = (href: Href) => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(href);
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: insets.bottom + TAB_BAR_SPACE,
        }}
      >
        <View style={styles.headerBlock}>
          <View style={styles.headerBackdrop}>
            <Image
              source={{ uri: APP_HERO_BACKGROUND_URI }}
              style={StyleSheet.absoluteFillObject}
              contentFit="cover"
              transition={200}
            />
            <LinearGradient
              colors={[...APP_HERO_GRADIENT_COLORS]}
              style={StyleSheet.absoluteFill}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
            />
          </View>

          <View style={[styles.headerContent, { paddingTop: insets.top + 8 }]}>
            <View style={styles.topRow}>
              <Pressable style={styles.avatar} onPress={() => open('/profile')} accessibilityRole="button">
                <Text style={styles.avatarText}>AL</Text>
              </Pressable>
              <View style={{ flex: 1 }}>
                <Text style={styles.greetHi}>Hi,</Text>
                <Text style={styles.greetName}>AfyaLead member</Text>
              </View>
              <Pressable style={styles.iconBtn} onPress={() => open('/profile')} accessibilityLabel="Account and settings">
                <MaterialCommunityIcons name="cog-outline" size={24} color="#fff" />
              </Pressable>
            </View>

            <View style={styles.accountTabs}>
              <Pressable onPress={() => router.replace('/home')}>
                <Text style={[styles.tabText, styles.tabTextActive]}>MY SERVICES</Text>
                <View style={styles.tabUnderline} />
              </Pressable>
              <Pressable onPress={() => open('/profile')}>
                <Text style={styles.tabText}>PROFILE</Text>
              </Pressable>
            </View>

            <Pressable
              style={({ pressed }) => [styles.accountCard, pressed && styles.accountCardPressed]}
              onPress={() => open('/profile')}
            >
              <View style={styles.cardTop}>
                <View>
                  <Text style={styles.accountNumber}>Member · •••• 8842</Text>
                  <Text style={styles.accountType}>Microfinance · Pamoja Bima</Text>
                </View>
                <View style={styles.logoBadge}>
                  <Text style={styles.logoText}>AfyaLead</Text>
                </View>
              </View>
            </Pressable>
          </View>
        </View>

        <View style={[styles.section, { paddingHorizontal: contentPad }]}>
          <Text style={styles.sectionHeading}>Products</Text>

          <View style={[styles.gridRow, { gap: GRID_GAP }]}>
            {PRODUCTS.map((p) => (
              <Pressable
                key={p.key}
                style={({ pressed }) => [
                  styles.productTile,
                  { borderTopColor: p.accent },
                  pressed && styles.productTilePressed,
                ]}
                onPress={() => open(p.href)}
              >
                <View style={[styles.productIconWrap, { backgroundColor: p.iconBg }]}>
                  <MaterialCommunityIcons name={p.icon} size={28} color={p.accent} />
                </View>
                <Text style={styles.productTileTitle} numberOfLines={2}>
                  {p.title}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={[styles.section, { paddingHorizontal: contentPad, paddingTop: 8 }]}>
          <Text style={styles.sectionHeading}>Shortcuts</Text>

          <View style={{ gap: GRID_GAP }}>
            {[0, 2].map((rowStart) => (
              <View key={rowStart} style={[styles.gridRow, { gap: GRID_GAP }]}>
                {SHORTCUTS.slice(rowStart, rowStart + 2).map((s) => (
                  <Pressable
                    key={s.key}
                    style={({ pressed }) => [
                      styles.shortcutTile,
                      {
                        borderColor: s.product === 'mf' ? 'rgba(4,120,87,0.2)' : 'rgba(249,115,22,0.25)',
                      },
                      pressed && styles.shortcutTilePressed,
                    ]}
                    onPress={() => open(s.href)}
                  >
                    <MaterialCommunityIcons
                      name={s.icon}
                      size={22}
                      color={s.product === 'mf' ? pamoja.greenDeep : pamoja.accent}
                    />
                    <Text style={styles.shortcutLabel} numberOfLines={2}>
                      {s.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            ))}
          </View>
        </View>

        <Pressable style={[styles.promoBanner, { marginHorizontal: contentPad }]} onPress={() => open('/microfinance')}>
          <Image source={{ uri: APP_HERO_BACKGROUND_URI }} style={styles.promoImg} contentFit="cover" />
          <LinearGradient
            colors={['transparent', 'rgba(4,72,56,0.88)']}
            style={styles.promoOverlay}
          />
          <View style={styles.promoCopy}>
            <Text style={styles.promoText}>AfyaLead</Text>
          </View>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: palette.bg,
  },
  headerBlock: {
    backgroundColor: pamoja.greenDeep,
    paddingBottom: 20,
    position: 'relative',
  },
  headerBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: HEADER_BG_H,
    zIndex: 0,
  },
  headerContent: {
    paddingHorizontal: 16,
    zIndex: 2,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  avatarText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 14,
  },
  greetHi: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 13,
  },
  greetName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
  },
  iconBtn: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  accountTabs: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 14,
  },
  tabText: {
    color: 'rgba(255,255,255,0.55)',
    fontWeight: '800',
    fontSize: 11,
    letterSpacing: 0.6,
  },
  tabTextActive: {
    color: '#fff',
  },
  tabUnderline: {
    marginTop: 6,
    height: 3,
    width: '100%',
    backgroundColor: pamoja.accent,
    borderRadius: 2,
  },
  accountCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.12,
        shadowRadius: 12,
      },
      android: { elevation: 6 },
      default: {},
    }),
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  accountCardPressed: {
    opacity: 0.94,
    transform: [{ scale: 0.995 }],
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  accountNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: pamoja.greenDeep,
    letterSpacing: 0.5,
  },
  accountType: {
    marginTop: 6,
    fontSize: 13,
    color: '#64748b',
    fontWeight: '600',
  },
  logoBadge: {
    backgroundColor: pamoja.accent,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  logoText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 11,
    letterSpacing: 0.5,
  },
  section: {
    paddingTop: 22,
  },
  sectionHeading: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 14,
    letterSpacing: -0.3,
  },
  gridRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  productTile: {
    flex: 1,
    minHeight: 132,
    backgroundColor: '#fff',
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderTopWidth: 4,
    ...Platform.select({
      ios: {
        shadowColor: '#0f172a',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.07,
        shadowRadius: 16,
      },
      android: { elevation: 4 },
      default: {},
    }),
  },
  productTilePressed: {
    opacity: 0.92,
    transform: [{ scale: 0.98 }],
  },
  productIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  productTileTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a',
    textAlign: 'center',
    lineHeight: 20,
  },
  shortcutTile: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 88,
    borderWidth: 1,
    gap: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#0f172a',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: { elevation: 2 },
      default: {},
    }),
  },
  shortcutTilePressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  shortcutLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    textAlign: 'center',
    lineHeight: 15,
  },
  promoBanner: {
    marginTop: 20,
    height: 128,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  promoImg: {
    ...StyleSheet.absoluteFillObject,
  },
  promoOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
  },
  promoCopy: {
    padding: 14,
  },
  promoText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '900',
    textShadowColor: 'rgba(0,0,0,0.35)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
});
