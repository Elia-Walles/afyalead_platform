import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { palette } from '@/constants/design-tokens';

export default function QrHubScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  return (
    <View style={[styles.root, { paddingTop: insets.top + 12 }]}>
      <Pressable onPress={() => router.back()} style={styles.back}>
        <MaterialCommunityIcons name="arrow-left" size={24} color="#0f172a" />
        <Text style={styles.backText}>Back</Text>
      </Pressable>
      <MaterialCommunityIcons name="qrcode-scan" size={64} color="#f97316" style={{ marginTop: 24 }} />
      <Text style={styles.title}>Scan</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: palette.bg, paddingHorizontal: 20 },
  back: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  backText: { fontSize: 16, fontWeight: '700', color: '#0f172a' },
  title: { fontSize: 24, fontWeight: '800', color: '#0f172a', marginTop: 20, textAlign: 'center' },
});
