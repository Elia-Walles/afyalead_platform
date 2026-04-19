import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

type ScreenProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
};

export function Screen({ title, subtitle, children }: ScreenProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        <View style={styles.body}>{children}</View>
      </ScrollView>
    </SafeAreaView>
  );
}

export function Surface({ children }: { children: React.ReactNode }) {
  return <View style={styles.surface}>{children}</View>;
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F3FAF5',
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 32,
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
