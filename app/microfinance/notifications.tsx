import { Screen, Surface } from '@/components/screen';
import { StyleSheet, Text } from 'react-native';

export default function MicrofinanceNotificationsScreen() {
  return (
    <Screen title="Notifications">
      <Surface>
        <Text style={styles.title}>Loan LN-1001 moved to officer verification.</Text>
        <Text style={styles.time}>12 mins ago</Text>
      </Surface>
      <Surface>
        <Text style={styles.title}>Repayment reminder: LN-1003 due in 6 days.</Text>
        <Text style={styles.time}>1 hour ago</Text>
      </Surface>
      <Surface>
        <Text style={styles.title}>Group registration approved for Mwangaza SACCO.</Text>
        <Text style={styles.time}>Yesterday</Text>
      </Surface>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    color: '#0E2A1A',
    fontWeight: '600',
  },
  time: {
    color: '#4B6C59',
    fontSize: 12,
  },
});
