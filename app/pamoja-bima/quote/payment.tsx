import { Screen, Surface } from '@/components/screen';
import { useMockApp } from '@/context/mock-app-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function QuotePaymentScreen() {
  const router = useRouter();
  const { quoteId } = useLocalSearchParams<{ quoteId: string }>();
  const { quotes, payQuote } = useMockApp();
  const quote = quotes.find((item) => item.id === quoteId);

  if (!quote) {
    return (
      <Screen title="Not found">
        <Text style={styles.meta}>Quote unavailable.</Text>
      </Screen>
    );
  }

  const methods: ('mobile_money' | 'card' | 'bank')[] = ['mobile_money', 'card', 'bank'];

  return (
    <Screen title="Payment">
      <Surface>
        <Text style={styles.title}>Quote Ref: {quote.reference}</Text>
        <Text style={styles.meta}>Package: {quote.packageName}</Text>
        <Text style={styles.meta}>Amount: TZS {quote.monthlyPremium.toLocaleString()}</Text>
      </Surface>

      <Surface>
        <Text style={styles.title}>Choose payment method</Text>
        <View style={styles.gap}>
          {methods.map((method) => (
            <Pressable
              key={method}
              style={styles.cta}
              onPress={() => {
                const policy = payQuote(quote.id, method);
                if (policy) router.push({ pathname: '/pamoja-bima/kyc', params: { policyId: policy.id } });
              }}
            >
              <Text style={styles.ctaText}>Pay with {method.replace('_', ' ')}</Text>
            </Pressable>
          ))}
        </View>
      </Surface>
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
  gap: {
    gap: 8,
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
    textTransform: 'capitalize',
  },
});
