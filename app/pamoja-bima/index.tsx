import { Screen, Surface } from '@/components/screen';
import { useMockApp } from '@/context/mock-app-context';
import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text } from 'react-native';

export default function PamojaBimaHomeScreen() {
  const { providers } = useMockApp();

  return (
    <Screen title="Pamoja Bima">
      {providers.map((provider) => (
        <Link key={provider.id} href={`/pamoja-bima/provider/${provider.id}`} asChild>
          <Pressable style={styles.providerCard}>
            <Text style={[styles.providerName, { color: provider.themeColor }]}>{provider.name}</Text>
            <Text style={styles.providerText}>{provider.packages.length} packages</Text>
          </Pressable>
        </Link>
      ))}

      <Surface>
        <Text style={styles.sectionTitle}>More</Text>
        <Link href="/pamoja-bima/policies" style={styles.link}>Policies</Link>
        <Link href="/pamoja-bima/quotes" style={styles.link}>Quotes</Link>
        <Link href="/pamoja-bima/payments" style={styles.link}>Payments</Link>
        <Link href="/pamoja-bima/claims" style={styles.link}>Claims</Link>
        <Link href="/pamoja-bima/documents" style={styles.link}>Documents</Link>
        <Link href="/pamoja-bima/notifications" style={styles.link}>Notifications</Link>
        <Link href="/pamoja-bima/settings" style={styles.link}>Settings</Link>
      </Surface>
    </Screen>
  );
}

const styles = StyleSheet.create({
  providerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#C8E4D2',
    padding: 14,
    gap: 5,
  },
  providerName: {
    fontSize: 19,
    fontWeight: '800',
  },
  providerText: {
    color: '#4B6C59',
  },
  sectionTitle: {
    color: '#0E2A1A',
    fontWeight: '700',
    fontSize: 16,
    marginBottom: 4,
  },
  link: {
    color: '#1B8D4A',
    fontWeight: '600',
    marginVertical: 2,
  },
});
