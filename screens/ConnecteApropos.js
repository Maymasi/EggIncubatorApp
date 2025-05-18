import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { COLORS, SIZES, FONTS } from '../constants/theme';
import Logo from '../assets/images/logo.png';
import emailjsConfig from '../config/emailjsConfig';

const ConnecteApropos = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSending, setIsSending] = useState(false);
  const [errors, setErrors] = useState({});
  const fadeAnim = useState(new Animated.Value(0))[0];
  
  // Animation au chargement du composant
  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    
    if (!form.name.trim()) newErrors.name = 'Le nom est requis';
    
    if (!form.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Format d\'email invalide';
    }
    
    if (!form.message.trim()) newErrors.message = 'Le message est requis';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSend = async () => {
    if (!validateForm()) return;
    
    setIsSending(true);

    const templateParams = {
      from_name: form.name,
      from_email: form.email,
      message: form.message,
    };

    try {
      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          service_id: emailjsConfig.service_id,
          template_id: emailjsConfig.template_id,
          user_id: emailjsConfig.user_id,
          template_params: templateParams,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Erreur EmailJS:', errorText);

        let messageErreur = "Échec de l'envoi du message.";

        if (errorText.includes('User ID')) {
          messageErreur = "Clé publique invalide ou absente.";
        } else if (errorText.includes('service_id')) {
          messageErreur = "ID du service incorrect ou inexistant.";
        } else if (errorText.includes('template_id')) {
          messageErreur = "ID du template incorrect.";
        } else if (errorText.includes('template_params')) {
          messageErreur = "Données du message mal formatées.";
        } else if (errorText.includes('origin')) {
          messageErreur = "Erreur de sécurité liée au domaine d'origine.";
        }

        Alert.alert('Erreur', messageErreur);
      } else {
        Alert.alert('Succès', 'Message envoyé avec succès !');
        setForm({ name: '', email: '', message: '' });
      }
    } catch (error) {
      console.error('Erreur réseau ou système :', error);
      Alert.alert('Erreur', "Erreur réseau : impossible d'envoyer le message.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: COLORS.greenPrimary }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      <ScrollView 
        contentContainerStyle={styles.container} 
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.heroSection, { opacity: fadeAnim }]}>
          <Image source={Logo} style={styles.logoImage} />
          <Text style={styles.heroTitle}>F9asti</Text>
          <Text style={styles.heroSubtitle}>Solutions d'incubation intelligentes</Text>
        </Animated.View>

        <Animated.View 
          style={[styles.card, { opacity: fadeAnim, transform: [{ translateY: fadeAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [50, 0]
          })}] }]}
        >
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLine} />
            <Text style={styles.cardHeaderText}>À PROPOS DE NOUS</Text>
            <View style={styles.cardHeaderLine} />
          </View>
          
          <Text style={styles.paragraph1}>
            <Text style={styles.bold}>F9asti</Text> est une entreprise innovante spécialisée dans le développement de couveuses intelligentes, conçues pour garantir une incubation optimale des œufs. Nos solutions intégrées reposent sur des capteurs de pointe et des systèmes automatisés, permettant un contrôle en temps réel des paramètres cruciaux.
          </Text>

          <View style={styles.featureSection}>
            <View style={styles.feature}>
              <View style={styles.featureIconBox}>
                <Text style={styles.featureIcon}>🔬</Text>
              </View>
              <Text style={styles.featureTitle}>Notre Innovation</Text>
              <Text style={styles.featureDesc}>
                Technologie avancée alliant électronique et programmation pour une régulation automatique des conditions d'incubation, optimisant ainsi le taux d'éclosion.
              </Text>
            </View>

            <View style={styles.feature}>
              <View style={styles.featureIconBox}>
                <Text style={styles.featureIcon}>🤝</Text>
              </View>
              <Text style={styles.featureTitle}>Notre Engagement</Text>
              <Text style={styles.featureDesc}>
                Des solutions fiables, accessibles et performantes qui facilitent le travail des éleveurs, intégrant les dernières innovations technologiques.
              </Text>
            </View>

            <View style={styles.feature}>
              <View style={styles.featureIconBox}>
                <Text style={styles.featureIcon}>🔭</Text>
              </View>
              <Text style={styles.featureTitle}>Notre Vision</Text>
              <Text style={styles.featureDesc}>
                Devenir le leader national de la couveuse intelligente, en modernisant le secteur de l'élevage avicole pour une incubation plus précise et connectée.
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Section Contact */}
        <Animated.View 
          style={[styles.card, styles.contactCard, { opacity: fadeAnim, transform: [{ translateY: fadeAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [50, 0]
          })}] }]}
        >
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLine} />
            <Text style={styles.cardHeaderText}>CONTACTEZ-NOUS</Text>
            <View style={styles.cardHeaderLine} />
          </View>
          
          <Text style={styles.contactIntro}>
            Vous avez une question ou souhaitez en savoir plus sur nos produits? 
            N'hésitez pas à nous contacter directement.
          </Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nom complet</Text>
            <TextInput
              style={[styles.input, errors.name ? styles.inputError : null]}
              placeholder="Votre nom"
              placeholderTextColor={COLORS.grayMedium}
              value={form.name}
              onChangeText={(text) => {
                setForm({ ...form, name: text });
                if (errors.name) setErrors({...errors, name: null});
              }}
              autoCorrect={false}
            />
            {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[styles.input, errors.email ? styles.inputError : null]}
              placeholder="votre.email@example.com"
              placeholderTextColor={COLORS.grayMedium}
              keyboardType="email-address"
              value={form.email}
              onChangeText={(text) => {
                setForm({ ...form, email: text });
                if (errors.email) setErrors({...errors, email: null});
              }}
              autoCapitalize="none"
              autoCorrect={false}
            />
            {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Message</Text>
            <TextInput
              style={[
                styles.input, 
                styles.textArea, 
                errors.message ? styles.inputError : null
              ]}
              placeholder="Votre message..."
              placeholderTextColor={COLORS.grayMedium}
              multiline
              value={form.message}
              onChangeText={(text) => {
                setForm({ ...form, message: text });
                if (errors.message) setErrors({...errors, message: null});
              }}
            />
            {errors.message ? <Text style={styles.errorText}>{errors.message}</Text> : null}
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setForm({ name: '', email: '', message: '' });
                setErrors({});
              }}
              activeOpacity={0.7}
              disabled={isSending}
            >
              <Text style={styles.cancelText}>Annuler</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.sendButton, isSending ? styles.sendingButton : null]}
              onPress={handleSend}
              activeOpacity={0.7}
              disabled={isSending}
            >
              {isSending ? (
                <ActivityIndicator size="small" color={COLORS.white} />
              ) : (
                <Text style={styles.sendText}>Envoyer</Text>
              )}
            </TouchableOpacity>
          </View>
        </Animated.View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>© {new Date().getFullYear()} F9asti. Tous droits réservés.</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 20,
  },
  logoImage: {
    width: 120,
    height: 120,
    borderRadius: 30,
    alignSelf: 'center',
    marginBottom: 16,
    resizeMode: 'contain',
    borderWidth: 3,
    borderColor: COLORS.white,
  },
  heroTitle: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.xLarge * 1.5,
    color: COLORS.white,
    marginBottom: 4,
  },
  heroSubtitle: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.medium,
    color: COLORS.white,
    opacity: 0.85,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    // Ombre (iOS)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    // Ombre (Android)
    elevation: 8,
  },
  contactCard: {
    paddingVertical: 30,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  cardHeaderLine: {
    height: 1,
    backgroundColor: COLORS.grayLight,
    flex: 1,
  },
  cardHeaderText: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.medium,
    color: COLORS.textPrimary,
    marginHorizontal: 12,
    letterSpacing: 1,
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.xLarge + 2,
    textAlign: 'center',
    marginBottom: 20,
    color: COLORS.textPrimary,
  },
  paragraph1: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.medium,
    color: COLORS.textSecondary,
    lineHeight: 26,
    textAlign: 'justify',
    marginBottom: 20,
  },
  bold: {
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  featureSection: {
    marginTop: 10,
  },
  feature: {
    marginBottom: 24,
  },
  featureIconBox: {
    width: 50,
    height: 50,
    borderRadius: 15,
    backgroundColor: COLORS.greenPrimary + '20', // 20% opacity
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureIcon: {
    fontSize: 24,
  },
  featureTitle: {
    fontFamily: FONTS.semiBold,
    fontSize: SIZES.medium + 2,
    marginBottom: 8,
    color: COLORS.textPrimary,
  },
  featureDesc: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.medium,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  contactIntro: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.medium,
    color: COLORS.textSecondary,
    marginBottom: 24,
    lineHeight: 22,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.medium,
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.bgInput,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: SIZES.medium,
    fontFamily: FONTS.regular,
    color: COLORS.textPrimary,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  inputError: {
    borderColor: '#FF3B30',
  },
  errorText: {
    color: '#FF3B30',
    fontFamily: FONTS.regular,
    fontSize: SIZES.small + 1,
    marginTop: 4,
    marginLeft: 4,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  cancelButton: {
    backgroundColor: COLORS.grayLight,
    paddingVertical: 15,
    paddingHorizontal: 28,
    borderRadius: 12,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  cancelText: {
    fontFamily: FONTS.medium,
    color: COLORS.textPrimary,
    fontSize: SIZES.medium,
  },
  sendButton: {
    backgroundColor: COLORS.greenPrimary,
    paddingVertical: 15,
    paddingHorizontal: 28,
    borderRadius: 12,
    flex: 1,
    marginLeft: 10,
    alignItems: 'center',
    shadowColor: COLORS.greenPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  sendingButton: {
    opacity: 0.8,
  },
  sendText: {
    fontFamily: FONTS.medium,
    color: COLORS.white,
    fontSize: SIZES.medium,
  },
  footer: {
    marginTop: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  footerText: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.small + 1,
    color: COLORS.white,
    opacity: 0.8,
  },
});

export default ConnecteApropos;