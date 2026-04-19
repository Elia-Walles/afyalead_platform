import { Screen, Surface } from '@/components/screen';
import { PAMOJA_PROVIDER_LOGOS } from '@/constants/pamoja-provider-logos';
import { useMockApp } from '@/context/mock-app-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, useLocalSearchParams } from 'expo-router';
import * as Sharing from 'expo-sharing';
import { useRef, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { captureRef } from 'react-native-view-shot';

export default function VirtualCardScreen() {
  const { policyId, providerId: providerIdParam } = useLocalSearchParams<{
    policyId: string;
    providerId?: string;
  }>();
  const { policies, providers } = useMockApp();
  const policy = policies.find((item) => item.id === policyId);
  const providerName = providers.find((p) => p.id === policy?.providerId)?.name ?? 'Provider';
  const isBritam = (providerIdParam ?? policy?.providerId) === 'britam';

  const cardCaptureRef = useRef<View>(null);
  const [sharing, setSharing] = useState(false);

  const shareOrSaveCard = async () => {
    if (!cardCaptureRef.current || !isBritam) return;
    try {
      setSharing(true);
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      const uri = await captureRef(cardCaptureRef, {
        format: 'png',
        quality: 0.95,
      });
      const available = await Sharing.isAvailableAsync();
      if (!available) {
        Alert.alert('Sharing unavailable', 'Sharing is not available on this device.');
        return;
      }
      await Sharing.shareAsync(uri, {
        mimeType: 'image/png',
        dialogTitle: 'Save or share your virtual card',
      });
    } catch {
      Alert.alert('Could not capture card', 'Please try again.');
    } finally {
      setSharing(false);
    }
  };

  if (!policy) {
    return (
      <Screen title="Virtual Card Unavailable">
        <Text style={styles.meta}>Generate a policy first from the quote flow.</Text>
      </Screen>
    );
  }

  if (isBritam) {
    return (
      <Screen title="Virtual card">
        <View ref={cardCaptureRef} style={styles.captureWrap} collapsable={false}>
          <LinearGradient
            colors={['#0c4a6e', '#0369a1', '#0284c7']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.britamCard}
          >
            <View style={styles.britamCardTop}>
              <Image source={PAMOJA_PROVIDER_LOGOS.britam} style={styles.britamLogo} contentFit="contain" />
              <Text style={styles.britamCoBrand}>Pamoja Bima</Text>
            </View>
            <Text style={styles.britamLabel}>Member</Text>
            <Text style={styles.britamName}>{policy.memberName}</Text>
            <View style={styles.britamRow}>
              <View>
                <Text style={styles.britamSmall}>Policy</Text>
                <Text style={styles.britamValue}>{policy.policyNumber}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.britamSmall}>Card</Text>
                <Text style={styles.britamValue}>{policy.virtualCardNumber}</Text>
              </View>
            </View>
            <View style={styles.britamChip}>
              <MaterialCommunityIcons name="shield-check" size={16} color="#e0f2fe" />
              <Text style={styles.britamChipText}>
                {policy.kycCompleted ? 'Active · KYC verified' : 'Pending KYC'}
              </Text>
            </View>
          </LinearGradient>
        </View>

        <Pressable
          style={[styles.shareBtn, sharing && styles.shareBtnDisabled]}
          onPress={shareOrSaveCard}
          disabled={sharing}
        >
          {sharing ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <MaterialCommunityIcons name="share-variant" size={20} color="#fff" />
              <Text style={styles.shareBtnText}>Save / share card</Text>
            </>
          )}
        </Pressable>

        <Surface style={styles.infoSurface}>
          <Text style={styles.meta}>Present this card at network facilities. KYC: {policy.kycCompleted ? 'Completed' : 'Pending'}</Text>
          <Link href="/pamoja-bima/policies" style={styles.link}>
            Go to Policies
          </Link>
          <Link href="/pamoja-bima/documents" style={styles.link}>
            Open Documents
          </Link>
        </Surface>
      </Screen>
    );
  }

  return (
    <Screen title="Virtual card">
      <View style={styles.card}>
        <Text style={styles.cardBrand}>Pamoja Bima</Text>
        <Text style={styles.cardProvider}>{providerName}</Text>
        <Text style={styles.cardLine}>Member: {policy.memberName}</Text>
        <Text style={styles.cardLine}>Policy: {policy.policyNumber}</Text>
        <Text style={styles.cardLine}>Card No: {policy.virtualCardNumber}</Text>
      </View>

      <Surface>
        <Text style={styles.meta}>KYC status: {policy.kycCompleted ? 'Completed' : 'Pending'}</Text>
        <Link href="/pamoja-bima/policies" style={styles.link}>
          Go to Policies
        </Link>
        <Link href="/pamoja-bima/documents" style={styles.link}>
          Open Documents
        </Link>
      </Surface>
    </Screen>
  );
}

const styles = StyleSheet.create({
  captureWrap: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  britamCard: {
    borderRadius: 20,
    padding: 20,
    minHeight: 220,
  },
  britamCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  britamLogo: {
    width: 120,
    height: 36,
  },
  britamCoBrand: {
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '700',
    fontSize: 13,
    letterSpacing: 0.5,
  },
  britamLabel: {
    color: 'rgba(224,242,254,0.9)',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  britamName: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '900',
    marginTop: 4,
  },
  britamRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  britamSmall: {
    color: 'rgba(224,242,254,0.85)',
    fontSize: 11,
    fontWeight: '600',
  },
  britamValue: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '800',
    marginTop: 2,
  },
  britamChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 20,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  britamChipText: {
    color: '#e0f2fe',
    fontSize: 12,
    fontWeight: '700',
  },
  shareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#0284c7',
    borderRadius: 14,
    paddingVertical: 14,
    marginTop: 4,
  },
  shareBtnDisabled: {
    opacity: 0.7,
  },
  shareBtnText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 16,
  },
  infoSurface: {
    borderColor: '#bae6fd',
    backgroundColor: '#f8fafc',
  },
  card: {
    backgroundColor: '#1B8D4A',
    borderRadius: 16,
    padding: 18,
    gap: 6,
  },
  cardBrand: {
    color: '#DDF7E8',
    fontWeight: '600',
  },
  cardProvider: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
  },
  cardLine: {
    color: '#EAFBF1',
  },
  meta: {
    color: '#4B6C59',
  },
  link: {
    color: '#1B8D4A',
    fontWeight: '700',
    marginTop: 4,
  },
});
