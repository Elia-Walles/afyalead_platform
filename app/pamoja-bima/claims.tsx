import { Screen, Surface } from '@/components/screen';
import { useMockApp } from '@/context/mock-app-context';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput } from 'react-native';

export default function ClaimsScreen() {
  const { claims, policies, submitClaim } = useMockApp();
  const [reason, setReason] = useState('');

  const defaultPolicyNumber = policies[0]?.policyNumber ?? 'POL-DEMO-0001';

  return (
    <Screen title="Claims">
      <Surface>
        <Text style={styles.heading}>New Claim</Text>
        <TextInput
          style={styles.input}
          value={reason}
          onChangeText={setReason}
          placeholder="Claim reason"
          placeholderTextColor="#789282"
        />
        <Pressable
          style={styles.cta}
          onPress={() => {
            if (!reason.trim()) return;
            submitClaim(defaultPolicyNumber, 250000, reason.trim());
            setReason('');
          }}
        >
          <Text style={styles.ctaText}>Submit Mock Claim</Text>
        </Pressable>
      </Surface>

      {claims.map((claim) => (
        <Surface key={claim.id}>
          <Text style={styles.heading}>{claim.id}</Text>
          <Text style={styles.meta}>Policy: {claim.policyNumber}</Text>
          <Text style={styles.meta}>Amount: TZS {claim.amount.toLocaleString()}</Text>
          <Text style={styles.meta}>Status: {claim.status}</Text>
        </Surface>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  heading: {
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
