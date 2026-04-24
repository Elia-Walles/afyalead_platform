import { AppHeroLayers } from '@/components/AppHeroLayers';
import { brand, gradientPrimary, pamoja, palette, radius } from '@/constants/design-tokens';
import { PAMOJA_PROVIDER_LOGOS } from '@/constants/pamoja-provider-logos';
import {
  BRITAM_ADD_ONS,
  BRITAM_MOBILE_PRODUCTS,
  PAYMENT_FREQUENCY_LABELS,
  type BritamCoverageDetails,
  type BritamFamilyMember,
  type BritamMobileProduct,
  type BritamPaymentFrequency,
  calculateBritamPremium,
} from '@/constants/britam-mobile-products';
import { useMockApp } from '@/context/mock-app-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  Modal,
  Platform,
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
  dateOfBirth: '1990-01-15',
  gender: 'Male',
  nationalId: '1990123456789012',
  email: 'demo@example.com',
  phone: '+255 700 000 000',
  address: 'Dar es Salaam, Tanzania',
  occupation: 'Software Engineer',
};

const FREQUENCIES: BritamPaymentFrequency[] = ['annual', 'semi-annual', 'quarterly', 'monthly'];

const STEPS = [
  { n: 1, title: 'Plan' },
  { n: 2, title: 'Details' },
  { n: 3, title: 'Cover' },
  { n: 4, title: 'Review' },
];

function formatFreq(f: BritamPaymentFrequency): string {
  return PAYMENT_FREQUENCY_LABELS[f];
}

export default function BritamQuoteWizardScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { createBritamMobileQuote } = useMockApp();
  const [step, setStep] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<BritamMobileProduct | null>(null);
  const [paymentFrequency, setPaymentFrequency] = useState<BritamPaymentFrequency>('annual');
  const [familyMembers, setFamilyMembers] = useState<BritamFamilyMember[]>([]);
  const [addOnIds, setAddOnIds] = useState<string[]>([]);
  const [modalProduct, setModalProduct] = useState<BritamMobileProduct | null>(null);
  const [quoteId, setQuoteId] = useState<string | null>(null);

  const coverageDetails: BritamCoverageDetails = useMemo(() => {
    if (!selectedProduct) {
      return {
        productName: '',
        productVariant: '',
        familyMembers: [],
        addOns: [],
        paymentFrequency: 'annual',
      };
    }
    return {
      productName: selectedProduct.name,
      productVariant: selectedProduct.variant,
      familyMembers,
      addOns: addOnIds,
      paymentFrequency,
    };
  }, [selectedProduct, familyMembers, addOnIds, paymentFrequency]);

  const premiumPreview = useMemo(() => {
    if (!selectedProduct) return { premium: 0, sumInsured: 0 };
    return calculateBritamPremium(selectedProduct, coverageDetails);
  }, [selectedProduct, coverageDetails]);

  const footerPad = Math.max(insets.bottom, 12) + TAB_BAR;

  const toggleAddon = (id: string) => {
    void Haptics.selectionAsync();
    setAddOnIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const addMember = () => {
    void Haptics.selectionAsync();
    const newMember: BritamFamilyMember = {
      id: `mem-${Date.now()}`,
      name: '',
      relationship: 'spouse',
      dateOfBirth: '',
      gender: 'male',
    };
    setFamilyMembers((prev) => [...prev, newMember]);
  };

  const updateMember = (index: number, patch: Partial<BritamFamilyMember>) => {
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
    const q = createBritamMobileQuote({
      product: selectedProduct,
      coverageDetails,
      status: 'draft',
    });
    if (q) {
      setQuoteId(q.id);
      router.replace('/pamoja-bima/quotes');
    }
  };

  const continueToPayment = () => {
    if (!selectedProduct) return;
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const q = createBritamMobileQuote({
      product: selectedProduct,
      coverageDetails,
      status: 'pending',
    });
    if (q) {
      setQuoteId(q.id);
      router.push(`/pamoja-bima/britam/payment?quoteId=${q.id}`);
    }
  };

  const canNext = step !== 1 || selectedProduct != null;

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <AppHeroLayers />

      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
        <View style={styles.headerSection}>
          <View style={styles.headerText}>
            <Text style={styles.headerLabel}>Insurance</Text>
            <Text style={styles.screenTitle}>Britam quote</Text>
          </View>
        </View>

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

        <View style={styles.contentContainer}>
          <View style={styles.sheet}>
            {step === 1 && (
              <>
                <Text style={styles.h2}>Choose your plan</Text>
                <View style={styles.productsGrid}>
                  {BRITAM_MOBILE_PRODUCTS.map((p: BritamMobileProduct) => {
                    const sel = selectedProduct?.id === p.id;
                    return (
                      <Pressable
                        key={p.id}
                        onPress={() => {
                          void Haptics.selectionAsync();
                          setSelectedProduct(p);
                        }}
                        style={[styles.productCard, sel && styles.productCardSel]}
                      >
                        <View style={styles.productCardTop}>
                          <View style={styles.categoryBadge}>
                            <Text style={styles.categoryBadgeText}>{p.variant}</Text>
                          </View>
                          {sel ? (
                            <View style={styles.selectedBadge}>
                              <MaterialCommunityIcons name="check" size={16} color="#fff" />
                            </View>
                          ) : (
                            <View style={styles.unselectedBadge} />
                          )}
                        </View>
                        <Text style={styles.productName}>{p.name}</Text>
                        <Text style={styles.productPrice}>TZS {p.basePremium.toLocaleString()}</Text>
                        <Text style={styles.productPeriod}>/year</Text>
                        <View style={styles.cardButtonsRow}>
                          <Pressable
                            style={styles.detailsBtn}
                            onPress={() => {
                              void Haptics.selectionAsync();
                              setModalProduct(p);
                            }}
                          >
                            <Text style={styles.detailsBtnText}>View details</Text>
                          </Pressable>
                          {sel && (
                            <Pressable
                              style={styles.nextBtn}
                              onPress={goNext}
                            >
                              <Text style={styles.nextBtnText}>Next</Text>
                            </Pressable>
                          )}
                        </View>
                      </Pressable>
                    );
                  })}
                </View>
              </>
            )}

            {step === 2 && (
              <>
                <Text style={styles.h2}>Verify your details</Text>
                <Text style={styles.subShort}>We'll use these on your policy.</Text>
                <View style={styles.infoBox}>
                  <MaterialCommunityIcons name="information" size={16} color={pamoja.greenDeep} />
                  <Text style={styles.infoBoxText}>Your profile information is saved. You can update it in Settings if needed.</Text>
                </View>
                <Field label="Full name" value={DEMO_PROFILE.fullName} />
                <Field label="Date of birth" value={DEMO_PROFILE.dateOfBirth} />
                <Field label="Gender" value={DEMO_PROFILE.gender} />
                <Field label="National ID" value={DEMO_PROFILE.nationalId} />
                <Field label="Email" value={DEMO_PROFILE.email} />
                <Field label="Phone" value={DEMO_PROFILE.phone} />
                <Field label="Address" value={DEMO_PROFILE.address} />
                <Field label="Occupation" value={DEMO_PROFILE.occupation} />
                <View style={styles.cardButtonsRow}>
                  <Pressable style={styles.secondaryBtn} onPress={goBack}>
                    <Text style={styles.secondaryBtnText}>Back</Text>
                  </Pressable>
                  <Pressable style={styles.nextBtn} onPress={goNext}>
                    <Text style={styles.nextBtnText}>Next</Text>
                  </Pressable>
                </View>
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
                  <View key={m.id} style={styles.memberCard}>
                    <TextInput
                      style={styles.input}
                      placeholder="Name"
                      placeholderTextColor={palette.muted}
                      value={m.name}
                      onChangeText={(t) => updateMember(i, { name: t })}
                    />
                    <View style={styles.rowBetween}>
                      <Text style={styles.fieldLabel}>Relationship</Text>
                      <View style={styles.relationshipSelector}>
                        {(['spouse', 'child', 'parent', 'sibling', 'other'] as const).map((rel) => (
                          <Pressable
                            key={rel}
                            onPress={() => updateMember(i, { relationship: rel })}
                            style={[
                              styles.relationshipChip,
                              m.relationship === rel && styles.relationshipChipSel,
                            ]}
                          >
                            <Text
                              style={[
                                styles.relationshipChipText,
                                m.relationship === rel && styles.relationshipChipTextSel,
                              ]}
                            >
                              {rel.charAt(0).toUpperCase() + rel.slice(1)}
                            </Text>
                          </Pressable>
                        ))}
                      </View>
                    </View>
                    <TextInput
                      style={styles.input}
                      placeholder="Date of birth (YYYY-MM-DD)"
                      placeholderTextColor={palette.muted}
                      value={m.dateOfBirth}
                      onChangeText={(t) => updateMember(i, { dateOfBirth: t })}
                    />
                    <View style={styles.rowBetween}>
                      <Text style={styles.fieldLabel}>Gender</Text>
                      <View style={styles.genderSelector}>
                        {(['male', 'female', 'other'] as const).map((g) => (
                          <Pressable
                            key={g}
                            onPress={() => updateMember(i, { gender: g })}
                            style={[
                              styles.genderChip,
                              m.gender === g && styles.genderChipSel,
                            ]}
                          >
                            <Text
                              style={[
                                styles.genderChipText,
                                m.gender === g && styles.genderChipTextSel,
                              ]}
                            >
                              {g.charAt(0).toUpperCase() + g.slice(1)}
                            </Text>
                          </Pressable>
                        ))}
                      </View>
                    </View>
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
                <View style={styles.cardButtonsRow}>
                  <Pressable style={styles.secondaryBtn} onPress={goBack}>
                    <Text style={styles.secondaryBtnText}>Back</Text>
                  </Pressable>
                  <Pressable style={styles.nextBtn} onPress={goNext}>
                    <Text style={styles.nextBtnText}>Next</Text>
                  </Pressable>
                </View>
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
                <View style={styles.finalActions}>
                  <Pressable style={styles.secondaryBtn} onPress={saveDraft}>
                    <Text style={styles.secondaryBtnText}>Save draft</Text>
                  </Pressable>
                  <Pressable style={styles.primaryBtnWrap} onPress={continueToPayment}>
                    <LinearGradient colors={[...gradientPrimary]} style={styles.primaryBtn}>
                      <Text style={styles.primaryBtnText}>Pay now</Text>
                    </LinearGradient>
                  </Pressable>
                </View>
              </>
            )}
          </View>
        </View>
      </SafeAreaView>

      <Modal
        visible={modalProduct != null}
        transparent
        animationType="fade"
        onRequestClose={() => setModalProduct(null)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setModalProduct(null)}>
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            {modalProduct && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>{modalProduct.name}</Text>
                  <Pressable onPress={() => setModalProduct(null)} style={styles.modalClose}>
                    <MaterialCommunityIcons name="close" size={24} color={palette.ink} />
                  </Pressable>
                </View>
                <Text style={styles.modalVariant}>{modalProduct.variant}</Text>
                <Text style={styles.modalDesc}>{modalProduct.description}</Text>
                <View style={styles.modalDivider} />
                <Text style={styles.modalSectionTitle}>Features</Text>
                {modalProduct.features.map((f) => (
                  <View key={f} style={styles.modalFeatureRow}>
                    <MaterialCommunityIcons name="check" size={18} color={pamoja.greenDeep} />
                    <Text style={styles.modalFeatureText}>{f}</Text>
                  </View>
                ))}
                <View style={styles.modalDivider} />
                <View style={styles.modalPriceRow}>
                  <Text style={styles.modalPriceLabel}>Starting from</Text>
                  <Text style={styles.modalPrice}>TZS {modalProduct.basePremium.toLocaleString()}/year</Text>
                </View>
                <Pressable
                  style={styles.modalSelectBtn}
                  onPress={() => {
                    void Haptics.selectionAsync();
                    setSelectedProduct(modalProduct);
                    setModalProduct(null);
                  }}
                >
                  <Text style={styles.modalSelectBtnText}>Select this plan</Text>
                </Pressable>
              </>
            )}
          </Pressable>
        </Pressable>
      </Modal>
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
  headerSection: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 8,
  },
  headerLogo: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#fff',
    padding: 8,
    marginBottom: 8,
  },
  headerText: {
    alignItems: 'center',
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
  headerBtnDisabled: {
    opacity: 0.4,
  },
  logo: { width: 120, height: 36 },
  floatingNextBtn: {
    position: 'absolute',
    bottom: TAB_BAR + 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: pamoja.greenDeep,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: { elevation: 8 },
      default: {},
    }),
  },
  stepRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    marginTop: 8,
    marginBottom: 6,
  },
  stepItem: { flex: 1, alignItems: 'center' },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.35)',
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCircleOn: { borderColor: pamoja.accent, backgroundColor: 'rgba(249,115,22,0.25)' },
  stepCircleDone: { backgroundColor: pamoja.accent, borderColor: pamoja.accent },
  stepNum: { fontSize: 12, fontWeight: '700', color: 'rgba(255,255,255,0.7)' },
  stepNumOn: { color: '#fff' },
  stepLabel: { fontSize: 9, marginTop: 3, color: 'rgba(255,255,255,0.65)', fontWeight: '600' },
  stepLabelOn: { color: '#fff' },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sheet: {
    backgroundColor: pamoja.sheetBg,
    borderRadius: radius.lg,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.55)',
    gap: 6,
  },
  h2: { fontSize: 16, fontWeight: '800', color: palette.ink },
  subShort: { fontSize: 12, color: palette.muted, marginBottom: 6 },
  hintMuted: { fontSize: 11, color: palette.muted, fontStyle: 'italic', marginTop: 4 },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(4,120,87,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(4,120,87,0.2)',
    borderRadius: radius.sm,
    padding: 10,
    marginBottom: 12,
  },
  infoBoxText: {
    flex: 1,
    fontSize: 12,
    color: pamoja.greenDeep,
    fontWeight: '600',
  },
  productsGrid: {
    flexDirection: 'column',
    gap: 10,
  },
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    borderWidth: 2,
    borderColor: palette.border,
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
  productCardSel: {
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
  productCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryBadge: {
    backgroundColor: 'rgba(4,120,87,0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
  },
  categoryBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: pamoja.greenDeep,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  selectedBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: pamoja.greenDeep,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unselectedBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: palette.border,
  },
  productName: {
    fontSize: 18,
    fontWeight: '900',
    color: palette.ink,
    marginBottom: 2,
  },
  productPrice: {
    fontSize: 22,
    fontWeight: '900',
    color: pamoja.accent,
  },
  productPeriod: {
    fontSize: 12,
    fontWeight: '600',
    color: palette.muted,
    marginBottom: 10,
  },
  detailsBtn: {
    backgroundColor: 'rgba(4,120,87,0.08)',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(4,120,87,0.2)',
    flex: 1,
  },
  detailsBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: pamoja.greenDeep,
  },
  cardButtonsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  nextBtn: {
    backgroundColor: pamoja.greenDeep,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
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
  nextBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#fff',
  },
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
  productVariant: { fontSize: 13, fontWeight: '700', color: pamoja.greenDeep, marginTop: 2 },
  priceHint: { marginTop: 12, fontSize: 16, fontWeight: '800', color: pamoja.accent },
  moreDetailsBtn: {
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(4,120,87,0.08)',
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(4,120,87,0.2)',
  },
  moreDetailsText: {
    fontSize: 13,
    fontWeight: '700',
    color: pamoja.greenDeep,
  },
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
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: palette.border,
    marginBottom: 8,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: palette.ink,
    marginBottom: 8,
  },
  summaryLine: {
    fontSize: 13,
    color: palette.muted,
    marginBottom: 4,
  },
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
  relationshipSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  relationshipChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.surface,
  },
  relationshipChipSel: {
    borderColor: pamoja.greenDeep,
    backgroundColor: brand.primarySoft,
  },
  relationshipChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: palette.mutedStrong,
  },
  relationshipChipTextSel: {
    color: pamoja.greenDeep,
  },
  genderSelector: {
    flexDirection: 'row',
    gap: 6,
  },
  genderChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.surface,
  },
  genderChipSel: {
    borderColor: pamoja.greenDeep,
    backgroundColor: brand.primarySoft,
  },
  genderChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: palette.mutedStrong,
  },
  genderChipTextSel: {
    color: pamoja.greenDeep,
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
  summaryKey: { fontSize: 13, color: palette.muted },
  summaryVal: { fontSize: 13, fontWeight: '700', color: palette.ink, maxWidth: '58%', textAlign: 'right' },
  reviewNote: { fontSize: 12, color: palette.muted, marginTop: 8 },
  finalActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: palette.ink,
  },
  modalClose: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: palette.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalVariant: {
    fontSize: 14,
    fontWeight: '700',
    color: pamoja.greenDeep,
    marginBottom: 8,
  },
  modalDesc: {
    fontSize: 14,
    color: palette.muted,
    lineHeight: 20,
    marginBottom: 16,
  },
  modalDivider: {
    height: 1,
    backgroundColor: palette.border,
    marginVertical: 12,
  },
  modalSectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: palette.ink,
    marginBottom: 8,
  },
  modalFeatureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 6,
  },
  modalFeatureText: {
    flex: 1,
    fontSize: 13,
    color: palette.mutedStrong,
    lineHeight: 18,
  },
  modalPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalPriceLabel: {
    fontSize: 13,
    color: palette.muted,
  },
  modalPrice: {
    fontSize: 18,
    fontWeight: '800',
    color: pamoja.accent,
  },
  modalSelectBtn: {
    backgroundColor: pamoja.greenDeep,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalSelectBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },
});
