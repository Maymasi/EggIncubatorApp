// ==========================
//        IMPORTS
// ==========================
import React, { useState, useRef, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
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
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { LinearGradient } from 'expo-linear-gradient';
import Toast from 'react-native-toast-message';
import { COLORS, SIZES } from '../constants/theme';

// ==========================
//     DIMENSIONS SCREEN
// ==========================
const { width } = Dimensions.get('window');

// ==========================
//      Register COMPONENT
// ==========================
const Register = () => {
  // ==========================
  //   state form
  // ==========================
  const [form, setForm] = useState({
    email: '',
    passeword: '',
    name:'',
    farmName:''
  });
    // ==========================
  //   Navigation form
  // ==========================
  const navigation=useNavigation();
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
   // ==========================
  //   REGEX 
  // ==========================
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  const isPasswordValid = passwordRegex.test(form.passeword);
  const isEmailValid = emailRegex.test(form.email);

  const handleLogin = () => {
    if (!form.name || !form.email || !form.farmName || !form.passeword) {
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
    if (!isPasswordValid) {
      Toast.show({
        type: 'error',
        text1: 'Mot de passe faible',
        text2: 'Min. 8 caractères avec majuscules, chiffres et symboles.',
      });
      return;
    }


    const userExists = true;
    if (!userExists) {
        Toast.show({
          type: 'error',
          text1: `Échec de l'inscription`,
          text2: 'Cette adresse email est déjà utilisée.',
        });
      return;
    }

    Toast.show({
      type: 'success',
      text1: 'Compte créé',
      text2: `Bienvenue, ${form.name} ! 🐥`,
    });
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
          <Text style={styles.desc}>Créez votre compte</Text>
        </Animated.View>

        {/* ====== ZONE DU FORMULAIRE DE REGISTATION ====== */}
        <Animated.View style={[styles.form, { transform: [{ translateY: slideAnimForm }] }]}>
          <View style={styles.inputs}>
            {/* Champ name */}
            <View style={styles.areaInput}>
              <View style={styles.iconContainer}>
                <Feather name="user" size={24} color="white" />
              </View>
              <TextInput
                placeholder="Nom complet"
                placeholderTextColor={COLORS.bgWhite50}
                style={styles.input}
                value={form.name}
                onChangeText={(Text) => {
                  setForm({ ...form, name: Text });
                  console.log(form)
                }}
              />
            </View>
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
                onChangeText={(Text) => {
                  setForm({ ...form, email: Text });
                }}
              />
            </View>

            {/* Champ farm Name */}
            <View style={styles.areaInput}>
              <View style={styles.iconContainer}>
                <FontAwesome5 name="phoenix-framework" size={24} color="white" />
              </View>
              <TextInput
                placeholder="Nom de la ferme"
                secureTextEntry={true}
                placeholderTextColor={COLORS.bgWhite50}
                style={styles.input}
                value={form.farmName}
                onChangeText={(text) => {
                  setForm({ ...form, farmName: text });
                }}
                maxLength={20}
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
                value={form.passeword}
                onChangeText={(text) => {
                  setForm({ ...form, passeword: text });
                }}
                maxLength={20}
              />
            </View>
          </View>

          {/* Bouton register */}
          <TouchableHighlight
            underlayColor="lightgray"
            style={styles.ButtonConnect}
            onPress={handleLogin}
          >
            <Text style={styles.btnText}>Créer un compte</Text>
          </TouchableHighlight>

          <View style={styles.row}>
            <Text style={styles.registerText}>Déjà un compte ?</Text>
            <Text style={[styles.link, styles.registerText]}
              onPress={()=>{
                navigation.navigate('Login')
              }}
            >
              Se connecter
            </Text>
          </View>
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
    justifyContent: 'space-around',
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

export default Register;
// ============================
// ✨ Signature
// ============================
/**
 * ╔══════════════════════════════════╗
 * ║   Designed & Crafted with ❤️    ║
 * ║           by room67             ║
 * ╚══════════════════════════════════╝
 */