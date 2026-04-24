import { AppHeroLayers } from '@/components/AppHeroLayers';
import { gradientPrimary, pamoja, palette, radius } from '@/constants/design-tokens';
import { useMockApp } from '@/context/mock-app-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const TAB_BAR = 118;

export default function BritamPolicyDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ id: string }>();
  const { getBritamMobilePolicies } = useMockApp();
  
  const policies = getBritamMobilePolicies();
  const policy = policies.find((p) => p.id === params.id);

  if (!policy) {
    return (
      <View style={styles.root}>
        <StatusBar style="light" />
        <AppHeroLayers />
        <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
          <View style={styles.errorContainer}>
            <MaterialCommunityIcons name="file-document-remove" size={64} color={palette.muted} />
            <Text style={styles.errorTitle}>Policy not found</Text>
            <Pressable style={styles.errorBtn} onPress={() => router.back()}>
              <Text style={styles.errorBtnText}>Go Back</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  const handleDownloadPolicy = () => {
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    // TODO: Implement PDF download
    alert('Policy document download feature coming soon');
  };

  const handleDownloadCertificate = () => {
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    // TODO: Implement PDF download
    alert('Certificate download feature coming soon');
  };

  const handleViewVirtualCard = () => {
    void Haptics.selectionAsync();
    router.push(`/pamoja-bima/britam/virtual-card?policyId=${policy.id}`);
  };

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <AppHeroLayers />
      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
        <View style={styles.headerSection}>
          <Pressable style={styles.backBtn} onPress={() => router.back()}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
          </Pressable>
          <View style={styles.headerText}>
            <Text style={styles.headerLabel}>Insurance</Text>
            <Text style={styles.screenTitle}>Policy Details</Text>
          </View>
        </View>

        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
          <View style={styles.contentContainer}>
            {/* Policy Summary */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Policy Summary</Text>
              <View style={styles.summaryCard}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Product</Text>
                  <Text style={styles.summaryValue}>{policy.productName}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Policy Number</Text>
                  <Text style={styles.summaryValue}>{policy.policyNumber}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Status</Text>
                  <View style={[
                    styles.statusBadge,
                    policy.status === 'active' && styles.statusBadgeActive,
                  ]}>
                    <Text style={[
                      styles.statusText,
                      policy.status === 'active' && styles.statusTextActive,
                    ]}>
                      {policy.status.charAt(0).toUpperCase() + policy.status.slice(1)}
                    </Text>
                  </View>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Issue Date</Text>
                  <Text style={styles.summaryValue}>{new Date(policy.issueDate).toLocaleDateString()}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Cover Period</Text>
                  <Text style={styles.summaryValue}>
                    {new Date(policy.startDate).toLocaleDateString()} - {new Date(policy.endDate).toLocaleDateString()}
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Sum Insured</Text>
                  <Text style={styles.summaryValue}>TZS {policy.sumInsured.toLocaleString()}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Premium</Text>
                  <Text style={styles.summaryValue}>TZS {policy.premium.toLocaleString()}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Payment Frequency</Text>
                  <Text style={styles.summaryValue}>{policy.paymentFrequency}</Text>
                </View>
              </View>

              {/* Download Buttons */}
              <View style={styles.actionRow}>
                <Pressable style={styles.actionBtn} onPress={handleDownloadPolicy}>
                  <MaterialCommunityIcons name="download" size={20} color={pamoja.greenDeep} />
                  <Text style={styles.actionBtnText}>Policy Document</Text>
                </Pressable>
                <Pressable style={styles.actionBtn} onPress={handleDownloadCertificate}>
                  <MaterialCommunityIcons name="certificate" size={20} color={pamoja.greenDeep} />
                  <Text style={styles.actionBtnText}>Certificate</Text>
                </Pressable>
              </View>
            </View>

            {/* Covered Members */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Covered Members</Text>
                <Text style={styles.memberCount}>{policy.familyMembers.length} members</Text>
              </View>
              {policy.familyMembers.map((member) => (
                <View key={member.id} style={styles.memberCard}>
                  <View style={styles.memberInfo}>
                    <Text style={styles.memberName}>{member.name}</Text>
                    <Text style={styles.memberDetail}>{member.relationship}</Text>
                  </View>
                  <View style={[
                    styles.memberStatus,
                    member.status === 'active' && styles.memberStatusActive,
                  ]}>
                    <Text style={[
                      styles.memberStatusText,
                      member.status === 'active' && styles.memberStatusTextActive,
                    ]}>
                      {member.status}
                    </Text>
                  </View>
                </View>
              ))}
            </View>

            {/* Benefits */}
            {policy.benefits && policy.benefits.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Benefits Breakdown</Text>
                {policy.benefits.map((benefit, index) => (
                  <View key={index} style={styles.benefitCard}>
                    <View style={styles.benefitHeader}>
                      <Text style={styles.benefitName}>{benefit.name}</Text>
                      <Text style={styles.benefitLimit}>Limit: {benefit.limit}</Text>
                    </View>
                    <View style={styles.progressBar}>
                      <View style={styles.progressBg}>
                        <View 
                          style={[
                            styles.progressFill,
                            { width: `${(parseFloat(benefit.used) / parseFloat(benefit.limit.replace(/[^\d.]/g, ''))) * 100}%` }
                          ]}
                        />
                      </View>
                    </View>
                    <View style={styles.benefitFooter}>
                      <Text style={styles.benefitUsed}>Used: {benefit.used}</Text>
                      <Text style={styles.benefitRemaining}>Remaining: {benefit.remaining}</Text>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {/* Virtual Card */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Virtual Insurance Card</Text>
              <Pressable style={styles.virtualCardBtn} onPress={handleViewVirtualCard}>
                <MaterialCommunityIcons name="credit-card" size={32} color={pamoja.greenDeep} />
                <View style={styles.virtualCardText}>
                  <Text style={styles.virtualCardTitle}>View Virtual Card</Text>
                  <Text style={styles.virtualCardSubtitle}>Access your digital insurance card</Text>
                </View>
                <MaterialCommunityIcons name="chevron-right" size={24} color={palette.muted} />
              </Pressable>
            </View>
          </View>
        </ScrollView>
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
    borderRadius: 20,
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
  scroll: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
    marginTop: 16,
    marginBottom: 24,
  },
  errorBtn: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: radius.sm,
  },
  errorBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: palette.ink,
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  memberCount: {
    fontSize: 14,
    fontWeight: '700',
    color: palette.muted,
  },
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: palette.border,
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
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
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeActive: {
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  statusTextActive: {
    color: '#22c55e',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#fff',
    paddingVertical: 12,
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
  actionBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: pamoja.greenDeep,
  },
  memberCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: radius.sm,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: palette.border,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 14,
    fontWeight: '700',
    color: palette.ink,
    marginBottom: 2,
  },
  memberDetail: {
    fontSize: 12,
    color: palette.muted,
  },
  memberStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  memberStatusActive: {
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
  },
  memberStatusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  memberStatusTextActive: {
    color: '#22c55e',
  },
  benefitCard: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: radius.sm,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: palette.border,
  },
  benefitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  benefitName: {
    fontSize: 14,
    fontWeight: '700',
    color: palette.ink,
  },
  benefitLimit: {
    fontSize: 12,
    color: palette.muted,
  },
  progressBar: {
    marginBottom: 8,
  },
  progressBg: {
    height: 6,
    backgroundColor: palette.borderLight,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: pamoja.greenDeep,
    borderRadius: 3,
  },
  benefitFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  benefitUsed: {
    fontSize: 11,
    color: palette.muted,
  },
  benefitRemaining: {
    fontSize: 11,
    fontWeight: '700',
    color: palette.ink,
  },
  virtualCardBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: palette.border,
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
  virtualCardText: {
    flex: 1,
    marginLeft: 12,
  },
  virtualCardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: palette.ink,
    marginBottom: 2,
  },
  virtualCardSubtitle: {
    fontSize: 13,
    color: palette.muted,
  },
});
