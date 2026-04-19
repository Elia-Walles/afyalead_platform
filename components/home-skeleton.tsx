import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { palette, radius, shadowTile, spacing as space } from '@/constants/design-tokens';

function ShimmerBlock({ style, width }: { style?: object; width?: `${number}%` | number }) {
  const pulse = useRef(new Animated.Value(0.35)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 0.85,
          duration: 700,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0.35,
          duration: 700,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  return (
    <Animated.View style={[styles.shimmerWrap, style, width != null ? { width } : undefined, { opacity: pulse }]}>
      <LinearGradient
        colors={['#E2E8F0', '#F1F5F9', '#E2E8F0']}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={StyleSheet.absoluteFill}
      />
    </Animated.View>
  );
}

export function HomeSkeleton() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.root, { paddingTop: insets.top, paddingBottom: insets.bottom + 24 }]}>
      <View style={styles.topRow}>
        <View style={{ flex: 1, gap: 8 }}>
          <ShimmerBlock style={styles.lineSm} width="45%" />
          <ShimmerBlock style={styles.lineLg} width="55%" />
        </View>
        <ShimmerBlock style={styles.iconBox} />
      </View>

      <View style={styles.heroCard}>
        <ShimmerBlock style={styles.heroBar} />
        <View style={styles.heroBody}>
          <ShimmerBlock style={styles.avatar} />
          <ShimmerBlock style={styles.lineLg} width="50%" />
          <ShimmerBlock style={styles.lineMd} width="85%" />
          <View style={styles.pillRow}>
            <ShimmerBlock style={styles.pill} width={90} />
            <ShimmerBlock style={styles.pill} width={100} />
          </View>
        </View>
      </View>

      <View style={styles.statsRow}>
        {[1, 2, 3].map((i) => (
          <View key={i} style={styles.statCard}>
            <ShimmerBlock style={styles.statIcon} />
            <ShimmerBlock style={styles.lineXs} width="80%" />
          </View>
        ))}
      </View>

      <ShimmerBlock style={styles.sectionLabel} width={100} />

      <View style={styles.grid}>
        <View style={styles.tile}>
          <ShimmerBlock style={styles.tileStrip} />
          <View style={styles.tilePad}>
            <ShimmerBlock style={styles.lineSm} width="40%" />
            <ShimmerBlock style={styles.tileIcon} />
            <ShimmerBlock style={styles.lineMd} width="90%" />
            <ShimmerBlock style={styles.lineSm} width="100%" />
          </View>
          <ShimmerBlock style={styles.cta} />
        </View>
        <View style={styles.tile}>
          <ShimmerBlock style={styles.tileStrip} />
          <View style={styles.tilePad}>
            <ShimmerBlock style={styles.lineSm} width="40%" />
            <ShimmerBlock style={styles.tileIcon} />
            <ShimmerBlock style={styles.lineMd} width="70%" />
            <ShimmerBlock style={styles.lineSm} width="100%" />
          </View>
          <ShimmerBlock style={styles.cta} />
        </View>
      </View>

      <View style={styles.footer}>
        <ShimmerBlock style={styles.footerIcon} />
        <View style={{ flex: 1, gap: 6 }}>
          <ShimmerBlock style={styles.lineSm} width="100%" />
          <ShimmerBlock style={styles.lineSm} width="70%" />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: palette.bg,
    paddingHorizontal: space.lg,
  },
  shimmerWrap: {
    borderRadius: radius.sm,
    overflow: 'hidden',
    backgroundColor: palette.borderLight,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  lineSm: { height: 12, borderRadius: 6 },
  lineMd: { height: 14, borderRadius: 7 },
  lineLg: { height: 22, borderRadius: 8 },
  lineXs: { height: 10, borderRadius: 5 },
  iconBox: { width: 42, height: 42, borderRadius: 14 },
  heroCard: {
    borderRadius: radius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: palette.border,
    marginBottom: 16,
    ...shadowTile,
  },
  heroBar: { height: 5, width: '100%' },
  heroBody: {
    padding: 20,
    alignItems: 'center',
    gap: 10,
    backgroundColor: palette.surface,
  },
  avatar: { width: 68, height: 68, borderRadius: 34, marginBottom: 4 },
  pillRow: { flexDirection: 'row', gap: 8, marginTop: 6 },
  pill: { height: 28, borderRadius: radius.full },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 18 },
  statCard: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.surface,
    ...shadowTile,
  },
  statIcon: { width: 44, height: 44, borderRadius: 14 },
  sectionLabel: { height: 14, marginBottom: 12, borderRadius: 4 },
  grid: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  tile: {
    flex: 1,
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: palette.border,
    minHeight: 248,
    backgroundColor: palette.surface,
    ...shadowTile,
  },
  tileStrip: { height: 3, width: '100%' },
  tilePad: { padding: 14, gap: 8 },
  tileIcon: { width: 56, height: 56, borderRadius: 18, marginVertical: 4 },
  cta: { height: 46, width: '100%' },
  footer: {
    flexDirection: 'row',
    gap: 12,
    padding: 14,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.surface,
    ...shadowTile,
  },
  footerIcon: { width: 44, height: 44, borderRadius: 14 },
});
