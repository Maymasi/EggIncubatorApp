import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Details from './screens/CouveusesDetails/Details';
import AccueilScreen from './screens/AccueilScreen';

export default function App() {
  return (
    <View style={styles.container}>
        {/* <Details/> */}
        <AccueilScreen/>
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
