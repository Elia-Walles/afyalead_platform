import { Screen, Surface } from '@/components/screen';
import { useMockApp } from '@/context/mock-app-context';
import { StyleSheet, Text } from 'react-native';

export default function InsurancePaymentsScreen() {
  const { payments } = useMockApp();

  return (
    <Screen title="Payments">
      {payments.length === 0 ? (
        <Surface>
          <Text style={styles.meta}>No payment records yet.</Text>
        </Surface>
      ) : (
        payments.map((payment) => (
          <Surface key={payment.id}>
            <Text style={styles.title}>{payment.id}</Text>
            <Text style={styles.meta}>Quote: {payment.quoteId}</Text>
            <Text style={styles.meta}>Method: {payment.method}</Text>
            <Text style={styles.meta}>Amount: TZS {payment.amount.toLocaleString()}</Text>
            <Text style={styles.meta}>Status: {payment.status}</Text>
          </Surface>
        ))
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    color: '#0E2A1A',
    fontWeight: '700',
  },
  meta: {
    color: '#4B6C59',
  },
});
