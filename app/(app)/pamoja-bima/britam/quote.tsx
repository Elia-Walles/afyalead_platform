import { PAMOJA_PROVIDER_LOGOS } from '@/constants/pamoja-provider-logos';
import {
  BRITAM_ADD_ONS,
  BRITAM_QUOTE_PRODUCTS,
  type BritamFamilyMemberInput,
  type BritamPaymentFrequency,
  type BritamQuoteProduct,
  calculateBritamPremium,
} from '@/constants/britam-quote-products';
import { useMockApp } from '@/context/mock-app-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SKY = '#0284c7';
const SKY_DARK = '#0369a1';
const BG = '#f0f9ff';

const DEMO_PROFILE = {
  fullName: 'Demo Customer',
  dateOfBirth: '1990-05-15',
  gender: 'Female',
  nationalId: '1990123456789012',
  email: 'demo@afyalead.app',
  phone: '+255 700 000 000',
  address: 'Dar es Salaam, Tanzania',
  occupation: 'Professional',
};

const FREQUENCIES: BritamPaymentFrequency[] = ['annual', 'semi-annual', 'quarterly', 'monthly'];

const STEPS = [
  { n: 1, title: 'Product' },
  { n: 2, title: 'Your details' },
  { n: 3, title: 'Coverage' },
  { n: 4, title: 'Review' },
];

function formatFreq(f: BritamPaymentFrequency): string {
  if (f === 'semi-annual') return 'Semi-annual';
  return f.charAt(0).toUpperCase() + f.slice(1);
}

export default function BritamQuoteWizardScreen() {
  const router = useRouter();
  const { createBritamQuote } = useMockApp();
  const [step, setStep] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<BritamQuoteProduct | null>(null);
  const [paymentFrequency, setPaymentFrequency] = useState<BritamPaymentFrequency>('annual');
  const [familyMembers, setFamilyMembers] = useState<BritamFamilyMemberInput[]>([]);
  const [addOnIds, setAddOnIds] = useState<string[]>([]);

  const premiumPreview = useMemo(() => {
    if (!selectedProduct) return { premium: 0, sumInsured: 0 };
    return calculateBritamPremium({
      product: selectedProduct,
      paymentFrequency,
      familyMembers,
      addOnIds,
    });
  }, [selectedProduct, paymentFrequency, familyMembers, addOnIds]);

  const toggleAddon = (id: string) => {
    void Haptics.selectionAsync();
    setAddOnIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const addMember = () => {
    void Haptics.selectionAsync();
    setFamilyMembers((prev) => [
      ...prev,
      { name: '', relationship: 'spouse', dateOfBirth: '', gender: 'male' },
    ]);
  };

  const updateMember = (index: number, patch: Partial<BritamFamilyMemberInput>) => {
    setFamilyMembers((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], ...patch };
      return next;
    });
  };

  const removeMember = (index: number) => {
    void Haptics.selectionAsync();
    setFamilyMembers((prev) => prev.filter((_, i) => i !== index));
  };

  const goNext = () => {
    if (step === 1 && !selectedProduct) return;
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setStep((s) => Math.min(4, s + 1));
  };

  const goBack = () => {
    void Haptics.selectionAsync();
    if (step <= 1) {
      router.back();
      return;
    }
    setStep((s) => s - 1);
  };

  const saveDraft = () => {
    if (!selectedProduct) return;
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const q = createBritamQuote({
      product: selectedProduct,
      paymentFrequency,
      familyMembers,
      addOnIds,
      outcome: 'draft',
    });
    if (q) router.replace('/pamoja-bima/quotes');
  };

  const continueToPayment = () => {
    if (!selectedProduct) return;
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const q = createBritamQuote({
      product: selectedProduct,
      paymentFrequency,
      familyMembers,
      addOnIds,
      outcome: 'pending_payment',
    });
    if (q) {
      router.replace({
        pathname: '/pamoja-bima/quote/payment',
        params: { quoteId: q.id, providerId: 'britam' },
      });
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <LinearGradient colors={['#ffffff', BG]} style={StyleSheet.absoluteFill} />
      <View style={styles.header}>
        <Pressable onPress={goBack} style={styles.headerBtn} hitSlop={12}>
          <MaterialCommunityIcons name="arrow-left" size={22} color="#0f172a" />
        </Pressable>
        <Image source={PAMOJA_PROVIDER_LOGOS.britam} style={styles.logo} contentFit="contain" />
        <View style={{ width: 40 }} />
      </View>
      <Text style={styles.screenTitle}>Get a quote</Text>

      <View style={styles.stepRow}>
        {STEPS.map((s, i) => (
          <View key={s.n} style={styles.stepItem}>
            <View
              style={[
                styles.stepCircle,
                step >= s.n && styles.stepCircleActive,
                step > s.n && styles.stepCircleDone,
              ]}
            >
              <Text style={[styles.stepNum, step >= s.n && styles.stepNumActive]}>
                {step > s.n ? '✓' : s.n}
              </Text>
            </View>
            <Text style={[styles.stepLabel, step >= s.n && styles.stepLabelActive]} numberOfLines={1}>
              {s.title}
            </Text>
            {i < STEPS.length - 1 ? <View style={[styles.stepLine, step > s.n && styles.stepLineActive]} /> : null}
          </View>
        ))}
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {step === 1 && (
          <View style={styles.card}>
            <Text style={styles.h2}>Select insurance product</Text>
            <Text style={styles.sub}>Choose the medical plan that suits your needs</Text>
            {BRITAM_QUOTE_PRODUCTS.map((p) => {
              const sel = selectedProduct?.id === p.id;
              return (
                <Pressable
                  key={p.id}
                  onPress={() => {
                    void Haptics.selectionAsync();
                    setSelectedProduct(p);
                  }}
                  style={[styles.productBox, sel && styles.productBoxSel]}
                >
                  <View style={styles.productHead}>
                    <Text style={styles.productName}>{p.name}</Text>
                    {sel ? (
                      <MaterialCommunityIcons name="check-circle" size={22} color={SKY} />
                    ) : null}
                  </View>
                  <Text style={styles.productDesc}>{p.description}</Text>
                  {p.features.slice(0, 3).map((f) => (
                    <View key={f} style={styles.featureRow}>
                      <MaterialCommunityIcons name="check" size={16} color={SKY} />
                      <Text style={styles.featureText}>{f}</Text>
                    </View>
                  ))}
                  <Text style={styles.priceHint}>From TZS {p.basePremium.toLocaleString()}/year</Text>
                </Pressable>
              );
            })}
          </View>
        )}

        {step === 2 && (
          <View style={styles.card}>
            <Text style={styles.h2}>Personal details</Text>
            <Text style={styles.sub}>Review your profile (demo — update in Settings later).</Text>
            <View style={styles.infoBanner}>
              <MaterialCommunityIcons name="information-outline" size={18} color={SKY_DARK} />
              <Text style={styles.infoBannerText}>Your profile is saved with AfyaLead.</Text>
            </View>
            <Field label="Full name" value={DEMO_PROFILE.fullName} />
            <Field label="Date of birth" value={DEMO_PROFILE.dateOfBirth} />
            <Field label="Gender" value={DEMO_PROFILE.gender} />
            <Field label="National ID" value={DEMO_PROFILE.nationalId} />
            <Field label="Email" value={DEMO_PROFILE.email} />
            <Field label="Phone" value={DEMO_PROFILE.phone} />
            <Field label="Address" value={DEMO_PROFILE.address} />
            <Field label="Occupation" value={DEMO_PROFILE.occupation} />
          </View>
        )}

        {step === 3 && selectedProduct && (
          <View style={styles.card}>
            <Text style={styles.h2}>Coverage options</Text>
            <Text style={styles.sub}>Payment frequency, family members, and add-ons</Text>

            <Text style={styles.fieldLabel}>Payment frequency</Text>
            <View style={styles.freqGrid}>
              {FREQUENCIES.map((f) => (
                <Pressable
                  key={f}
                  onPress={() => {
                    void Haptics.selectionAsync();
                    setPaymentFrequency(f);
                  }}
                  style={[styles.freqChip, paymentFrequency === f && styles.freqChipSel]}
                >
                  <Text style={[styles.freqChipText, paymentFrequency === f && styles.freqChipTextSel]}>
                    {formatFreq(f)}
                  </Text>
                </Pressable>
              ))}
            </View>
            <Text style={styles.hint}>Annual offers the best value. Monthly includes a convenience fee.</Text>

            <View style={styles.rowBetween}>
              <Text style={styles.fieldLabel}>Family members (optional)</Text>
              <Pressable onPress={addMember}>
                <Text style={styles.link}>+ Add member</Text>
              </Pressable>
            </View>
            {familyMembers.map((m, i) => (
              <View key={i} style={styles.memberCard}>
                <TextInput
                  style={styles.input}
                  placeholder="Full name"
                  placeholderTextColor="#94a3b8"
                  value={m.name}
                  onChangeText={(t) => updateMember(i, { name: t })}
                />
                <View style={styles.memberRow}>
                  <Text style={styles.miniLabel}>Relationship</Text>
                  <View style={styles.relRow}>
                    {(['spouse', 'child', 'parent', 'sibling', 'other'] as const).map((r) => (
                      <Pressable
                        key={r}
                        onPress={() => updateMember(i, { relationship: r })}
                        style={[styles.relChip, m.relationship === r && styles.relChipSel]}
                      >
                        <Text style={styles.relChipText}>{r}</Text>
                      </Pressable>
                    ))}
                  </View>
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Date of birth (YYYY-MM-DD)"
                  placeholderTextColor="#94a3b8"
                  value={m.dateOfBirth}
                  onChangeText={(t) => updateMember(i, { dateOfBirth: t })}
                />
                <Pressable onPress={() => removeMember(i)}>
                  <Text style={styles.remove}>Remove</Text>
                </Pressable>
              </View>
            ))}

            <Text style={[styles.fieldLabel, { marginTop: 12 }]}>Optional add-ons</Text>
            {BRITAM_ADD_ONS.map((a) => (
              <Pressable key={a.id} onPress={() => toggleAddon(a.id)} style={styles.addonRow}>
                <MaterialCommunityIcons
                  name={addOnIds.includes(a.id) ? 'checkbox-marked' : 'checkbox-blank-outline'}
                  size={22}
                  color={SKY}
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.addonName}>{a.name}</Text>
                  <Text style={styles.addonDesc}>{a.description}</Text>
                </View>
              </Pressable>
            ))}
          </View>
        )}

        {step === 4 && selectedProduct && (
          <View style={styles.card}>
            <Text style={styles.h2}>Review & quote</Text>
            <Text style={styles.sub}>Confirm your selections before payment</Text>

            <LinearGradient colors={['#e0f2fe', '#f0f9ff']} style={styles.quoteHero}>
              <Text style={styles.quoteLabel}>Your premium</Text>
              <Text style={styles.quoteBig}>TZS {premiumPreview.premium.toLocaleString()}</Text>
              <Text style={styles.quotePeriod}>
                per {paymentFrequency === 'annual' ? 'year' : formatFreq(paymentFrequency).toLowerCase()}
              </Text>
              <View style={styles.divider} />
              <View style={styles.summaryLine}>
                <Text style={styles.summaryKey}>Sum insured</Text>
                <Text style={styles.summaryVal}>TZS {premiumPreview.sumInsured.toLocaleString()}</Text>
              </View>
              <View style={styles.summaryLine}>
                <Text style={styles.summaryKey}>Product</Text>
                <Text style={styles.summaryVal}>
                  {selectedProduct.name} — {selectedProduct.variant}
                </Text>
              </View>
              <View style={styles.summaryLine}>
                <Text style={styles.summaryKey}>Covered lives</Text>
                <Text style={styles.summaryVal}>{1 + familyMembers.length}</Text>
              </View>
              {addOnIds.length > 0 ? (
                <View style={styles.summaryLine}>
                  <Text style={styles.summaryKey}>Add-ons</Text>
                  <Text style={styles.summaryVal}>{addOnIds.length} selected</Text>
                </View>
              ) : null}
            </LinearGradient>

            <Text style={styles.coversTitle}>Coverage includes</Text>
            {selectedProduct.features.map((f) => (
              <View key={f} style={styles.featureRow}>
                <MaterialCommunityIcons name="check" size={16} color={SKY} />
                <Text style={styles.featureText}>{f}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        {step < 4 ? (
          <View style={styles.footerRow}>
            <Pressable style={styles.secondaryBtn} onPress={goBack}>
              <Text style={styles.secondaryBtnText}>{step === 1 ? 'Cancel' : 'Back'}</Text>
            </Pressable>
            <Pressable
              style={[styles.primaryBtnWrap, step === 1 && !selectedProduct && styles.btnDisabled]}
              onPress={goNext}
              disabled={step === 1 && !selectedProduct}
            >
              <LinearGradient colors={[SKY, SKY_DARK]} style={styles.primaryBtn}>
                <Text style={styles.primaryBtnText}>
                  {step === 1 ? 'Next: Your details' : step === 2 ? 'Next: Coverage' : 'Next: Review'}
                </Text>
              </LinearGradient>
            </Pressable>
          </View>
        ) : (
          <View style={styles.footerRow}>
            <Pressable style={styles.secondaryBtn} onPress={goBack}>
              <Text style={styles.secondaryBtnText}>Back</Text>
            </Pressable>
            <Pressable style={styles.secondaryBtn} onPress={saveDraft}>
              <Text style={styles.secondaryBtnText}>Save draft</Text>
            </Pressable>
            <Pressable style={styles.primaryBtnWrap} onPress={continueToPayment}>
              <LinearGradient colors={['#059669', '#047857']} style={styles.primaryBtn}>
                <Text style={styles.primaryBtnText}>Pay now</Text>
              </LinearGradient>
            </Pressable>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.fieldBlock}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={styles.fieldReadonly}>
        <Text style={styles.fieldValue}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingTop: 4,
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: { width: 120, height: 36 },
  screenTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
    paddingHorizontal: 16,
    marginTop: 8,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 8,
    marginTop: 16,
    marginBottom: 8,
  },
  stepItem: { flex: 1, alignItems: 'center' },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#cbd5e1',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCircleActive: { borderColor: SKY, backgroundColor: SKY },
  stepCircleDone: { backgroundColor: SKY, borderColor: SKY },
  stepNum: { fontSize: 13, fontWeight: '700', color: '#94a3b8' },
  stepNumActive: { color: '#fff' },
  stepLabel: { fontSize: 10, marginTop: 4, color: '#94a3b8', fontWeight: '600' },
  stepLabelActive: { color: SKY_DARK },
  stepLine: {
    position: 'absolute',
    right: '-50%',
    top: 15,
    width: '100%',
    height: 2,
    backgroundColor: '#e2e8f0',
    zIndex: -1,
  },
  stepLineActive: { backgroundColor: SKY },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 120 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 10,
  },
  h2: { fontSize: 20, fontWeight: '800', color: '#0f172a' },
  sub: { fontSize: 14, color: '#64748b', marginBottom: 4 },
  productBox: {
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderRadius: 14,
    padding: 14,
    marginTop: 8,
  },
  productBoxSel: { borderColor: SKY, backgroundColor: '#f0f9ff' },
  productHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  productName: { fontSize: 17, fontWeight: '800', color: '#0f172a' },
  productDesc: { fontSize: 13, color: '#64748b', marginTop: 6 },
  featureRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginTop: 4 },
  featureText: { flex: 1, fontSize: 12, color: '#475569' },
  priceHint: { marginTop: 10, fontSize: 14, fontWeight: '700', color: SKY },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#e0f2fe',
    padding: 10,
    borderRadius: 10,
  },
  infoBannerText: { flex: 1, fontSize: 13, color: '#0369a1' },
  fieldBlock: { marginTop: 4 },
  fieldLabel: { fontSize: 12, fontWeight: '700', color: '#475569', marginBottom: 4 },
  fieldReadonly: {
    backgroundColor: '#f1f5f9',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  fieldValue: { fontSize: 14, color: '#334155' },
  freqGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  freqChip: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    backgroundColor: '#fff',
  },
  freqChipSel: { borderColor: SKY, backgroundColor: '#e0f2fe' },
  freqChipText: { fontSize: 12, fontWeight: '700', color: '#475569' },
  freqChipTextSel: { color: SKY_DARK },
  hint: { fontSize: 11, color: '#94a3b8', marginTop: 4 },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  link: { fontSize: 14, fontWeight: '700', color: SKY },
  memberCard: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 12,
    gap: 8,
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0f172a',
  },
  memberRow: { gap: 6 },
  miniLabel: { fontSize: 11, fontWeight: '700', color: '#64748b' },
  relRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  relChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
  },
  relChipSel: { backgroundColor: '#e0f2fe' },
  relChipText: { fontSize: 11, color: '#475569', textTransform: 'capitalize' },
  remove: { fontSize: 12, fontWeight: '700', color: '#dc2626' },
  addonRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, paddingVertical: 8 },
  addonName: { fontSize: 14, fontWeight: '700', color: '#0f172a' },
  addonDesc: { fontSize: 12, color: '#64748b' },
  quoteHero: {
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#bae6fd',
    marginTop: 8,
  },
  quoteLabel: { fontSize: 13, color: '#0369a1', textAlign: 'center' },
  quoteBig: {
    fontSize: 32,
    fontWeight: '900',
    color: '#0f172a',
    textAlign: 'center',
    marginTop: 4,
  },
  quotePeriod: { fontSize: 13, color: '#64748b', textAlign: 'center', marginTop: 4 },
  divider: { height: 1, backgroundColor: '#bae6fd', marginVertical: 12 },
  summaryLine: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  summaryKey: { fontSize: 13, color: '#64748b' },
  summaryVal: { fontSize: 13, fontWeight: '700', color: '#0f172a', maxWidth: '60%' },
  coversTitle: { fontSize: 15, fontWeight: '800', color: '#0f172a', marginTop: 12 },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 28,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  footerRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'flex-end' },
  secondaryBtn: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    backgroundColor: '#fff',
  },
  secondaryBtnText: { fontSize: 14, fontWeight: '700', color: '#475569' },
  primaryBtnWrap: { borderRadius: 12, overflow: 'hidden' },
  primaryBtn: { paddingVertical: 12, paddingHorizontal: 18 },
  primaryBtnText: { fontSize: 14, fontWeight: '800', color: '#fff', textAlign: 'center' },
  btnDisabled: { opacity: 0.45 },
});
