import { Screen, Surface } from '@/components/screen';
import type { BritamPaymentFrequency } from '@/constants/britam-quote-products';
import { useMockApp } from '@/context/mock-app-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

function formatFreq(f: BritamPaymentFrequency): string {
  if (f === 'semi-annual') return 'Semi-annual';
  return f.charAt(0).toUpperCase() + f.slice(1);
}

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

  const isBritam = quote.providerId === 'britam';
  const amount = quote.amountDue ?? quote.monthlyPremium;
  const stylesTheme = isBritam ? britamStyles : defaultPayStyles;

  const methods: ('mobile_money' | 'card' | 'bank')[] = ['mobile_money', 'card', 'bank'];

  return (
    <Screen title={isBritam ? 'Britam — Payment' : 'Payment'}>
      <Surface style={isBritam ? styles.britamSurface : undefined}>
        <Text style={stylesTheme.title}>Quote ref: {quote.reference}</Text>
        <Text style={styles.meta}>Package: {quote.packageName}</Text>
        {quote.sumInsured != null ? (
          <Text style={styles.meta}>Sum insured: TZS {quote.sumInsured.toLocaleString()}</Text>
        ) : null}
        {quote.paymentFrequency ? (
          <Text style={styles.meta}>Billing: {formatFreq(quote.paymentFrequency)}</Text>
        ) : null}
        <Text style={stylesTheme.amountLine}>Amount due: TZS {amount.toLocaleString()}</Text>
      </Surface>

      <Surface style={isBritam ? styles.britamSurface : undefined}>
        <Text style={stylesTheme.title}>Choose payment method</Text>
        <View style={styles.gap}>
          {methods.map((method) => (
            <Pressable
              key={method}
              style={stylesTheme.cta}
              onPress={() => {
                const policy = payQuote(quote.id, method);
                if (policy) {
                  router.push({
                    pathname: '/pamoja-bima/kyc',
                    params: { policyId: policy.id, providerId: policy.providerId },
                  });
                }
              }}
            >
              <Text style={stylesTheme.ctaText}>Pay with {method.replace('_', ' ')}</Text>
            </Pressable>
          ))}
        </View>
      </Surface>
    </Screen>
  );
}

const styles = StyleSheet.create({
  meta: {
    color: '#4B6C59',
  },
  gap: {
    gap: 8,
  },
  britamSurface: {
    borderColor: '#bae6fd',
    backgroundColor: '#f8fafc',
  },
});

const defaultPayStyles = StyleSheet.create({
  title: {
    color: '#0E2A1A',
    fontWeight: '700',
    fontSize: 16,
  },
  amountLine: {
    marginTop: 8,
    color: '#0E2A1A',
    fontWeight: '800',
    fontSize: 17,
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

const britamStyles = StyleSheet.create({
  title: {
    color: '#0f172a',
    fontWeight: '800',
    fontSize: 16,
  },
  amountLine: {
    marginTop: 8,
    color: '#0369a1',
    fontWeight: '900',
    fontSize: 18,
  },
  cta: {
    backgroundColor: '#0284c7',
    borderRadius: 12,
    alignItems: 'center',
    paddingVertical: 12,
  },
  ctaText: {
    color: '#FFFFFF',
    fontWeight: '800',
    textTransform: 'capitalize',
  },
});
