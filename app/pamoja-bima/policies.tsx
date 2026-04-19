import { Screen, Surface } from '@/components/screen';
import { useMockApp } from '@/context/mock-app-context';
import { StyleSheet, Text } from 'react-native';

export default function PoliciesScreen() {
  const { policies, providers } = useMockApp();

  return (
    <Screen title="Policies">
      {policies.length === 0 ? (
        <Surface>
          <Text style={styles.meta}>No policies yet. Start from provider quotation.</Text>
        </Surface>
      ) : (
        policies.map((policy) => (
          <Surface key={policy.id}>
            <Text style={styles.title}>{policy.policyNumber}</Text>
            <Text style={styles.meta}>Provider: {providers.find((p) => p.id === policy.providerId)?.name}</Text>
            <Text style={styles.meta}>Package: {policy.packageName}</Text>
            <Text style={styles.meta}>KYC: {policy.kycCompleted ? 'Completed' : 'Pending'}</Text>
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
    fontSize: 16,
  },
  meta: {
    color: '#4B6C59',
  },
});
