import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/** Space for scooped tab bar (see `ScoopedTabBar`). */
const TAB_BAR_INSET = 118;

type ScreenProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
};

export function Screen({ title, subtitle, children }: ScreenProps) {
  const insets = useSafeAreaInsets();
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: 28 + TAB_BAR_INSET + insets.bottom },
        ]}
      >
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        <View style={styles.body}>{children}</View>
      </ScrollView>
    </SafeAreaView>
  );
}

export function Surface({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  return <View style={[styles.surface, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F3FAF5',
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 18,
  },
  title: {
    color: '#0E2A1A',
    fontSize: 28,
    fontWeight: '800',
  },
  subtitle: {
    color: '#4B6C59',
    marginTop: 4,
    fontSize: 14,
  },
  body: {
    marginTop: 16,
    gap: 12,
  },
  surface: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#C8E4D2',
    padding: 14,
    gap: 8,
  },
});
