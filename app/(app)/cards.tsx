import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { palette } from '@/constants/design-tokens';

export default function CardsScreen() {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.root, { paddingTop: insets.top + 16 }]}>
      <MaterialCommunityIcons name="credit-card-multiple" size={48} color="#047857" />
      <Text style={styles.title}>Cards</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: palette.bg, paddingHorizontal: 24, alignItems: 'center' },
  title: { fontSize: 22, fontWeight: '800', color: '#0f172a', marginTop: 16 },
});
