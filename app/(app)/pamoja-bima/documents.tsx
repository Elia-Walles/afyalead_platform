import { Screen, Surface } from '@/components/screen';
import { useMockApp } from '@/context/mock-app-context';
import { StyleSheet, Text } from 'react-native';

export default function DocumentsScreen() {
  const { policies } = useMockApp();

  return (
    <Screen title="Documents">
      <Surface>
        <Text style={styles.heading}>Available Files</Text>
        <Text style={styles.meta}>Policy Schedule.pdf</Text>
        <Text style={styles.meta}>Membership Certificate.pdf</Text>
        <Text style={styles.meta}>Payment Receipt.pdf</Text>
      </Surface>
      <Surface>
        <Text style={styles.heading}>Linked Policies</Text>
        {policies.length === 0 ? (
          <Text style={styles.meta}>No policies linked yet.</Text>
        ) : (
          policies.map((policy) => (
            <Text key={policy.id} style={styles.meta}>
              {policy.policyNumber} - {policy.packageName}
            </Text>
          ))
        )}
      </Surface>
    </Screen>
  );
}

const styles = StyleSheet.create({
  heading: {
    color: '#0E2A1A',
    fontWeight: '700',
  },
  meta: {
    color: '#4B6C59',
  },
});
