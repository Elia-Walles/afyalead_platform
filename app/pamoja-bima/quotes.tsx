import { Screen, Surface } from '@/components/screen';
import { useMockApp } from '@/context/mock-app-context';
import { StyleSheet, Text } from 'react-native';

export default function QuotesScreen() {
  const { quotes, providers } = useMockApp();

  return (
    <Screen title="Quotes">
      {quotes.length === 0 ? (
        <Surface>
          <Text style={styles.meta}>No quotes generated yet.</Text>
        </Surface>
      ) : (
        quotes.map((quote) => (
          <Surface key={quote.id}>
            <Text style={styles.title}>{quote.reference}</Text>
            <Text style={styles.meta}>Provider: {providers.find((p) => p.id === quote.providerId)?.name}</Text>
            <Text style={styles.meta}>Package: {quote.packageName}</Text>
            <Text style={styles.meta}>Status: {quote.status}</Text>
            <Text style={styles.meta}>Premium: TZS {quote.monthlyPremium.toLocaleString()}</Text>
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
