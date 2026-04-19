import { Screen, Surface } from '@/components/screen';
import { brand, pamoja, palette, radius } from '@/constants/design-tokens';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { type Href, useRouter } from 'expo-router';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

const LINK_ROWS: { label: string; href: Href; icon: keyof typeof MaterialCommunityIcons.glyphMap }[] = [
  { label: 'Microfinance', href: '/microfinance', icon: 'bank-outline' },
  { label: 'Pamoja Bima', href: '/pamoja-bima', icon: 'shield-check-outline' },
  { label: 'Microfinance settings', href: '/microfinance/settings', icon: 'cog-outline' },
  { label: 'Pamoja Bima settings', href: '/pamoja-bima/settings', icon: 'tune' },
];

export default function CustomerProfileScreen() {
  const router = useRouter();

  const go = (href: Href) => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(href);
  };

  return (
    <Screen
      title="Profile"
      subtitle="Account & services"
      headerAccessory={
        <Pressable
          onPress={() => {
            void Haptics.selectionAsync();
            router.replace('/home');
          }}
          style={styles.backLink}
          hitSlop={8}
        >
          <MaterialCommunityIcons name="arrow-left" size={22} color="rgba(255,255,255,0.95)" />
          <Text style={styles.backLinkText}>Home</Text>
        </Pressable>
      }
    >
      <Surface style={styles.summaryCard}>
        <View style={styles.avatarLg}>
          <Text style={styles.avatarLgText}>AL</Text>
        </View>
        <Text style={styles.memberLine}>Member · •••• 8842</Text>
        <Text style={styles.memberSub}>Microfinance · Pamoja Bima</Text>
      </Surface>

      {LINK_ROWS.map((row) => (
        <Pressable
          key={row.label}
          style={({ pressed }) => [styles.linkRow, pressed && styles.linkRowPressed]}
          onPress={() => go(row.href)}
        >
          <View style={styles.linkIcon}>
            <MaterialCommunityIcons name={row.icon} size={22} color={pamoja.greenDeep} />
          </View>
          <Text style={styles.linkTitle}>{row.label}</Text>
          <MaterialCommunityIcons name="chevron-right" size={22} color={palette.muted} />
        </Pressable>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  backLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
  },
  backLinkText: {
    fontSize: 16,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.95)',
  },
  summaryCard: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  avatarLg: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: brand.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: pamoja.greenDeep,
    marginBottom: 12,
  },
  avatarLgText: {
    fontSize: 22,
    fontWeight: '900',
    color: pamoja.greenDeep,
  },
  memberLine: {
    fontSize: 17,
    fontWeight: '800',
    color: palette.ink,
  },
  memberSub: {
    marginTop: 4,
    fontSize: 14,
    color: palette.muted,
    fontWeight: '600',
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: pamoja.sheetBg,
    borderRadius: radius.lg,
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginBottom: 0,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.55)',
    gap: 12,
    ...Platform.select({
      ios: {
        shadowColor: palette.ink,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 10,
      },
      android: { elevation: 3 },
      default: {},
    }),
  },
  linkRowPressed: {
    opacity: 0.92,
  },
  linkIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: brand.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  linkTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '800',
    color: palette.ink,
  },
});
