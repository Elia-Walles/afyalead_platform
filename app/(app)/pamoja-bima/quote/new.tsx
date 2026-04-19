import { Screen, Surface } from '@/components/screen';
import { useMockApp } from '@/context/mock-app-context';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput } from 'react-native';

export default function NewQuoteScreen() {
  const router = useRouter();
  const { providerId, packageId } = useLocalSearchParams<{ providerId: string; packageId: string }>();
  const { providers, createQuote } = useMockApp();
  const [membersCount, setMembersCount] = useState('4');

  const selected = useMemo(() => {
    const provider = providers.find((item) => item.id === providerId);
    const pkg = provider?.packages.find((item) => item.id === packageId);
    return { provider, pkg };
  }, [packageId, providerId, providers]);

  const provider = selected.provider;
  const pkg = selected.pkg;
  if (!provider || !pkg) {
    return (
      <Screen title="Quote Setup Missing">
        <Link href="/pamoja-bima" style={styles.backLink}>Back to providers</Link>
      </Screen>
    );
  }

  const handleCreate = () => {
    const quote = createQuote(provider.id, pkg.id, Number(membersCount) || 1);
    if (!quote) return;
    router.push({ pathname: '/pamoja-bima/quote/payment', params: { quoteId: quote.id } });
  };

  return (
    <Screen title="Quote">
      <Surface>
        <Text style={styles.title}>{provider.name} - {pkg.name}</Text>
        <Text style={styles.meta}>Base monthly premium: TZS {pkg.monthlyPremium.toLocaleString()}</Text>
        <Text style={styles.meta}>Benefit scope: {pkg.benefits.join(', ')}</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={membersCount}
          onChangeText={setMembersCount}
          placeholder="Number of covered members"
          placeholderTextColor="#789282"
        />
        <Pressable style={styles.cta} onPress={handleCreate}>
          <Text style={styles.ctaText}>Generate Quote</Text>
        </Pressable>
      </Surface>
    </Screen>
  );
}

const styles = StyleSheet.create({
  backLink: {
    color: '#1B8D4A',
    fontWeight: '700',
  },
  title: {
    color: '#0E2A1A',
    fontWeight: '700',
    fontSize: 16,
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
    marginTop: 4,
  },
  cta: {
    marginTop: 6,
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
