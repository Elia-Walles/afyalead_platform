import { Screen, Surface } from '@/components/screen';
import { StyleSheet, Text, View } from 'react-native';

export default function InsuranceSettingsScreen() {
  return (
    <Screen title="Pamoja Bima settings">
      <Surface>
        <Text style={styles.heading}>Profile</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Name</Text>
          <Text style={styles.value}>Demo Customer</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Phone</Text>
          <Text style={styles.value}>+255 700 000 000</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>KYC Mode</Text>
          <Text style={styles.value}>Simulation</Text>
        </View>
      </Surface>

      <Surface>
        <Text style={styles.heading}>Preferences</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Push alerts</Text>
          <Text style={styles.value}>Enabled</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Email receipts</Text>
          <Text style={styles.value}>Enabled</Text>
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
