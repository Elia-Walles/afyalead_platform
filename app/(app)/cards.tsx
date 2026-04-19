import { Screen, Surface } from '@/components/screen';
import { palette, pamoja } from '@/constants/design-tokens';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text } from 'react-native';

export default function CardsScreen() {
  return (
    <Screen title="Cards" subtitle="Manage your AfyaLead cards">
      <Surface>
        <MaterialCommunityIcons name="credit-card-multiple" size={40} color={pamoja.greenDeep} />
        <Text style={styles.body}>Card features will appear here.</Text>
      </Surface>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: {
    marginTop: 8,
    fontSize: 15,
    color: palette.muted,
    fontWeight: '600',
    lineHeight: 22,
  },
});
