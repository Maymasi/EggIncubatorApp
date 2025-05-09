import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import WelcomePage from './screens/WelcomePage';
import { COLORS } from './constants/theme';

export default function App() {
  return (
    <View style={styles.container}>
      < StatusBar
      barStyle ="light-content"
      backgroundColor = {COLORS.accent}
      />
      <WelcomePage />
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
