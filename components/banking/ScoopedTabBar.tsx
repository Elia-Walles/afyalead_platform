import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { usePathname, useRouter } from 'expo-router';
import { useMemo } from 'react';
import { Dimensions, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const GREEN_BAR = '#047857';
const ORANGE = '#f97316';
const LABEL = 'rgba(255,255,255,0.85)';

const { width: W } = Dimensions.get('window');

type TabKey = 'home' | 'transactions' | 'cards' | 'favourites';

export function ScoopedTabBar() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const pathname = usePathname();

  const active = useMemo((): TabKey | null => {
    if (pathname?.includes('/qr')) return null;
    if (pathname?.includes('transactions')) return 'transactions';
    if (pathname?.includes('cards')) return 'cards';
    if (pathname?.includes('favourites')) return 'favourites';
    return 'home';
  }, [pathname]);

  const go = (key: TabKey) => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (key === 'home') router.replace('/home');
    else router.replace(`/${key}`);
  };

  const fab = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/qr');
  };

  const bottomPad = Math.max(insets.bottom, 8);

  return (
    <View style={styles.outer} pointerEvents="box-none">
      <View style={[styles.panel, { paddingBottom: bottomPad }]}>
        <View style={styles.row}>
          <Pressable style={styles.tab} onPress={() => go('home')}>
            <MaterialCommunityIcons name="home-variant" size={24} color="#fff" />
            <Text style={styles.tabLabel}>Home</Text>
            {active === 'home' ? <View style={styles.activeLine} /> : <View style={styles.linePlaceholder} />}
          </Pressable>
          <Pressable style={styles.tab} onPress={() => go('transactions')}>
            <MaterialCommunityIcons name="swap-horizontal" size={24} color="#fff" />
            <Text style={styles.tabLabel}>Transactions</Text>
            {active === 'transactions' ? <View style={styles.activeLine} /> : <View style={styles.linePlaceholder} />}
          </Pressable>

          <View style={styles.fabSlot} />

          <Pressable style={styles.tab} onPress={() => go('cards')}>
            <MaterialCommunityIcons name="credit-card-outline" size={24} color="#fff" />
            <Text style={styles.tabLabel}>Cards</Text>
            {active === 'cards' ? <View style={styles.activeLine} /> : <View style={styles.linePlaceholder} />}
          </Pressable>
          <Pressable style={styles.tab} onPress={() => go('favourites')}>
            <MaterialCommunityIcons name="star-outline" size={24} color="#fff" />
            <Text style={styles.tabLabel}>Favourites</Text>
            {active === 'favourites' ? <View style={styles.activeLine} /> : <View style={styles.linePlaceholder} />}
          </Pressable>
        </View>
      </View>

      <Pressable
        style={({ pressed }) => [
          styles.fab,
          { bottom: bottomPad + 34 },
          pressed && { transform: [{ scale: 0.94 }] },
        ]}
        onPress={fab}
      >
        <View style={styles.fabInner}>
          <MaterialCommunityIcons name="qrcode-scan" size={28} color="#fff" />
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    width: W,
    alignItems: 'center',
  },
  panel: {
    width: W,
    backgroundColor: GREEN_BAR,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    paddingTop: 10,
    minHeight: 62,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: -3 }, shadowOpacity: 0.18, shadowRadius: 10 },
      android: { elevation: 18 },
      default: {},
    }),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingBottom: 4,
    minHeight: 52,
    justifyContent: 'flex-end',
  },
  tabLabel: {
    color: LABEL,
    fontSize: 10,
    fontWeight: '700',
    marginTop: 2,
  },
  activeLine: {
    marginTop: 4,
    height: 3,
    width: 28,
    borderRadius: 2,
    backgroundColor: ORANGE,
  },
  linePlaceholder: {
    marginTop: 4,
    height: 3,
    width: 28,
  },
  fabSlot: {
    width: 76,
  },
  fab: {
    position: 'absolute',
    alignSelf: 'center',
    zIndex: 100,
  },
  fabInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: ORANGE,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#fff',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 8,
      },
      android: { elevation: 14 },
      default: {},
    }),
  },
});
