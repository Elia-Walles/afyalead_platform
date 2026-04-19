import { Screen, Surface } from '@/components/screen';
import { StyleSheet, Text } from 'react-native';

export default function InsuranceNotificationsScreen() {
  return (
    <Screen title="Notifications">
      <Surface>
        <Text style={styles.title}>Quote QT-846391 is waiting for payment.</Text>
        <Text style={styles.time}>5 mins ago</Text>
      </Surface>
      <Surface>
        <Text style={styles.title}>Policy issued successfully. Virtual card is ready.</Text>
        <Text style={styles.time}>32 mins ago</Text>
      </Surface>
      <Surface>
        <Text style={styles.title}>Claim CLM-554210 moved to processing stage.</Text>
        <Text style={styles.time}>Today</Text>
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
