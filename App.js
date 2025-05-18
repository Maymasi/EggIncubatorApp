import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import WelcomePage from './screens/WelcomePage';
import { COLORS } from './constants/theme';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import LoginScreen from './screens/LoginScreen';
import Register from './screens/Register';
import AccueilScreen from './screens/AccueilScreen';
import { AuthProvider } from './contexts/AuthContext';
import Details from './screens/CouveusesDetails/Details';
import ConnecteApropos from './screens/ConnecteApropos';
import ProfileScreen from './screens/ProfileScreen';
import EditProfileScreen from './screens/EditProfileScreen';
import FAQPage from './screens/FAQPage';
import NotificationsScreen from './screens/NotificationsScreen';

export default function App() {
  const Stack = createNativeStackNavigator();

  return (
    <>
      <AuthProvider>
        <StatusBar
          barStyle="light-content"
          backgroundColor={COLORS.accent}
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
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen name="Home" component={AccueilScreen} />
            <Stack.Screen name="Details" component={Details} />
            <Stack.Screen name="ConnecteApropos" component={ConnecteApropos} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} />
            <Stack.Screen name="FAQ" component={FAQPage} />
            <Stack.Screen name="Notifications" component={NotificationsScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </AuthProvider>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
});
