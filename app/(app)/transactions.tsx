import { Screen, Surface } from '@/components/screen';
import { palette, pamoja } from '@/constants/design-tokens';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text } from 'react-native';

export default function TransactionsScreen() {
  return (
    <Screen title="Transactions" subtitle="Activity across your accounts">
      <Surface>
        <MaterialCommunityIcons name="swap-horizontal" size={40} color={pamoja.greenDeep} />
        <Text style={styles.body}>Your recent transactions will show here.</Text>
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
