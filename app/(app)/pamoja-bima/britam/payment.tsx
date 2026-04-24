import { AppHeroLayers } from '@/components/AppHeroLayers';
import { brand, gradientPrimary, pamoja, palette, radius } from '@/constants/design-tokens';
import { useMockApp } from '@/context/mock-app-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const TAB_BAR = 118;

type PaymentMethod = 'mpesa' | 'tigo' | 'airtel' | 'card';

const PAYMENT_METHODS: { id: PaymentMethod; name: string; icon: keyof typeof MaterialCommunityIcons.glyphMap }[] = [
  { id: 'mpesa', name: 'M-Pesa', icon: 'cellphone' },
  { id: 'tigo', name: 'Tigo Pesa', icon: 'cellphone-link' },
  { id: 'airtel', name: 'Airtel Money', icon: 'cellphone-text' },
  { id: 'card', name: 'Card', icon: 'credit-card' },
];

export default function BritamPaymentScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ quoteId: string }>();
  const { processBritamMobilePayment } = useMockApp();
  
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('mpesa');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handlePayment = async () => {
    if (isProcessing) return;
    
    // Validation
    if (selectedMethod !== 'card' && !phoneNumber) {
      alert('Please enter phone number');
      return;
    }
    if (selectedMethod === 'card' && (!cardNumber || !expiry || !cvv)) {
      alert('Please enter card details');
      return;
    }

    setIsProcessing(true);
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Simulate payment processing
    setTimeout(() => {
      const policy = processBritamMobilePayment(params.quoteId, selectedMethod === 'card' ? 'card' : 'mobile_money');
      setIsProcessing(false);
      
      if (policy) {
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setShowSuccess(true);
      } else {
        alert('Payment failed. Please try again.');
      }
    }, 2000);
  };

  const handleSuccess = () => {
    router.replace('/pamoja-bima/policies');
  };

  if (showSuccess) {
    return (
      <View style={styles.root}>
        <StatusBar style="light" />
        <AppHeroLayers />
        <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
          <View style={styles.successContainer}>
            <View style={styles.successIcon}>
              <MaterialCommunityIcons name="check-circle" size={80} color={pamoja.greenDeep} />
            </View>
            <Text style={styles.successTitle}>Payment Successful!</Text>
            <Text style={styles.successText}>Your policy has been activated.</Text>
            <Pressable style={styles.successBtn} onPress={handleSuccess}>
              <LinearGradient colors={[...gradientPrimary]} style={styles.successBtnGradient}>
                <Text style={styles.successBtnText}>View My Policies</Text>
              </LinearGradient>
            </Pressable>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <AppHeroLayers />
      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
        <View style={styles.headerSection}>
          <View style={styles.headerText}>
            <Text style={styles.headerLabel}>Insurance</Text>
            <Text style={styles.screenTitle}>Payment</Text>
          </View>
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.sheet}>
            <Text style={styles.h2}>Select payment method</Text>
            <View style={styles.methodGrid}>
              {PAYMENT_METHODS.map((method) => (
                <Pressable
                  key={method.id}
                  onPress={() => {
                    void Haptics.selectionAsync();
                    setSelectedMethod(method.id);
                  }}
                  style={[styles.methodCard, selectedMethod === method.id && styles.methodCardSel]}
                >
                  <MaterialCommunityIcons
                    name={method.icon}
                    size={32}
                    color={selectedMethod === method.id ? pamoja.greenDeep : palette.muted}
                  />
                  <Text style={[styles.methodName, selectedMethod === method.id && styles.methodNameSel]}>
                    {method.name}
                  </Text>
                  {selectedMethod === method.id && (
                    <View style={styles.methodCheck}>
                      <MaterialCommunityIcons name="check" size={16} color="#fff" />
                    </View>
                  )}
                </Pressable>
              ))}
            </View>

            {selectedMethod !== 'card' ? (
              <>
                <Text style={styles.fieldLabel}>Phone number</Text>
                <TextInput
                  style={styles.input}
                  placeholder="+255 7XX XXX XXX"
                  placeholderTextColor={palette.muted}
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  keyboardType="phone-pad"
                />
              </>
            ) : (
              <>
                <Text style={styles.fieldLabel}>Card number</Text>
                <TextInput
                  style={styles.input}
                  placeholder="XXXX XXXX XXXX XXXX"
                  placeholderTextColor={palette.muted}
                  value={cardNumber}
                  onChangeText={setCardNumber}
                  keyboardType="numeric"
                  maxLength={19}
                />
                <View style={styles.rowBetween}>
                  <View style={styles.halfWidth}>
                    <Text style={styles.fieldLabel}>Expiry (MM/YY)</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="MM/YY"
                      placeholderTextColor={palette.muted}
                      value={expiry}
                      onChangeText={setExpiry}
                      keyboardType="numeric"
                      maxLength={5}
                    />
                  </View>
                  <View style={styles.halfWidth}>
                    <Text style={styles.fieldLabel}>CVV</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="XXX"
                      placeholderTextColor={palette.muted}
                      value={cvv}
                      onChangeText={setCvv}
                      keyboardType="numeric"
                      maxLength={3}
                      secureTextEntry
                    />
                  </View>
                </View>
              </>
            )}

            <Pressable
              style={[styles.payBtn, isProcessing && styles.payBtnDisabled]}
              onPress={handlePayment}
              disabled={isProcessing}
            >
              <LinearGradient colors={[...gradientPrimary]} style={styles.payBtnGradient}>
                {isProcessing ? (
                  <Text style={styles.payBtnText}>Processing...</Text>
                ) : (
                  <Text style={styles.payBtnText}>Pay Now</Text>
                )}
              </LinearGradient>
            </Pressable>

            <Pressable style={styles.cancelBtn} onPress={() => router.back()}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: pamoja.greenDeep },
  safe: { flex: 1 },
  headerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 8,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  headerLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#fff',
    marginTop: 2,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sheet: {
    backgroundColor: pamoja.sheetBg,
    borderRadius: radius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.55)',
    gap: 16,
  },
  h2: { fontSize: 18, fontWeight: '800', color: palette.ink },
  methodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  methodCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    borderWidth: 2,
    borderColor: palette.border,
    alignItems: 'center',
    gap: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
      android: { elevation: 3 },
      default: {},
    }),
  },
  methodCardSel: {
    borderColor: pamoja.greenDeep,
    backgroundColor: 'rgba(4,120,87,0.03)',
    ...Platform.select({
      ios: {
        shadowColor: pamoja.greenDeep,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
      },
      android: { elevation: 6 },
      default: {},
    }),
  },
  methodName: {
    fontSize: 14,
    fontWeight: '700',
    color: palette.mutedStrong,
  },
  methodNameSel: {
    color: pamoja.greenDeep,
  },
  methodCheck: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: pamoja.greenDeep,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fieldLabel: { fontSize: 14, fontWeight: '700', color: palette.mutedStrong, marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: radius.sm,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: palette.ink,
    backgroundColor: '#fff',
  },
  rowBetween: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  payBtn: {
    borderRadius: radius.sm,
    overflow: 'hidden',
    marginTop: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: { elevation: 4 },
      default: {},
    }),
  },
  payBtnDisabled: {
    opacity: 0.6,
  },
  payBtnGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  payBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
  },
  cancelBtn: {
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  cancelBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: palette.muted,
  },
  successContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  successIcon: {
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 12,
  },
  successText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginBottom: 32,
  },
  successBtn: {
    borderRadius: radius.sm,
    overflow: 'hidden',
    width: '100%',
  },
  successBtnGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  successBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
  },
});
