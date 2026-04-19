import { Screen, Surface } from '@/components/screen';
import { StyleSheet, Text, View } from 'react-native';

const loans = [
  { id: 'LN-1001', amount: 'TZS 8,000,000', status: 'Under Officer Review', progress: '4/9 steps' },
  { id: 'LN-1002', amount: 'TZS 5,500,000', status: 'Approved', progress: '8/9 steps' },
  { id: 'LN-1003', amount: 'TZS 12,000,000', status: 'Disbursed', progress: '9/9 steps' },
];

export default function MicrofinanceLoansScreen() {
  return (
    <Screen title="Loans">
      {loans.map((loan) => (
        <Surface key={loan.id}>
          <Text style={styles.loanId}>{loan.id}</Text>
          <Text style={styles.meta}>{loan.amount}</Text>
          <Text style={styles.meta}>Status: {loan.status}</Text>
          <View style={styles.progressBarWrap}>
            <View style={styles.progressBarFill} />
          </View>
          <Text style={styles.meta}>Progress: {loan.progress}</Text>
        </Surface>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  loanId: {
    fontWeight: '700',
    fontSize: 17,
    color: '#0E2A1A',
  },
  meta: {
    color: '#4B6C59',
  },
  progressBarWrap: {
    marginTop: 4,
    height: 8,
    borderRadius: 99,
    backgroundColor: '#DDEFE2',
  },
  progressBarFill: {
    width: '70%',
    height: '100%',
    borderRadius: 99,
    backgroundColor: '#1B8D4A',
  },
});
