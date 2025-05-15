// ==========================
//        IMPORTS
// ==========================
import React, { useState, useRef, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { loginUser } from '../services/auth';
import { ref, get } from 'firebase/database';
import { database } from '../config/firebase';

import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Image,
  SafeAreaView,
  Dimensions,
  TouchableHighlight,
  Animated
} from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import Entypo from '@expo/vector-icons/Entypo';
import { LinearGradient } from 'expo-linear-gradient';
import Toast from 'react-native-toast-message';
import { COLORS, SIZES } from '../constants/theme';

// ==========================
//     DIMENSIONS SCREEN
// ==========================
const { width } = Dimensions.get('window');

// ==========================
//      LOGIN COMPONENT
// ==========================
const LoginScreen = () => {
  const [form, setForm] = useState({
    email: '',
    password: ''
  });
  const navigation=useNavigation();
      // ==========================
  //   INPUT CHANGES HANDLER
  // ==========================
    const handleChange = (field, text) => {
    setForm(prevForm => {
      const newForm = { ...prevForm, [field]: text };
      console.log("Nouvel état:", newForm); 
      return newForm;
    });
  };
  // ==========================
  //   ANIMATED VALUES
  // ==========================
  const fadeAnimHeader = useRef(new Animated.Value(0)).current;
  const slideAnimForm = useRef(new Animated.Value(50)).current;
  const slideAnimGoogle = useRef(new Animated.Value(100)).current;

  useEffect(() => {
    Animated.timing(fadeAnimHeader, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true
    }).start();

    Animated.timing(slideAnimForm, {
      toValue: 0,
      duration: 800,
      delay: 400,
      useNativeDriver: true
    }).start();

    Animated.timing(slideAnimGoogle, {
      toValue: 0,
      duration: 800,
      delay: 700,
      useNativeDriver: true
    }).start();
  }, []);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isEmailValid = emailRegex.test(form.email);

const handleLogin = async () => {
  // Validation des champs
  if (!form.email || !form.password) {
    Toast.show({
      type: 'error',
      text1: 'Champs requis',
      text2: 'Veuillez remplir tous les champs pour continuer.',
    });
    return;
  }

  if (!isEmailValid) {
    Toast.show({
      type: 'error',
      text1: 'Email invalide 📫',
      text2: 'Veuillez entrer une adresse email valide (ex: exemple@mail.com).',
    });
    return;
  }

  try {
    // 1. Authentification via votre service
    const user = await loginUser(form.email, form.password);
    
    // 2. Récupération des données utilisateur
    const userRef = ref(database, `users/${user.uid}`);
    const snapshot = await get(userRef);
    const userData = snapshot.val();

    // 3. Feedback de succès
    Toast.show({
      type: 'success',
      text1: 'Connexion réussie',
      text2: `Bienvenue, ${userData?.fullName || user.email} ! 🐣`,
      visibilityTime: 2000,
      onHide: () => {
        // 4. Redirection après le Toast

      }
    });

  } catch (error) {
    // Gestion fine des erreurs Firebase
    let errorMessage = "Échec de la connexion";
    
    switch(error.code) {
      case 'auth/user-not-found':
        errorMessage = "Aucun compte associé à cet email";
        break;
      case 'auth/wrong-password':
        errorMessage = "Mot de passe incorrect";
        break;
      case 'auth/too-many-requests':
        errorMessage = "Trop de tentatives. Réessayez plus tard";
        break;
      default:
        console.error("Erreur technique:", error);
    }

    Toast.show({
      type: 'error',
      text1: 'Connexion échouée',
      text2: errorMessage,
    });
  }
};

  return (
    <LinearGradient
      colors={COLORS.bgGradientPrimary.colors}
      start={COLORS.bgGradientPrimary.start}
      end={COLORS.bgGradientPrimary.end}
      style={styles.container}
    >
      <SafeAreaView style={styles.container}>
        {/* ====== LOGO ET DESCRIPTION ====== */}
        <Animated.View style={[styles.header, { opacity: fadeAnimHeader }]}>
          <Image
            source={require('../assets/images/logo.png')}
            style={styles.image}
          />
          <Text style={styles.desc}>Connectez-vous à votre compte</Text>
        </Animated.View>

        {/* ====== ZONE DU FORMULAIRE DE CONNEXION ====== */}
        <Animated.View style={[styles.form, { transform: [{ translateY: slideAnimForm }] }]}>
          <View style={styles.inputs}>
            {/* Champ Email */}
            <View style={styles.areaInput}>
              <View style={styles.iconContainer}>
                <Feather name="mail" size={24} color="white" />
              </View>
              <TextInput
                placeholder="Enter your email"
                placeholderTextColor={COLORS.bgWhite50}
                style={styles.input}
                value={form.email}
                onChangeText={(text)=>handleChange('email',text)}
              />
            </View>

            {/* Champ Mot de passe */}
            <View style={styles.areaInput}>
              <View style={styles.iconContainer}>
                <Entypo name="lock" size={24} color="white" />
              </View>
              <TextInput
                placeholder="Enter your password"
                secureTextEntry={true}
                placeholderTextColor={COLORS.bgWhite50}
                style={styles.input}
                value={form.password}
                 onChangeText={(text)=>handleChange('password',text)}

                maxLength={20}
              />
            </View>
          </View>

          {/* Bouton Se connecter */}
          <TouchableHighlight
            underlayColor="lightgray"
            style={styles.ButtonConnect}
            onPress={handleLogin}
          >
            <Text style={styles.btnText}>Se connecter</Text>
          </TouchableHighlight>

          <View style={styles.row}>
            <Text style={styles.registerText}>Pas encore de compte ?</Text>
            <Text style={[styles.link, styles.registerText]}
              onPress={()=>{
                navigation.navigate('Register')
              }}
            >
              S'inscrire
            </Text>
          </View>
        </Animated.View>

        {/* ====== ALTERNATIVE AVEC GOOGLE ====== */}
        <Animated.View style={{ transform: [{ translateY: slideAnimGoogle }], alignItems: 'center', gap: 25 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View style={{ flex: 1, height: 1, backgroundColor: COLORS.bgWhite80 }} />
            <Text style={{ color: COLORS.white, fontSize: SIZES.medium }}>
              Ou continuez avec
            </Text>
            <View style={{ flex: 1, height: 1, backgroundColor: COLORS.bgWhite80 }} />
          </View>

          <TouchableHighlight
            underlayColor="lightgray"
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: COLORS.bgWhite20,
              paddingVertical: 12,
              paddingHorizontal: 24,
              borderRadius: 14,
              width: width - SIZES.xLarge - 10,
              justifyContent: 'center',
              gap: 12,
            }}
          >
            <View style={styles.googleBtn}>
              <Image
                source={require('../assets/images/google.png')}
                style={{ width: 24, height: 24 }}
              />
              <Text style={{ color: COLORS.white, fontSize: SIZES.medium }}>
                Continuer avec Google
              </Text>
            </View>
          </TouchableHighlight>
        </Animated.View>

        {/* Toast visible ici */}
        <Toast />
      </SafeAreaView>
    </LinearGradient>
  );
};

// ==========================
//         STYLES
// ==========================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SIZES.xLarge,
    justifyContent: 'space-evenly',
    alignItems: 'center'
  },
  header: {
    alignItems: 'center',
    gap: 12
  },
  image: {
    width: 130,
    height: 130
  },
  desc: {
    color: COLORS.bgWhite80,
    textAlign: 'center',
    fontWeight: '400',
    fontSize: SIZES.medium + 2
  },
  form: {
    gap: 30
  },
  inputs: {
    gap: 20
  },
  areaInput: {
    flexDirection: 'row',
    width: width - SIZES.xLarge - 10,
    backgroundColor: COLORS.bgWhite10,
    borderRadius: 14,
    height: 55
  },
  iconContainer: {
    padding: 2,
    width: '15%',
    borderRadius: 14,
    borderBottomRightRadius: 0,
    borderTopRightRadius: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.bgWhite20
  },
  input: {
    padding: 14,
    fontWeight: '500',
    color: COLORS.white,
    width: '85%'
  },
  ButtonConnect: {
    width: width - SIZES.xLarge - 10,
    backgroundColor: COLORS.backgroundLight,
    height: 58,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20
  },
  btnText: {
    color: COLORS.greenPrimary,
    fontSize: SIZES.medium + 4,
    fontWeight: '600'
  },
  row: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
  },
  registerText: {
    color: COLORS.white,
    fontSize: SIZES.medium,
  },
  link: {
    fontWeight: '700',
  },
  googleBtn: {
    flexDirection: 'row',
    gap: 10
  },
});

export default LoginScreen;
