import { Screen, Surface } from '@/components/screen';
import { useMockApp } from '@/context/mock-app-context';
import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function MicrofinanceHomeScreen() {
  const { selectedRole, setSelectedRole } = useMockApp();
  const roleOptions: ('group' | 'admin' | 'officer')[] = ['group', 'admin', 'officer'];

  return (
    <Screen title="Microfinance">
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
    fontWeight: '700',
    fontSize: 16,
    color: '#0E2A1A',
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  roleChip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#C8E4D2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F5FCF7',
  },
  roleChipActive: {
    backgroundColor: '#1B8D4A',
    borderColor: '#1B8D4A',
  },
  roleText: {
    color: '#1B6940',
    fontWeight: '600',
    fontSize: 12,
  },
  roleTextActive: {
    color: '#FFFFFF',
  },
  actionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#C8E4D2',
    padding: 16,
  },
  actionTitle: {
    fontWeight: '700',
    fontSize: 17,
    color: '#0E2A1A',
  },
  smallText: {
    color: '#4B6C59',
    marginTop: 4,
    fontWeight: '600',
  },
});
