import { AppHeroLayers } from '@/components/AppHeroLayers';
import { gradientPrimary, pamoja, palette, radius } from '@/constants/design-tokens';
import { useMockApp } from '@/context/mock-app-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useRef, useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View, Image } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { captureRef } from 'react-native-view-shot';

const TAB_BAR = 118;

export default function BritamVirtualCardScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ policyId: string }>();
  const { getBritamMobilePolicies } = useMockApp();
  
  const policies = getBritamMobilePolicies();
  const policy = policies.find((p) => p.id === params.policyId);
  const [customerPhoto, setCustomerPhoto] = useState<string | null>(null);
  const cardRef = useRef<View>(null);

  if (!policy) {
    return (
      <View style={styles.root}>
        <StatusBar style="light" />
        <AppHeroLayers />
        <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
          <View style={styles.errorContainer}>
            <MaterialCommunityIcons name="credit-card-off" size={64} color={palette.muted} />
            <Text style={styles.errorTitle}>Policy not found</Text>
            <Pressable style={styles.errorBtn} onPress={() => router.back()}>
              <Text style={styles.errorBtnText}>Go Back</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  const handlePickPhoto = async () => {
    void Haptics.selectionAsync();
    
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets[0]) {
      setCustomerPhoto(result.assets[0].uri);
    }
  };

  const handleTakePhoto = async () => {
    void Haptics.selectionAsync();
    
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets[0]) {
      setCustomerPhoto(result.assets[0].uri);
    }
  };

  const handleDownloadCard = async () => {
    if (!cardRef) return;
    
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    try {
      const uri = await captureRef(cardRef, {
        format: 'png',
        quality: 1,
      });
      
      // In a real app, you would use expo-file-system to save the file
      // For now, we'll just alert the user
      alert(`Card saved to: ${uri}\n\nIn production, this would save to your device's photo gallery.`);
    } catch (error) {
      console.error('Error capturing card:', error);
      alert('Failed to save card. Please try again.');
    }
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
            <Text style={styles.screenTitle}>Virtual Card</Text>
          </View>
        </View>

        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
          <View style={styles.contentContainer}>
            {/* Virtual Card */}
            <View ref={cardRef} collapsable={false} style={styles.cardContainer}>
              <LinearGradient
                colors={['#047857', '#059669', '#10B981']}
                style={styles.card}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.cardLogo}>
                    <Text style={styles.cardLogoText}>BRITAM</Text>
                  </View>
                  <Text style={styles.cardType}>HEALTH INSURANCE</Text>
                </View>

                <View style={styles.cardBody}>
                  <View style={styles.photoSection}>
                    {customerPhoto ? (
                      <Image source={{ uri: customerPhoto }} style={styles.photo} />
                    ) : (
                      <View style={styles.photoPlaceholder}>
                        <MaterialCommunityIcons name="account" size={48} color="rgba(255,255,255,0.5)" />
                      </View>
                    )}
                    <View style={styles.memberInfo}>
                      <Text style={styles.memberName}>Demo Customer</Text>
                      <Text style={styles.memberId}>ID: {policy.policyNumber}</Text>
                    </View>
                  </View>

                  <View style={styles.cardDivider} />

                  <View style={styles.policyInfo}>
                    <Text style={styles.policyLabel}>Policy Number</Text>
                    <Text style={styles.policyValue}>{policy.policyNumber}</Text>
                  </View>

                  <View style={styles.policyInfo}>
                    <Text style={styles.policyLabel}>Product</Text>
                    <Text style={styles.policyValue}>{policy.productName}</Text>
                  </View>

                  <View style={styles.policyInfo}>
                    <Text style={styles.policyLabel}>Valid Until</Text>
                    <Text style={styles.policyValue}>{new Date(policy.endDate).toLocaleDateString()}</Text>
                  </View>

                  <View style={styles.policyInfo}>
                    <Text style={styles.policyLabel}>Covered Members</Text>
                    <Text style={styles.policyValue}>{policy.familyMembers.length}</Text>
                  </View>
                </View>

                <View style={styles.cardFooter}>
                  <Text style={styles.cardFooterText}>Emergency: +255 800 123 456</Text>
                </View>
              </LinearGradient>
            </View>

            {/* Photo Actions */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Update Photo</Text>
              <Text style={styles.sectionSubtitle}>Add your photo to personalize your insurance card</Text>
              <View style={styles.photoActions}>
                <Pressable style={styles.photoActionBtn} onPress={handlePickPhoto}>
                  <MaterialCommunityIcons name="image" size={24} color={pamoja.greenDeep} />
                  <Text style={styles.photoActionText}>Choose from Gallery</Text>
                </Pressable>
                <Pressable style={styles.photoActionBtn} onPress={handleTakePhoto}>
                  <MaterialCommunityIcons name="camera" size={24} color={pamoja.greenDeep} />
                  <Text style={styles.photoActionText}>Take Photo</Text>
                </Pressable>
              </View>
            </View>

            {/* Download Action */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Save Card</Text>
              <Text style={styles.sectionSubtitle}>Download your virtual card as an image</Text>
              <Pressable style={styles.downloadBtn} onPress={handleDownloadCard}>
                <LinearGradient colors={gradientPrimary} style={styles.downloadBtnGradient}>
                  <MaterialCommunityIcons name="download" size={24} color="#fff" />
                  <Text style={styles.downloadBtnText}>Download as PNG</Text>
                </LinearGradient>
              </Pressable>
            </View>

            {/* Instructions */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Instructions</Text>
              <View style={styles.instructionCard}>
                <View style={styles.instructionItem}>
                  <MaterialCommunityIcons name="check-circle" size={20} color={pamoja.greenDeep} />
                  <Text style={styles.instructionText}>Use this card at any BRITAM network hospital</Text>
                </View>
                <View style={styles.instructionItem}>
                  <MaterialCommunityIcons name="check-circle" size={20} color={pamoja.greenDeep} />
                  <Text style={styles.instructionText}>Keep your photo updated for easy identification</Text>
                </View>
                <View style={styles.instructionItem}>
                  <MaterialCommunityIcons name="check-circle" size={20} color={pamoja.greenDeep} />
                  <Text style={styles.instructionText}>Download and save offline for emergencies</Text>
                </View>
                <View style={styles.instructionItem}>
                  <MaterialCommunityIcons name="check-circle" size={20} color={pamoja.greenDeep} />
                  <Text style={styles.instructionText}>Call emergency number for urgent assistance</Text>
                </View>
              </View>
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
  cardContainer: {
    marginBottom: 24,
  },
  card: {
    borderRadius: 20,
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
      },
      android: { elevation: 8 },
      default: {},
    }),
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardLogo: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  cardLogoText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 2,
  },
  cardType: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.8)',
    letterSpacing: 1,
  },
  cardBody: {
    marginBottom: 16,
  },
  photoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  photo: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  photoPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  memberInfo: {
    marginLeft: 12,
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 2,
  },
  memberId: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
  },
  cardDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginBottom: 16,
  },
  policyInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  policyLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
  },
  policyValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
  },
  cardFooter: {
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
  },
  cardFooterText: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: palette.ink,
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: palette.muted,
    marginBottom: 12,
  },
  photoActions: {
    flexDirection: 'row',
    gap: 12,
  },
  photoActionBtn: {
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
  photoActionText: {
    fontSize: 13,
    fontWeight: '700',
    color: pamoja.greenDeep,
  },
  downloadBtn: {
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
  downloadBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
  },
  downloadBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },
  instructionCard: {
    backgroundColor: '#fff',
    borderRadius: radius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: palette.border,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 12,
  },
  instructionText: {
    flex: 1,
    fontSize: 13,
    color: palette.ink,
    lineHeight: 18,
  },
});
