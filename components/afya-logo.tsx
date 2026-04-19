import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type AfyaLogoProps = {
  compact?: boolean;
};

export function AfyaLogo({ compact = false }: AfyaLogoProps) {
  return (
    <View style={[styles.wrapper, compact && styles.compactWrapper]}>
      <View style={[styles.icon, compact && styles.compactIcon]}>
        <Text style={[styles.iconText, compact && styles.compactIconText]}>A</Text>
      </View>
      <View>
        <Text style={[styles.title, compact && styles.compactTitle]}>AfyaLead</Text>
        <Text style={styles.subtitle}>Microfinance & Pamoja Bima</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  compactWrapper: {
    gap: 8,
  },
  icon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#1B8D4A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  compactIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
  },
  iconText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '800',
  },
  compactIconText: {
    fontSize: 18,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0E2A1A',
  },
  compactTitle: {
    fontSize: 18,
  },
  subtitle: {
    fontSize: 12,
    color: '#4B6C59',
    marginTop: 2,
  },
});
