import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, TextInput } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { COLORS, SIZES, FONTS } from '../constants/theme';

const EditProfileScreen = () => {
  const navigation = useNavigation();
  const [image, setImage] = useState(null);
  const [fullName, setFullName] = useState('Pierre Dupont');
  const [email, setEmail] = useState('pierre.dupont@example.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const selectedImage = result.assets[0].uri;
      setImage(selectedImage);
    }
  };

  const handleSave = () => {
    navigation.navigate('Profile', {
      profileImage: image,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Modifier le profil</Text>
      <View style={styles.card}>
        <TouchableOpacity style={styles.imageContainer} onPress={pickImage}>
          {image ? (
            <Image source={{ uri: image }} style={styles.profileImage} />
          ) : (
            <View style={styles.defaultImage}>
              <Ionicons name="person" size={60} color={COLORS.greenPrimary} />
              <View style={styles.editIcon}>
                <Ionicons name="pencil" size={14} color={COLORS.white} />
              </View>
            </View>
          )}
          <Text style={styles.changeText}>Changer la photo de profil</Text>
        </TouchableOpacity>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nom complet</Text>
          <TextInput
            style={styles.input}
            value={fullName}
            onChangeText={setFullName}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            keyboardType="email-address"
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Mot de passe</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              placeholder="Entrez votre mot de passe"
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
              <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color={COLORS.grayDark} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
            <Text style={styles.cancelText}>Annuler</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveText}>Enregistrer</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.greenPrimary,
    padding: 20,
  },
  header: {
    color: COLORS.white,
    fontSize: SIZES.xLarge,
    fontFamily: FONTS.bold,
    marginBottom: 20,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 20,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  defaultImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.greenSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.greenPrimary,
    borderRadius: 12,
    padding: 4,
  },
  changeText: {
    marginTop: 10,
    color: COLORS.grayDark,
    fontFamily: FONTS.regular,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontFamily: FONTS.medium,
    marginBottom: 5,
    color: COLORS.black,
  },
  input: {
    backgroundColor: COLORS.grayLight,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontFamily: FONTS.regular,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.grayLight,
    borderRadius: 10,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontFamily: FONTS.regular,
  },
  eyeIcon: {
    paddingHorizontal: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    marginRight: 10,
    backgroundColor: COLORS.grayLight,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelText: {
    fontFamily: FONTS.medium,
    color: COLORS.black,
  },
  saveButton: {
    flex: 1,
    marginLeft: 10,
    backgroundColor: COLORS.greenPrimary,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveText: {
    fontFamily: FONTS.medium,
    color: COLORS.white,
  },
});

