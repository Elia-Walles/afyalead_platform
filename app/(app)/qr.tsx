import { Screen, Surface } from '@/components/screen';
import { pamoja } from '@/constants/design-tokens';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text } from 'react-native';

export default function QrHubScreen() {
  const router = useRouter();
  return (
    <Screen
      title="Scan"
      subtitle="QR payments & codes"
      headerAccessory={
        <Pressable
          onPress={() => {
            void Haptics.selectionAsync();
            router.back();
          }}
          style={styles.back}
          hitSlop={8}
        >
          <MaterialCommunityIcons name="arrow-left" size={22} color="rgba(255,255,255,0.95)" />
          <Text style={styles.backText}>Back</Text>
        </Pressable>
      }
    >
      <Surface style={styles.center}>
        <MaterialCommunityIcons name="qrcode-scan" size={64} color={pamoja.accent} />
        <Text style={styles.hint}>Camera-based scan coming soon.</Text>
      </Surface>
    </Screen>
  );
}

const styles = StyleSheet.create({
  back: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  backText: { fontSize: 16, fontWeight: '800', color: 'rgba(255,255,255,0.95)' },
  center: { alignItems: 'center', paddingVertical: 24 },
  hint: {
    marginTop: 16,
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
    color: '#475569',
  },
});
