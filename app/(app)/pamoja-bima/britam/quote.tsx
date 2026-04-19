import { AppHeroLayers } from '@/components/AppHeroLayers';
import { brand, gradientPrimary, pamoja, palette, radius } from '@/constants/design-tokens';
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
import { StatusBar } from 'expo-status-bar';
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
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const TAB_BAR = 118;

const DEMO_PROFILE = {
  fullName: 'Demo Customer',
  nationalId: '1990123456789012',
  phone: '+255 700 000 000',
};

const FREQUENCIES: BritamPaymentFrequency[] = ['annual', 'semi-annual', 'quarterly', 'monthly'];

const STEPS = [
  { n: 1, title: 'Plan' },
  { n: 2, title: 'Details' },
  { n: 3, title: 'Cover' },
  { n: 4, title: 'Review' },
];

function formatFreq(f: BritamPaymentFrequency): string {
  if (f === 'semi-annual') return 'Semi-annual';
  return f.charAt(0).toUpperCase() + f.slice(1);
}

export default function BritamQuoteWizardScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
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

  const footerPad = Math.max(insets.bottom, 12) + TAB_BAR;

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

  const canNext = step !== 1 || selectedProduct != null;

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <AppHeroLayers />

      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
        <View style={styles.header}>
          <Pressable onPress={goBack} style={styles.headerBtn} hitSlop={12} accessibilityRole="button">
            <MaterialCommunityIcons name="arrow-left" size={22} color="#fff" />
          </Pressable>
          <Image source={PAMOJA_PROVIDER_LOGOS.britam} style={styles.logo} contentFit="contain" />
          <View style={{ width: 40 }} />
        </View>

        <Text style={styles.screenTitle}>Britam quote</Text>

        <View style={styles.stepRow}>
          {STEPS.map((s) => (
            <View key={s.n} style={styles.stepItem}>
              <View
                style={[
                  styles.stepCircle,
                  step >= s.n && styles.stepCircleOn,
                  step > s.n && styles.stepCircleDone,
                ]}
              >
                <Text style={[styles.stepNum, step >= s.n && styles.stepNumOn]}>
                  {step > s.n ? '✓' : s.n}
                </Text>
              </View>
              <Text style={[styles.stepLabel, step >= s.n && styles.stepLabelOn]} numberOfLines={1}>
                {s.title}
              </Text>
            </View>
          ))}
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: 24 }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.sheet}>
            {step === 1 && (
              <>
                <Text style={styles.h2}>Choose your plan</Text>
                <Text style={styles.subShort}>Poa, Imara, or Super — tap one to continue.</Text>
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
                        <View style={{ flex: 1 }}>
                          <Text style={styles.productName}>{p.name}</Text>
                          <Text style={styles.productVariant}>{p.variant}</Text>
                        </View>
                        {sel ? (
                          <MaterialCommunityIcons name="check-circle" size={24} color={pamoja.greenDeep} />
                        ) : null}
                      </View>
                      <Text style={styles.productDesc}>{p.description}</Text>
                      {p.features.map((f) => (
                        <View key={f} style={styles.featureRow}>
                          <MaterialCommunityIcons name="check" size={16} color={pamoja.greenDeep} />
                          <Text style={styles.featureText}>{f}</Text>
                        </View>
                      ))}
                      <Text style={styles.priceHint}>From TZS {p.basePremium.toLocaleString()}/year</Text>
                    </Pressable>
                  );
                })}
                {!selectedProduct ? (
                  <Text style={styles.hintMuted}>Select a plan, then tap Next below.</Text>
                ) : null}
              </>
            )}

            {step === 2 && (
              <>
                <Text style={styles.h2}>Verify your details</Text>
                <Text style={styles.subShort}>We’ll use these on your policy.</Text>
                <Field label="Full name" value={DEMO_PROFILE.fullName} />
                <Field label="Phone" value={DEMO_PROFILE.phone} />
                <Field label="National ID" value={DEMO_PROFILE.nationalId} />
              </>
            )}

            {step === 3 && selectedProduct && (
              <>
                <Text style={styles.h2}>Coverage</Text>
                <Text style={styles.fieldLabel}>How often you pay</Text>
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

                <View style={styles.rowBetween}>
                  <Text style={styles.fieldLabel}>Dependants</Text>
                  <Pressable onPress={addMember}>
                    <Text style={styles.link}>+ Add</Text>
                  </Pressable>
                </View>
                {familyMembers.map((m, i) => (
                  <View key={i} style={styles.memberCard}>
                    <TextInput
                      style={styles.input}
                      placeholder="Name"
                      placeholderTextColor={palette.muted}
                      value={m.name}
                      onChangeText={(t) => updateMember(i, { name: t })}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Date of birth (YYYY-MM-DD)"
                      placeholderTextColor={palette.muted}
                      value={m.dateOfBirth}
                      onChangeText={(t) => updateMember(i, { dateOfBirth: t })}
                    />
                    <Pressable onPress={() => removeMember(i)}>
                      <Text style={styles.remove}>Remove</Text>
                    </Pressable>
                  </View>
                ))}

                <Text style={[styles.fieldLabel, { marginTop: 12 }]}>Add-ons</Text>
                {BRITAM_ADD_ONS.map((a) => (
                  <Pressable key={a.id} onPress={() => toggleAddon(a.id)} style={styles.addonRow}>
                    <MaterialCommunityIcons
                      name={addOnIds.includes(a.id) ? 'checkbox-marked' : 'checkbox-blank-outline'}
                      size={22}
                      color={pamoja.greenDeep}
                    />
                    <Text style={styles.addonName}>{a.name}</Text>
                  </Pressable>
                ))}
              </>
            )}

            {step === 4 && selectedProduct && (
              <>
                <Text style={styles.h2}>Your quote</Text>
                <LinearGradient colors={[pamoja.sheetBg, '#fff']} style={styles.quoteHero}>
                  <Text style={styles.quoteLabel}>Premium</Text>
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
                    <Text style={styles.summaryKey}>Plan</Text>
                    <Text style={styles.summaryVal} numberOfLines={2}>
                      {selectedProduct.name} · {selectedProduct.variant}
                    </Text>
                  </View>
                  <View style={styles.summaryLine}>
                    <Text style={styles.summaryKey}>Lives</Text>
                    <Text style={styles.summaryVal}>{1 + familyMembers.length}</Text>
                  </View>
                </LinearGradient>
                <Text style={styles.reviewNote}>Full benefit list is on your plan above.</Text>
              </>
            )}
          </View>
        </ScrollView>

        <View style={[styles.footer, { paddingBottom: footerPad }]}>
          {step < 4 ? (
            <View style={styles.footerRow}>
              <Pressable style={styles.secondaryBtn} onPress={goBack} accessibilityRole="button">
                <Text style={styles.secondaryBtnText}>Back</Text>
              </Pressable>
              <Pressable
                style={[styles.primaryBtnWrap, !canNext && styles.btnDisabled]}
                onPress={goNext}
                disabled={!canNext}
                accessibilityRole="button"
              >
                <LinearGradient colors={[...gradientPrimary]} style={styles.primaryBtn}>
                  <Text style={styles.primaryBtnText}>Next</Text>
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
                <LinearGradient colors={[...gradientPrimary]} style={styles.primaryBtn}>
                  <Text style={styles.primaryBtnText}>Pay now</Text>
                </LinearGradient>
              </Pressable>
            </View>
          )}
        </View>
      </SafeAreaView>
    </View>
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
  root: { flex: 1, backgroundColor: pamoja.greenDeep },
  safe: { flex: 1 },
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
    borderRadius: radius.sm,
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: { width: 120, height: 36 },
  screenTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#fff',
    paddingHorizontal: 16,
    marginTop: 8,
  },
  stepRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    marginTop: 14,
    marginBottom: 10,
  },
  stepItem: { flex: 1, alignItems: 'center' },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.35)',
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCircleOn: { borderColor: pamoja.accent, backgroundColor: 'rgba(249,115,22,0.25)' },
  stepCircleDone: { backgroundColor: pamoja.accent, borderColor: pamoja.accent },
  stepNum: { fontSize: 13, fontWeight: '700', color: 'rgba(255,255,255,0.7)' },
  stepNumOn: { color: '#fff' },
  stepLabel: { fontSize: 10, marginTop: 4, color: 'rgba(255,255,255,0.65)', fontWeight: '600' },
  stepLabelOn: { color: '#fff' },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 16 },
  sheet: {
    backgroundColor: pamoja.sheetBg,
    borderRadius: radius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.55)',
    gap: 8,
  },
  h2: { fontSize: 18, fontWeight: '800', color: palette.ink },
  subShort: { fontSize: 13, color: palette.muted, marginBottom: 8 },
  hintMuted: { fontSize: 12, color: palette.muted, fontStyle: 'italic', marginTop: 4 },
  productBox: {
    borderWidth: 2,
    borderColor: palette.border,
    borderRadius: radius.md,
    padding: 14,
    marginTop: 8,
    backgroundColor: palette.surface,
  },
  productBoxSel: { borderColor: pamoja.greenDeep, backgroundColor: brand.primarySoft },
  productHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  productName: { fontSize: 17, fontWeight: '800', color: palette.ink },
  productVariant: { fontSize: 13, fontWeight: '700', color: pamoja.greenDeep, marginTop: 2 },
  productDesc: { fontSize: 13, color: palette.muted, marginTop: 8, lineHeight: 20 },
  featureRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginTop: 6 },
  featureText: { flex: 1, fontSize: 12, color: palette.mutedStrong, lineHeight: 18 },
  priceHint: { marginTop: 12, fontSize: 14, fontWeight: '800', color: pamoja.accent },
  fieldBlock: { marginTop: 4 },
  fieldLabel: { fontSize: 12, fontWeight: '700', color: palette.mutedStrong, marginBottom: 4 },
  fieldReadonly: {
    backgroundColor: palette.borderLight,
    borderRadius: radius.sm,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: palette.border,
  },
  fieldValue: { fontSize: 14, color: palette.ink },
  freqGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  freqChip: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: radius.sm,
    borderWidth: 2,
    borderColor: palette.border,
    backgroundColor: palette.surface,
  },
  freqChipSel: { borderColor: pamoja.greenDeep, backgroundColor: brand.primarySoft },
  freqChipText: { fontSize: 12, fontWeight: '700', color: palette.mutedStrong },
  freqChipTextSel: { color: pamoja.greenDeep },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  link: { fontSize: 14, fontWeight: '800', color: pamoja.greenDeep },
  memberCard: {
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: radius.sm,
    padding: 12,
    gap: 8,
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: radius.sm,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: palette.ink,
  },
  remove: { fontSize: 12, fontWeight: '700', color: '#dc2626' },
  addonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
  },
  addonName: { fontSize: 14, fontWeight: '700', color: palette.ink, flex: 1 },
  quoteHero: {
    borderRadius: radius.md,
    padding: 16,
    borderWidth: 1,
    borderColor: palette.border,
    marginTop: 4,
  },
  quoteLabel: { fontSize: 12, color: palette.muted, textAlign: 'center', fontWeight: '700' },
  quoteBig: {
    fontSize: 28,
    fontWeight: '900',
    color: palette.ink,
    textAlign: 'center',
    marginTop: 4,
  },
  quotePeriod: { fontSize: 13, color: palette.muted, textAlign: 'center', marginTop: 4 },
  divider: { height: 1, backgroundColor: palette.border, marginVertical: 12 },
  summaryLine: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  summaryKey: { fontSize: 13, color: palette.muted },
  summaryVal: { fontSize: 13, fontWeight: '700', color: palette.ink, maxWidth: '58%', textAlign: 'right' },
  reviewNote: { fontSize: 12, color: palette.muted, marginTop: 8 },
  footer: {
    paddingHorizontal: 16,
    paddingTop: 10,
    backgroundColor: pamoja.sheetBg,
    borderTopWidth: 1,
    borderTopColor: palette.border,
  },
  footerRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'flex-end' },
  secondaryBtn: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.surface,
    minWidth: 88,
    alignItems: 'center',
  },
  secondaryBtnText: { fontSize: 15, fontWeight: '700', color: palette.mutedStrong },
  primaryBtnWrap: { borderRadius: radius.sm, overflow: 'hidden', minWidth: 120 },
  primaryBtn: { paddingVertical: 12, paddingHorizontal: 24, alignItems: 'center' },
  primaryBtnText: { fontSize: 15, fontWeight: '800', color: '#fff' },
  btnDisabled: { opacity: 0.45 },
});
