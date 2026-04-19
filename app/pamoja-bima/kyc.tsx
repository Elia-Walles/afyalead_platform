import { Screen, Surface } from '@/components/screen';
import { useMockApp } from '@/context/mock-app-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, TextInput } from 'react-native';

export default function KycScreen() {
  const router = useRouter();
  const { policyId } = useLocalSearchParams<{ policyId: string }>();
  const { policies, completeKyc } = useMockApp();
  const policy = policies.find((p) => p.id === policyId);

  if (!policy) {
    return (
      <Screen title="KYC Setup Missing">
        <Text style={styles.meta}>Please restart from provider selection.</Text>
      </Screen>
    );
  }

  return (
    <Screen title="KYC">
      <Surface>
        <Text style={styles.title}>Policy: {policy.policyNumber}</Text>
        <TextInput style={styles.input} placeholder="National ID Number" placeholderTextColor="#789282" />
        <TextInput style={styles.input} placeholder="Date of Birth (DD/MM/YYYY)" placeholderTextColor="#789282" />
        <TextInput style={styles.input} placeholder="Emergency Contact" placeholderTextColor="#789282" />
        <Pressable
          style={styles.cta}
          onPress={() => {
            completeKyc(policy.id);
            router.push({ pathname: '/pamoja-bima/virtual-card', params: { policyId: policy.id } });
          }}
        >
          <Text style={styles.ctaText}>Complete KYC (Mock)</Text>
        </Pressable>
      </Surface>
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
  input: {
    borderWidth: 1,
    borderColor: '#C8E4D2',
    borderRadius: 10,
    backgroundColor: '#FAFFFC',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  cta: {
    backgroundColor: '#1B8D4A',
    borderRadius: 10,
    alignItems: 'center',
    paddingVertical: 10,
  },
  ctaText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
