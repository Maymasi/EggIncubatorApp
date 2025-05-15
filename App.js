import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import ConnecteApropos from './screens/ConnecteApropos';
import ProfileScreen from './screens/ProfileScreen';
import EditProfileScreen from './screens/EditProfileScreen';
import FAQPage from './screens/FAQPage';
import NotificationsScreen from './screens/NotificationsScreen';

export default function App() {
  return (
    <View style={styles.container}>
      <ConnecteApropos />

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

