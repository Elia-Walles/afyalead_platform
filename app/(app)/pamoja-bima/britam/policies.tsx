import { AppHeroLayers } from '@/components/AppHeroLayers';
import { gradientPrimary, pamoja, palette, radius } from '@/constants/design-tokens';
import { useMockApp } from '@/context/mock-app-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const TAB_BAR = 118;

type FilterType = 'all' | 'active' | 'expired';

const FILTERS: { id: FilterType; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'active', label: 'Active' },
  { id: 'expired', label: 'Expired' },
];

export default function BritamPoliciesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { getBritamMobilePolicies } = useMockApp();
  const [filter, setFilter] = useState<FilterType>('all');

  const policies = getBritamMobilePolicies();
  
  const filteredPolicies = policies.filter((p) => {
    if (filter === 'all') return true;
    if (filter === 'active') return p.status === 'active';
    if (filter === 'expired') return p.status === 'expired';
    return true;
  });

  const handlePolicyPress = (policyId: string) => {
    void Haptics.selectionAsync();
    router.push({ pathname: '/pamoja-bima/britam/policy/[id]', params: { id: policyId } });
  };

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <AppHeroLayers />
      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
        <View style={styles.headerSection}>
          <View style={styles.headerText}>
            <Text style={styles.headerLabel}>Insurance</Text>
            <Text style={styles.screenTitle}>My Policies</Text>
          </View>
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.filterRow}>
            {FILTERS.map((f) => (
              <Pressable
                key={f.id}
                onPress={() => {
                  void Haptics.selectionAsync();
                  setFilter(f.id);
                }}
                style={[styles.filterChip, filter === f.id && styles.filterChipSel]}
              >
                <Text style={[styles.filterChipText, filter === f.id && styles.filterChipTextSel]}>
                  {f.label}
                </Text>
              </Pressable>
            ))}
          </View>

          <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
            {filteredPolicies.length === 0 ? (
              <View style={styles.emptyState}>
                <MaterialCommunityIcons name="file-document-outline" size={64} color={palette.muted} />
                <Text style={styles.emptyTitle}>No policies found</Text>
                <Text style={styles.emptyText}>
                  {filter === 'all' 
                    ? 'You don\'t have any BRITAM policies yet.' 
                    : `No ${filter} policies found.`}
                </Text>
                <Pressable style={styles.emptyBtn} onPress={() => router.push('/pamoja-bima/britam/quote')}>
                  <LinearGradient colors={gradientPrimary} style={styles.emptyBtnGradient}>
                    <Text style={styles.emptyBtnText}>Get a Quote</Text>
                  </LinearGradient>
                </Pressable>
              </View>
            ) : (
              filteredPolicies.map((policy) => (
                <Pressable
                  key={policy.id}
                  onPress={() => handlePolicyPress(policy.id)}
                  style={styles.policyCard}
                >
                  <View style={styles.policyHeader}>
                    <View>
                      <Text style={styles.policyProduct}>{policy.productName}</Text>
                      <Text style={styles.policyNumber}>{policy.policyNumber}</Text>
                    </View>
                    <View style={[
                      styles.statusBadge,
                      policy.status === 'active' && styles.statusBadgeActive,
                      policy.status === 'expired' && styles.statusBadgeExpired,
                    ]}>
                      <Text style={[
                        styles.statusText,
                        policy.status === 'active' && styles.statusTextActive,
                        policy.status === 'expired' && styles.statusTextExpired,
                      ]}>
                        {policy.status.charAt(0).toUpperCase() + policy.status.slice(1)}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.divider} />
                  
                  <View style={styles.policyRow}>
                    <Text style={styles.policyLabel}>Cover period</Text>
                    <Text style={styles.policyValue}>
                      {new Date(policy.startDate).toLocaleDateString()} - {new Date(policy.endDate).toLocaleDateString()}
                    </Text>
                  </View>
                  
                  <View style={styles.policyRow}>
                    <Text style={styles.policyLabel}>Sum insured</Text>
                    <Text style={styles.policyValue}>TZS {policy.sumInsured.toLocaleString()}</Text>
                  </View>
                  
                  <View style={styles.policyRow}>
                    <Text style={styles.policyLabel}>Premium</Text>
                    <Text style={styles.policyValue}>TZS {policy.premium.toLocaleString()}</Text>
                  </View>
                  
                  <View style={styles.policyRow}>
                    <Text style={styles.policyLabel}>Covered members</Text>
                    <Text style={styles.policyValue}>{policy.familyMembers.length}</Text>
                  </View>
                  
                  <View style={styles.cardFooter}>
                    <MaterialCommunityIcons name="chevron-right" size={20} color={palette.muted} />
                  </View>
                </Pressable>
              ))
            )}
          </ScrollView>
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
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  filterChipSel: {
    backgroundColor: '#fff',
    borderColor: '#fff',
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.8)',
  },
  filterChipTextSel: {
    color: pamoja.greenDeep,
  },
  scroll: {
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyBtn: {
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
  emptyBtnGradient: {
    paddingVertical: 14,
    paddingHorizontal: 32,
  },
  emptyBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },
  policyCard: {
    backgroundColor: pamoja.sheetBg,
    borderRadius: radius.lg,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.55)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: { elevation: 3 },
      default: {},
    }),
  },
  policyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  policyProduct: {
    fontSize: 16,
    fontWeight: '800',
    color: palette.ink,
    marginBottom: 4,
  },
  policyNumber: {
    fontSize: 13,
    color: palette.muted,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeActive: {
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
  },
  statusBadgeExpired: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  statusTextActive: {
    color: '#22c55e',
  },
  statusTextExpired: {
    color: '#ef4444',
  },
  divider: {
    height: 1,
    backgroundColor: palette.border,
    marginVertical: 12,
  },
  policyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  policyLabel: {
    fontSize: 13,
    color: palette.muted,
  },
  policyValue: {
    fontSize: 13,
    fontWeight: '700',
    color: palette.ink,
  },
  cardFooter: {
    alignItems: 'flex-end',
    marginTop: 8,
  },
});
