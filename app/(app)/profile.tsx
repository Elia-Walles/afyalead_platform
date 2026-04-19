import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { type Href, useRouter } from 'expo-router';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { palette } from '@/constants/design-tokens';

const GREEN_DEEP = '#047857';
const TAB_BAR_SPACE = 118;

const LINK_ROWS: { label: string; href: Href; icon: keyof typeof MaterialCommunityIcons.glyphMap }[] = [
  { label: 'Microfinance', href: '/microfinance', icon: 'bank-outline' },
  { label: 'Pamoja Bima', href: '/pamoja-bima', icon: 'shield-check-outline' },
  { label: 'Microfinance settings', href: '/microfinance/settings', icon: 'cog-outline' },
  { label: 'Pamoja Bima settings', href: '/pamoja-bima/settings', icon: 'tune' },
];

export default function CustomerProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const go = (href: Href) => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(href);
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: insets.top + 16,
          paddingHorizontal: 16,
          paddingBottom: insets.bottom + TAB_BAR_SPACE + 16,
        }}
      >
        <Pressable
          onPress={() => {
            void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.replace('/home');
          }}
          style={styles.backLink}
          hitSlop={8}
        >
          <MaterialCommunityIcons name="arrow-left" size={22} color={GREEN_DEEP} />
          <Text style={styles.backLinkText}>Home</Text>
        </Pressable>
        <Text style={styles.screenTitle}>Profile</Text>

        <View style={styles.summaryCard}>
          <View style={styles.avatarLg}>
            <Text style={styles.avatarLgText}>AL</Text>
          </View>
          <Text style={styles.memberLine}>Member · •••• 8842</Text>
          <Text style={styles.memberSub}>Microfinance · Pamoja Bima</Text>
        </View>

        {LINK_ROWS.map((row) => (
          <Pressable
            key={row.label}
            style={({ pressed }) => [styles.linkRow, pressed && styles.linkRowPressed]}
            onPress={() => go(row.href)}
          >
            <View style={styles.linkIcon}>
              <MaterialCommunityIcons name={row.icon} size={22} color={GREEN_DEEP} />
            </View>
            <Text style={styles.linkTitle}>{row.label}</Text>
            <MaterialCommunityIcons name="chevron-right" size={22} color="#94a3b8" />
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: palette.bg,
  },
  backLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  backLinkText: {
    fontSize: 16,
    fontWeight: '800',
    color: GREEN_DEEP,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: -0.5,
    marginBottom: 20,
  },
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#0f172a',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.07,
        shadowRadius: 12,
      },
      android: { elevation: 4 },
      default: {},
    }),
  },
  avatarLg: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(4,120,87,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: GREEN_DEEP,
    marginBottom: 12,
  },
  avatarLgText: {
    fontSize: 22,
    fontWeight: '900',
    color: GREEN_DEEP,
  },
  memberLine: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0f172a',
  },
  memberSub: {
    marginTop: 4,
    fontSize: 14,
    color: '#64748b',
    fontWeight: '600',
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 12,
  },
  linkRowPressed: {
    opacity: 0.9,
  },
  linkIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(4,120,87,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  linkTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
  },
});
