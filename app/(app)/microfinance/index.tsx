import { Screen, Surface } from '@/components/screen';
import { brand, pamoja, palette, radius } from '@/constants/design-tokens';
import { useMockApp } from '@/context/mock-app-context';
import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function MicrofinanceHomeScreen() {
  const { selectedRole, setSelectedRole } = useMockApp();
  const roleOptions: ('group' | 'admin' | 'officer')[] = ['group', 'admin', 'officer'];

  return (
    <Screen title="Microfinance" subtitle="Loans, repayments & alerts">
      <Surface>
        <Text style={styles.sectionTitle}>Role</Text>
        <View style={styles.row}>
          {roleOptions.map((role) => (
            <Pressable
              key={role}
              onPress={() => setSelectedRole(role)}
              style={[styles.roleChip, selectedRole === role && styles.roleChipActive]}
            >
              <Text style={[styles.roleText, selectedRole === role && styles.roleTextActive]}>{role.toUpperCase()}</Text>
            </Pressable>
          ))}
        </View>
      </Surface>

      <Surface>
        <Text style={styles.sectionTitle}>Overview</Text>
        <Text style={styles.smallText}>Active loans: 4</Text>
        <Text style={styles.smallText}>Pending approvals: 2</Text>
        <Text style={styles.smallText}>Repayments due this week: TZS 1,800,000</Text>
      </Surface>

      <Link href="/microfinance/apply-loan" asChild>
        <Pressable style={styles.actionCard}>
          <Text style={styles.actionTitle}>Apply for loan</Text>
        </Pressable>
      </Link>

      <Link href="/microfinance/loans" asChild>
        <Pressable style={styles.actionCard}>
          <Text style={styles.actionTitle}>Loans</Text>
        </Pressable>
      </Link>

      <Link href="/microfinance/payments" asChild>
        <Pressable style={styles.actionCard}>
          <Text style={styles.actionTitle}>Payments</Text>
        </Pressable>
      </Link>

      <Link href="/microfinance/notifications" asChild>
        <Pressable style={styles.actionCard}>
          <Text style={styles.actionTitle}>Notifications</Text>
        </Pressable>
      </Link>

      <Link href="/microfinance/settings" asChild>
        <Pressable style={styles.actionCard}>
          <Text style={styles.actionTitle}>Settings</Text>
        </Pressable>
      </Link>
    </Screen>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontWeight: '800',
    fontSize: 16,
    color: palette.ink,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  roleChip: {
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: palette.border,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: brand.primarySoft,
  },
  roleChipActive: {
    backgroundColor: brand.primary,
    borderColor: brand.primaryDeep,
  },
  roleText: {
    color: pamoja.greenDeep,
    fontWeight: '700',
    fontSize: 12,
  },
  roleTextActive: {
    color: '#FFFFFF',
  },
  actionCard: {
    backgroundColor: pamoja.sheetBg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.55)',
    padding: 16,
  },
  actionTitle: {
    fontWeight: '800',
    fontSize: 17,
    color: palette.ink,
  },
  smallText: {
    color: palette.muted,
    marginTop: 4,
    fontWeight: '600',
  },
});
