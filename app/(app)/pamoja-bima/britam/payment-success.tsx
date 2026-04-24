import { AppHeroLayers } from '@/components/AppHeroLayers';
import { pamoja, palette, radius } from '@/constants/design-tokens';
import { useMockApp } from '@/context/mock-app-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const gradientPrimary = ['#047857', '#065f46'] as const;

export default function BritamPaymentSuccessScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ policyId: string }>();
  const { getBritamMobilePolicies } = useMockApp();

  const policies = getBritamMobilePolicies();
  const policy = policies.find((p) => p.id === params.policyId);

  const handleViewPolicy = () => {
    void Haptics.selectionAsync();
    router.push({ pathname: '/pamoja-bima/britam/policy/[id]', params: { id: policy?.id } });
  };

  const handleViewVirtualCard = () => {
    void Haptics.selectionAsync();
    router.push({ pathname: '/pamoja-bima/britam/virtual-card', params: { policyId: policy?.id } });
  };

  const handleGoHome = () => {
    void Haptics.selectionAsync();
    router.replace('/pamoja-bima');
  };

  if (!policy) {
    return (
      <View style={styles.root}>
        <StatusBar style="light" />
        <AppHeroLayers />
        <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
          <View style={styles.errorContainer}>
            <MaterialCommunityIcons name="alert-circle-outline" size={64} color={palette.muted} />
            <Text style={styles.errorTitle}>Policy not found</Text>
            <Pressable style={styles.errorBtn} onPress={handleGoHome}>
              <Text style={styles.errorBtnText}>Go to Home</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <AppHeroLayers />
      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
        <View style={styles.headerSection}>
          <Pressable style={styles.backBtn} onPress={handleGoHome}>
            <MaterialCommunityIcons name="close" size={24} color="#fff" />
          </Pressable>
          <View style={styles.headerText}>
            <Text style={styles.headerLabel}>Payment</Text>
            <Text style={styles.screenTitle}>Payment Successful</Text>
          </View>
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.sheet}>
            <View style={styles.successIconContainer}>
              <View style={styles.successIconBg}>
                <MaterialCommunityIcons name="check" size={48} color="#fff" />
              </View>
            </View>

            <Text style={styles.successTitle}>Payment Complete!</Text>
            <Text style={styles.successSubtitle}>
              Your policy has been activated successfully
            </Text>

            <View style={styles.policyCard}>
              <View style={styles.policyHeader}>
                <View style={styles.policyBadge}>
                  <Text style={styles.policyBadgeText}>{policy.productName}</Text>
                </View>
                <View style={[styles.statusBadge, styles.statusActive]}>
                  <Text style={styles.statusText}>Active</Text>
                </View>
              </View>

              <Text style={styles.policyNumber}>{policy.policyNumber}</Text>
              <Text style={styles.policyVariant}>{policy.productVariant} Plan</Text>

              <View style={styles.divider} />

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Sum Insured</Text>
                <Text style={styles.summaryValue}>
                  TZS {policy.sumInsured.toLocaleString()}
                </Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Premium Paid</Text>
                <Text style={styles.summaryValue}>
                  TZS {policy.premium.toLocaleString()}
                </Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Cover Period</Text>
                <Text style={styles.summaryValue}>
                  {formatDate(policy.startDate)} - {formatDate(policy.endDate)}
                </Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Members Covered</Text>
                <Text style={styles.summaryValue}>{policy.familyMembers.length}</Text>
              </View>
            </View>

            <View style={styles.actionsSection}>
              <Text style={styles.actionsTitle}>What's Next?</Text>

              <Pressable style={styles.actionCard} onPress={handleViewPolicy}>
                <View style={styles.actionIcon}>
                  <MaterialCommunityIcons name="file-document-outline" size={24} color={pamoja.greenDeep} />
                </View>
                <View style={styles.actionContent}>
                  <Text style={styles.actionTitle}>View Policy Details</Text>
                  <Text style={styles.actionSubtitle}>See full coverage and benefits</Text>
                </View>
                <MaterialCommunityIcons name="chevron-right" size={20} color={palette.muted} />
              </Pressable>

              <Pressable style={styles.actionCard} onPress={handleViewVirtualCard}>
                <View style={styles.actionIcon}>
                  <MaterialCommunityIcons name="card-account-details-outline" size={24} color={pamoja.greenDeep} />
                </View>
                <View style={styles.actionContent}>
                  <Text style={styles.actionTitle}>Get Virtual Card</Text>
                  <Text style={styles.actionSubtitle}>Download your digital insurance card</Text>
                </View>
                <MaterialCommunityIcons name="chevron-right" size={20} color={palette.muted} />
              </Pressable>
            </View>

            <LinearGradient
              colors={gradientPrimary}
              style={styles.homeBtn}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Pressable style={styles.homeBtnInner} onPress={handleGoHome}>
                <Text style={styles.homeBtnText}>Back to Home</Text>
              </Pressable>
            </LinearGradient>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: pamoja.greenDeep,
  },
  safe: {
    flex: 1,
  },
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
  successIconContainer: {
    alignItems: 'center',
    marginTop: 8,
  },
  successIconBg: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: pamoja.greenDeep,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
      },
      android: { elevation: 6 },
      default: {},
    }),
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: palette.ink,
    textAlign: 'center',
    marginTop: 16,
  },
  successSubtitle: {
    fontSize: 14,
    color: palette.muted,
    textAlign: 'center',
    marginTop: 4,
  },
  policyCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: palette.border,
  },
  policyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  policyBadge: {
    backgroundColor: 'rgba(4,120,87,0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
  },
  policyBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: pamoja.greenDeep,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
  },
  statusActive: {
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#22c55e',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  policyNumber: {
    fontSize: 18,
    fontWeight: '900',
    color: palette.ink,
    marginBottom: 2,
  },
  policyVariant: {
    fontSize: 13,
    color: palette.muted,
    marginBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: palette.border,
    marginVertical: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 13,
    color: palette.muted,
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: '700',
    color: palette.ink,
  },
  actionsSection: {
    gap: 8,
  },
  actionsTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: palette.ink,
    marginBottom: 4,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: palette.border,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
      },
      android: { elevation: 2 },
      default: {},
    }),
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(4,120,87,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: palette.ink,
  },
  actionSubtitle: {
    fontSize: 12,
    color: palette.muted,
    marginTop: 2,
  },
  homeBtn: {
    borderRadius: radius.sm,
    overflow: 'hidden',
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
  homeBtnInner: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  homeBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginTop: 16,
    marginBottom: 24,
  },
  errorBtn: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: radius.sm,
  },
  errorBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: pamoja.greenDeep,
  },
});
