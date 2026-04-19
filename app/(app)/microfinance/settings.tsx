import { Screen, Surface } from '@/components/screen';
import { StyleSheet, Text, View } from 'react-native';

export default function MicrofinanceSettingsScreen() {
  return (
    <Screen title="Microfinance settings">
      <Surface>
        <Text style={styles.heading}>Preferences</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Currency</Text>
          <Text style={styles.value}>TZS</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Alerts</Text>
          <Text style={styles.value}>Enabled</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Theme</Text>
          <Text style={styles.value}>Green Light Dim</Text>
        </View>
      </Surface>
    </Screen>
  );
}

const styles = StyleSheet.create({
  heading: {
    color: '#0E2A1A',
    fontWeight: '700',
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    color: '#4B6C59',
  },
  value: {
    color: '#0E2A1A',
    fontWeight: '600',
  },
});
