import { Screen, Surface } from '@/components/screen';
import { useMockApp } from '@/context/mock-app-context';
import { Link, useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, Text } from 'react-native';

export default function ProviderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { providers } = useMockApp();
  const provider = providers.find((item) => item.id === id);

  if (!provider) {
    return (
      <Screen title="Provider Not Found">
        <Text style={styles.meta}>Please return to provider selection and try again.</Text>
      </Screen>
    );
  }

  if (provider.id === 'britam') {
    return (
      <Screen title={provider.name} subtitle="Poa, Imara & Super plans — full quote wizard">
        <Surface>
          <Text style={styles.meta}>{provider.shortDescription}</Text>
          <Text style={styles.britamHint}>
            Choose your product, confirm your details, customize coverage, then review your premium — same flow as
            Britam web.
          </Text>
          <Link href="/pamoja-bima/britam/quote" asChild>
            <Pressable style={styles.ctaBritam}>
              <Text style={styles.ctaBritamText}>Start Britam quote</Text>
            </Pressable>
          </Link>
        </Surface>
        <Text style={styles.sectionLabel}>Also available in-app</Text>
        {provider.packages.map((pkg) => (
          <Surface key={pkg.id}>
            <Text style={styles.pkgTitle}>{pkg.name}</Text>
            <Text style={styles.meta}>From TZS {pkg.monthlyPremium.toLocaleString()}/mo · limit TZS {pkg.annualLimit.toLocaleString()}</Text>
          </Surface>
        ))}
      </Screen>
    );
  }

  return (
    <Screen title={provider.name}>
      {provider.packages.map((pkg) => (
        <Surface key={pkg.id}>
          <Text style={styles.pkgTitle}>{pkg.name}</Text>
          <Text style={styles.meta}>Monthly premium: TZS {pkg.monthlyPremium.toLocaleString()}</Text>
          <Text style={styles.meta}>Annual limit: TZS {pkg.annualLimit.toLocaleString()}</Text>
          <Text style={styles.meta}>Members allowed: {pkg.membersAllowed}</Text>
          <Text style={styles.meta}>Benefits: {pkg.benefits.join(', ')}</Text>
          <Link
            href={{
              pathname: '/pamoja-bima/quote/new',
              params: { providerId: provider.id, packageId: pkg.id },
            }}
            asChild
          >
            <Pressable style={styles.cta}>
              <Text style={styles.ctaText}>Start Quote</Text>
            </Pressable>
          </Link>
        </Surface>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  pkgTitle: {
    fontSize: 17,
    color: '#0E2A1A',
    fontWeight: '700',
  },
  meta: {
    color: '#4B6C59',
    lineHeight: 20,
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
  britamHint: {
    color: '#4B6C59',
    lineHeight: 20,
    marginTop: 8,
    fontSize: 14,
  },
  ctaBritam: {
    marginTop: 14,
    backgroundColor: '#0284c7',
    borderRadius: 10,
    alignItems: 'center',
    paddingVertical: 12,
  },
  ctaBritamText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 16,
  },
  sectionLabel: {
    marginTop: 16,
    marginBottom: 6,
    fontSize: 12,
    fontWeight: '800',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
});
