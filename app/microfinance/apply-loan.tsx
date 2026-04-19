import { Screen, Surface } from '@/components/screen';
import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, TextInput } from 'react-native';

export default function ApplyLoanScreen() {
  return (
    <Screen title="Loan application">
      <Surface>
        <Text style={styles.stepTitle}>Loan details</Text>
        <TextInput style={styles.input} placeholder="Requested Amount (TZS)" placeholderTextColor="#789282" />
        <TextInput style={styles.input} placeholder="Purpose of Loan" placeholderTextColor="#789282" />
        <TextInput style={styles.input} placeholder="Repayment Period (months)" placeholderTextColor="#789282" />
      </Surface>

      <Surface>
        <Text style={styles.stepTitle}>Group capacity</Text>
        <Text style={styles.helper}>Group score: 82/100</Text>
      </Surface>

      <Link href="/microfinance/loans" asChild>
        <Pressable style={styles.submitButton}>
          <Text style={styles.submitText}>Submit</Text>
        </Pressable>
      </Link>
    </Screen>
  );
}

const styles = StyleSheet.create({
  stepTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0E2A1A',
  },
  helper: {
    color: '#4B6C59',
  },
  input: {
    borderWidth: 1,
    borderColor: '#C8E4D2',
    borderRadius: 10,
    backgroundColor: '#FAFFFC',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  submitButton: {
    backgroundColor: '#1B8D4A',
    borderRadius: 12,
    alignItems: 'center',
    paddingVertical: 14,
  },
  submitText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
