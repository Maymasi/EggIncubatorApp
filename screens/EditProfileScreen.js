import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, TextInput, SafeAreaView, ScrollView } from 'react-native';
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
  const [activeField, setActiveField] = useState('');

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

  const renderInputField = (label, value, setValue, keyboardType = 'default', secure = false) => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <View style={[
        styles.inputContainer,
        activeField === label && styles.activeInputContainer
      ]}>
        {label === 'Nom complet' && (
          <Ionicons name="person-outline" size={20} color={activeField === label ? COLORS.greenPrimary : COLORS.grayDark} style={styles.inputIcon} />
        )}
        {label === 'Email' && (
          <Ionicons name="mail-outline" size={20} color={activeField === label ? COLORS.greenPrimary : COLORS.grayDark} style={styles.inputIcon} />
        )}
        {label === 'Mot de passe' && (
          <Ionicons name="lock-closed-outline" size={20} color={activeField === label ? COLORS.greenPrimary : COLORS.grayDark} style={styles.inputIcon} />
        )}
        
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={setValue}
          keyboardType={keyboardType}
          secureTextEntry={secure && !showPassword}
          placeholder={`Entrez votre ${label.toLowerCase()}`}
          placeholderTextColor={COLORS.grayMedium}
          onFocus={() => setActiveField(label)}
          onBlur={() => setActiveField('')}
        />
        
        {label === 'Mot de passe' && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
            <Ionicons 
              name={showPassword ? 'eye-off-outline' : 'eye-outline'} 
              size={20} 
              color={activeField === label ? COLORS.greenPrimary : COLORS.grayDark} 
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Modifier le profil</Text>
        <View style={styles.placeholderButton} />
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <View style={styles.profileHeader}>
            <TouchableOpacity style={styles.imageContainer} onPress={pickImage}>
              {image ? (
                <Image source={{ uri: image }} style={styles.profileImage} />
              ) : (
                <View style={styles.defaultImage}>
                  <Text style={styles.initials}>PD</Text>
                </View>
              )}
              <View style={styles.editIconContainer}>
                <View style={styles.editIcon}>
                  <Ionicons name="camera" size={16} color={COLORS.white} />
                </View>
              </View>
            </TouchableOpacity>
            
            <Text style={styles.changeText}>Changer la photo</Text>
          </View>

          <View style={styles.formContainer}>
            {renderInputField('Nom complet', fullName, setFullName)}
            {renderInputField('Email', email, setEmail, 'email-address')}
            {renderInputField('Mot de passe', password, setPassword, 'default', true)}
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
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.greenPrimary,
    paddingTop:SIZES.xLarge
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.greenPrimary,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    color: COLORS.white,
    fontSize: SIZES.large,
    fontFamily: FONTS.bold,
  },
  placeholderButton: {
    width: 44,
    height: 44,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 24,
    marginTop: 16,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 10,
    marginBottom: 20,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: COLORS.white,
  },
  defaultImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.greenSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.white,
  },
  initials: {
    fontSize: SIZES.xLarge + 8,
    fontFamily: FONTS.bold,
    color: COLORS.white,
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  editIcon: {
    backgroundColor: COLORS.greenPrimary,
    borderRadius: 18,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.white,
  },
  changeText: {
    color: COLORS.greenPrimary,
    fontFamily: FONTS.medium,
    fontSize: SIZES.medium,
  },
  formContainer: {
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.small + 2,
    marginBottom: 8,
    color: COLORS.grayDark,
    paddingLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.grayLight,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'transparent',
    paddingHorizontal: 16,
  },
  activeInputContainer: {
    borderColor: COLORS.greenPrimary,
    backgroundColor: `${COLORS.greenPrimary}10`,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontFamily: FONTS.regular,
    fontSize: SIZES.medium,
    color: COLORS.black,
  },
  eyeIcon: {
    padding: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  cancelButton: {
    flex: 1,
    marginRight: 12,
    backgroundColor: COLORS.grayLight,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  saveButton: {
    flex: 1,
    marginLeft: 12,
    backgroundColor: COLORS.greenPrimary,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: COLORS.greenPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  cancelText: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.medium,
    color: COLORS.grayDark,
  },
  saveText: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.medium,
    color: COLORS.white,
  },
});