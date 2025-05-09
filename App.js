import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import WelcomePage from './screens/WelcomePage';
import { COLORS } from './constants/theme';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from './screens/LoginScreen';

export default function App() {
  const Stack = createNativeStackNavigator();

  return (
    <>
      < StatusBar
      barStyle ="light-content"
      backgroundColor = {COLORS.accent}
      />
      <NavigationContainer style={styles.container}>
        <Stack.Navigator
          initialRouteName="Welcome"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Welcome" component={WelcomePage} />
        </Stack.Navigator>
      </NavigationContainer>
      </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1
  },
});
