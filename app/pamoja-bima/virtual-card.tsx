import { Screen, Surface } from '@/components/screen';
import { useMockApp } from '@/context/mock-app-context';
import { Link, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function VirtualCardScreen() {
  const { policyId } = useLocalSearchParams<{ policyId: string }>();
  const { policies, providers } = useMockApp();
  const policy = policies.find((item) => item.id === policyId);

  if (!policy) {
    return (
      <Screen title="Virtual Card Unavailable">
        <Text style={styles.meta}>Generate a policy first from the quote flow.</Text>
      </Screen>
    );
  }

  const providerName = providers.find((p) => p.id === policy.providerId)?.name ?? 'Provider';

  return (
    <Screen title="Virtual card">
      <View style={styles.card}>
        <Text style={styles.cardBrand}>Pamoja Bima</Text>
        <Text style={styles.cardProvider}>{providerName}</Text>
        <Text style={styles.cardLine}>Member: {policy.memberName}</Text>
        <Text style={styles.cardLine}>Policy: {policy.policyNumber}</Text>
        <Text style={styles.cardLine}>Card No: {policy.virtualCardNumber}</Text>
      </View>

      <Surface>
        <Text style={styles.meta}>KYC status: {policy.kycCompleted ? 'Completed' : 'Pending'}</Text>
        <Link href="/pamoja-bima/policies" style={styles.link}>Go to Policies</Link>
        <Link href="/pamoja-bima/documents" style={styles.link}>Open Documents</Link>
      </Surface>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1B8D4A',
    borderRadius: 16,
    padding: 18,
    gap: 6,
  },
  cardBrand: {
    color: '#DDF7E8',
    fontWeight: '600',
  },
  cardProvider: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
  },
  cardLine: {
    color: '#EAFBF1',
  },
  meta: {
    color: '#4B6C59',
  },
  link: {
    color: '#1B8D4A',
    fontWeight: '700',
    marginTop: 4,
  },
});
