import { Screen, Surface } from '@/components/screen';
import { palette, pamoja } from '@/constants/design-tokens';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text } from 'react-native';

export default function FavouritesScreen() {
  return (
    <Screen title="Favourites" subtitle="Shortcuts you use most">
      <Surface>
        <MaterialCommunityIcons name="star" size={40} color={pamoja.accent} />
        <Text style={styles.body}>Save favourites here for quicker access.</Text>
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
