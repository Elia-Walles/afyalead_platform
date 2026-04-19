import { AppHeroLayers } from '@/components/AppHeroLayers';
import { pamoja, radius, shadowCard, spacing } from '@/constants/design-tokens';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { ScrollView, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/** Space for scooped tab bar (see `ScoopedTabBar`). */
export const TAB_BAR_INSET = 118;

export type ScreenProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  /** e.g. back-to-home row above the title */
  headerAccessory?: React.ReactNode;
};

export function Screen({ title, subtitle, children, headerAccessory }: ScreenProps) {
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <AppHeroLayers />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: 28 + TAB_BAR_INSET + insets.bottom },
        ]}
      >
        {headerAccessory ? <View style={styles.accessory}>{headerAccessory}</View> : null}
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        <View style={styles.body}>{children}</View>
      </ScrollView>
    </View>
  );
}

export function Surface({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  return <View style={[styles.surface, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: pamoja.greenDeep,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  accessory: {
    marginBottom: spacing.sm,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.4,
    textShadowColor: 'rgba(0,0,0,0.35)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.92)',
    marginTop: 6,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
  body: {
    marginTop: spacing.lg,
    gap: spacing.md,
  },
  surface: {
    backgroundColor: pamoja.sheetBg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.55)',
    padding: spacing.md,
    gap: spacing.sm,
    ...shadowCard,
  },
});
