import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Image } from 'react-native';
import { COLORS, SIZES, FONTS } from '../constants/theme';
import Logo from '../assets/images/logo.png';

const ConnecteApropos = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleSend = async () => {
    if (!form.name || !form.email || !form.message) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
      return;
    }

    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
    if (!isEmailValid) {
      Alert.alert('Erreur', 'Adresse email invalide.');
      return;
    }

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
          service_id: 'service_ig1cyoh',
          template_id: 'template_rppitns',
          user_id: 'lATVcnhDWv9xoU2qM',
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
        return;
      }

      Alert.alert('Succès', 'Message envoyé avec succès !');
      setForm({ name: '', email: '', message: '' });

    } catch (error) {
      console.error('Erreur réseau ou système :', error);
      Alert.alert('Erreur', "Erreur réseau : impossible d'envoyer le message.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Image source={Logo} style={styles.logoImage} />
        <Text style={styles.title}>Ma Couveuse Connectée</Text>
        <Text style={styles.paragraph1}>
          Le projet <Text style={styles.bold}>Ma Couveuse Connectée</Text> a pour objectif de développer une couveuse intelligente capable d’assurer l’incubation des œufs dans des conditions optimales. Concrètement, cela signifie que la couveuse est dotée de capteurs et de systèmes de contrôle permettant de surveiller en temps réel des paramètres essentiels comme la température, l’humidité ou encore le retournement des œufs.
        </Text>
        <Text style={styles.subtitle}>Notre Innovation</Text>
        <Text style={styles.paragraph}>
          Grâce à des capteurs intégrés et un système de contrôle automatisé, la couveuse régule la température, l'humidité et le retournement des œufs afin de maximiser les chances d'éclosion.
        </Text>
        <Text style={styles.subtitle}>Notre Démarche</Text>
        <Text style={styles.paragraph}>
          Ce projet innovant, mené dans le cadre d'une formation en objets connectés, allie électronique, programmation et conception pratique pour offrir une solution accessible aux éleveurs amateurs et passionnés.
        </Text>
        <Text style={styles.subtitle}>Notre Ambition</Text>
        <Text style={styles.paragraph}>
          Rendre l'incubation plus simple, plus efficace et plus connectée.
        </Text>
      </View>

      {/* Section Contact */}
      <View style={styles.card}>
        <Text style={styles.title}>Contactez-nous</Text>

        <Text style={styles.label}>Nom complet</Text>
        <TextInput
          style={styles.input}
          placeholder="Votre nom"
          placeholderTextColor={COLORS.grayMedium}
          value={form.name}
          onChangeText={(text) => setForm({ ...form, name: text })}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="votre.email@example.com"
          placeholderTextColor={COLORS.grayMedium}
          keyboardType="email-address"
          value={form.email}
          onChangeText={(text) => setForm({ ...form, email: text })}
        />

        <Text style={styles.label}>Message</Text>
        <TextInput
          style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
          placeholder="Votre message..."
          placeholderTextColor={COLORS.grayMedium}
          multiline
          value={form.message}
          onChangeText={(text) => setForm({ ...form, message: text })}
        />

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.cancelButton} onPress={() => setForm({ name: '', email: '', message: '' })}>
            <Text style={styles.cancelText}>Annuler</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <Text style={styles.sendText}>Envoyer</Text>
          </TouchableOpacity>
        </View>
      </View>
      
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: COLORS.greenPrimary,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.xLarge,
    textAlign: 'center',
    marginBottom: 10,
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontFamily: FONTS.semiBold,
    fontSize: SIZES.large,
    marginTop: 16,
    marginBottom: 4,
    color: COLORS.textPrimary,
  },
  paragraph: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.medium,
    color: COLORS.textSecondary,
    lineHeight: 22,
    textAlign: 'justify',
  },
  paragraph1: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 22,
    textAlign: 'justify',
  },
  bold: {
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  label: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.medium,
    color: COLORS.textPrimary,
    marginTop: 10,
    marginBottom: 4,
  },
  input: {
    backgroundColor: COLORS.bgInput,
    borderRadius: 8,
    padding: 10,
    fontSize: SIZES.medium,
    fontFamily: FONTS.regular,
    color: COLORS.textPrimary,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  cancelButton: {
    backgroundColor: COLORS.grayLight,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  cancelText: {
    fontFamily: FONTS.medium,
    color: COLORS.textPrimary,
    fontSize: SIZES.medium,
  },
  sendButton: {
    backgroundColor: COLORS.bgButton,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  sendText: {
    fontFamily: FONTS.medium,
    color: COLORS.textLight,
    fontSize: SIZES.medium,
  },
  logoImage: {
    width: 80,
    height: 80,
    borderRadius: 20,
    alignSelf: 'center',
    marginBottom: 16,
    resizeMode: 'cover',
  },
});

export default ConnecteApropos;
