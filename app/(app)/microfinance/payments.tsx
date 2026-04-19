import { Screen, Surface } from '@/components/screen';
import { StyleSheet, Text } from 'react-native';

export default function MicrofinancePaymentsScreen() {
  return (
    <Screen title="Repayments">
      <Surface>
        <Text style={styles.title}>Next Due Installment</Text>
        <Text style={styles.meta}>Loan: LN-1003</Text>
        <Text style={styles.meta}>Amount: TZS 640,000</Text>
        <Text style={styles.meta}>Due Date: 23 Apr 2026</Text>
      </Surface>

      <Surface>
        <Text style={styles.title}>Recent Payments</Text>
        <Text style={styles.meta}>17 Apr 2026 - TZS 640,000 - Completed</Text>
        <Text style={styles.meta}>17 Mar 2026 - TZS 640,000 - Completed</Text>
        <Text style={styles.meta}>17 Feb 2026 - TZS 640,000 - Completed</Text>
      </Surface>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    color: '#0E2A1A',
    fontWeight: '700',
  },
  meta: {
    color: '#4B6C59',
  },
});
