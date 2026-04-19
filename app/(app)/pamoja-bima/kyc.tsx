import { Screen, Surface } from '@/components/screen';
import { useMockApp } from '@/context/mock-app-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

export default function KycScreen() {
  const router = useRouter();
  const { policyId, providerId: providerIdParam } = useLocalSearchParams<{
    policyId: string;
    providerId?: string;
  }>();
  const { policies, completeKyc } = useMockApp();
  const policy = policies.find((p) => p.id === policyId);

  const isBritam = (providerIdParam ?? policy?.providerId) === 'britam';
  const t = isBritam ? britamStyles : defaultStyles;

  if (!policy) {
    return (
      <Screen title="KYC Setup Missing">
        <Text style={styles.meta}>Please restart from provider selection.</Text>
      </Screen>
    );
  }

  return (
    <Screen title={isBritam ? 'Britam — KYC' : 'KYC'}>
      <Surface style={isBritam ? styles.britamSurface : undefined}>
        <Text style={t.title}>Policy: {policy.policyNumber}</Text>
        <Text style={styles.meta}>Confirm your identity to activate your cover.</Text>
      </Surface>

      <Surface style={isBritam ? styles.britamSurface : undefined}>
        <Text style={t.label}>National ID number</Text>
        <TextInput
          style={t.input}
          placeholder="e.g. 1990123456789012"
          placeholderTextColor={isBritam ? '#94a3b8' : '#789282'}
        />
        <Text style={t.label}>Date of birth</Text>
        <TextInput
          style={t.input}
          placeholder="DD/MM/YYYY"
          placeholderTextColor={isBritam ? '#94a3b8' : '#789282'}
        />
        <Text style={t.label}>Emergency contact (name & phone)</Text>
        <TextInput
          style={t.input}
          placeholder="Name — +255…"
          placeholderTextColor={isBritam ? '#94a3b8' : '#789282'}
        />
        {isBritam ? (
          <View style={styles.notice}>
            <Text style={styles.noticeText}>
              Britam may request supporting documents later via AfyaLead notifications.
            </Text>
          </View>
        ) : null}
        <Pressable
          style={t.cta}
          onPress={() => {
            completeKyc(policy.id);
            router.push({
              pathname: '/pamoja-bima/virtual-card',
              params: { policyId: policy.id, providerId: policy.providerId },
            });
          }}
        >
          <Text style={t.ctaText}>Complete KYC</Text>
        </Pressable>
      </Surface>
    </Screen>
  );
}

const styles = StyleSheet.create({
  meta: {
    color: '#4B6C59',
  },
  britamSurface: {
    borderColor: '#bae6fd',
    backgroundColor: '#f8fafc',
  },
  notice: {
    marginTop: 8,
    padding: 10,
    backgroundColor: '#e0f2fe',
    borderRadius: 10,
  },
  noticeText: {
    fontSize: 12,
    color: '#0369a1',
    lineHeight: 18,
  },
});

const defaultStyles = StyleSheet.create({
  title: {
    color: '#0E2A1A',
    fontWeight: '700',
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4B6C59',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#C8E4D2',
    borderRadius: 10,
    backgroundColor: '#FAFFFC',
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
  },
  cta: {
    marginTop: 8,
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

const britamStyles = StyleSheet.create({
  title: {
    color: '#0f172a',
    fontWeight: '800',
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
  },
  cta: {
    marginTop: 8,
    backgroundColor: '#0284c7',
    borderRadius: 12,
    alignItems: 'center',
    paddingVertical: 12,
  },
  ctaText: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
});
