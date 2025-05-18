import React, { useState, useCallback, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView, ScrollView } from 'react-native';
import { COLORS, SIZES, FONTS } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { AuthContext } from '../contexts/AuthContext';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [profileImage, setProfileImage] = useState(null);
  const { user, logout } = useContext(AuthContext);

  useFocusEffect(
    useCallback(() => {
      const route = navigation.getCurrentRoute?.();
      const imageFromEdit = route?.params?.profileImage;

      if (imageFromEdit) {
        setProfileImage(imageFromEdit);
      }
    }, [navigation])
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles.headerContainer}>
          <Text style={styles.header}>Mon Profil</Text>
        </View>

        {/* Carte de profil principale */}
        <View style={styles.profileCard}>
          <View style={styles.profileInfo}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatar}>
                <Ionicons name="person" size={40} color={COLORS.white} />
              </View>
            )}
            <View>
              <Text style={styles.name}>{user?.displayName || 'Nom utilisateur'}</Text>
              <Text style={styles.email}>{user?.email || 'Email non disponible'}</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.editButton}
            onPress={() => navigation.navigate('EditProfile')}
          >
            <Text style={styles.editButtonText}>Modifier le profil</Text>
          </TouchableOpacity>
        </View>

        {/* Section des options */}
        <View style={styles.optionsContainer}>
          <Text style={styles.sectionTitle}>Paramètres</Text>

          {/* Option Modifier Profil */}
          <TouchableOpacity
            style={styles.optionCard}
            onPress={() => navigation.navigate('EditProfile')}
          >
            <View style={styles.optionIconContainer}>
              <Ionicons name="person-outline" size={22} color={COLORS.white} />
            </View>
            <Text style={styles.optionText}>Modifier le profil</Text>
            <Ionicons name="chevron-forward" size={20} color={COLORS.grayDark} style={styles.chevron} />
          </TouchableOpacity>

          {/* Option FAQ */}
          <TouchableOpacity
            style={styles.optionCard}
            onPress={() => navigation.navigate('FAQ')}
          >
            <View style={[styles.optionIconContainer, { backgroundColor: COLORS.blue }]}>
              <Ionicons name="help-circle-outline" size={22} color={COLORS.white} />
            </View>
            <Text style={styles.optionText}>Foire aux questions</Text>
            <Ionicons name="chevron-forward" size={20} color={COLORS.grayDark} style={styles.chevron} />
          </TouchableOpacity>

          {/* Option À propos */}
          <TouchableOpacity
            style={styles.optionCard}
            onPress={() => navigation.navigate('ConnecteApropos')}
          >
            <View style={[styles.optionIconContainer, { backgroundColor: COLORS.purple }]}>
              <Ionicons name="information-circle-outline" size={22} color={COLORS.white} />
            </View>
            <Text style={styles.optionText}>À propos</Text>
            <Ionicons name="chevron-forward" size={20} color={COLORS.grayDark} style={styles.chevron} />
          </TouchableOpacity>
        </View>

        {/* Bouton de déconnexion */}
        <TouchableOpacity
          style={styles.logoutButton}
        onPress={async () => {
        try {
          await logout();
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
        } catch (err) {
          console.error("Erreur déconnexion :", err);
        }
      }}

        >
          <Ionicons name="log-out-outline" size={20} color={COLORS.error} style={styles.logoutIcon} />
          <Text style={styles.logoutText}>Déconnexion</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.grayLight,
  },
  headerContainer: {
    backgroundColor: COLORS.greenPrimary,
    paddingTop: 20,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 20,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  header: {
    color: COLORS.white,
    fontSize: SIZES.xLarge + 4,
    fontFamily: FONTS.bold,
    textAlign: 'center',
    paddingTop: 10
  },
  profileCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 20,
    margin: 15,
    elevation: 5,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    backgroundColor: COLORS.greenPrimary,
    borderRadius: 50,
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarImage: {
    width: 70,
    height: 70,
    borderRadius: 50,
    marginRight: 15,
  },
  name: {
    fontSize: SIZES.large,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  email: {
    fontSize: SIZES.medium,
    color: COLORS.grayDark,
    fontFamily: FONTS.regular,
  },
  editButton: {
    backgroundColor: COLORS.greenSecondary,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  editButtonText: {
    color: COLORS.white,
    fontFamily: FONTS.medium,
    fontSize: SIZES.medium,
  },
  optionsContainer: {
    marginHorizontal: 15,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: SIZES.medium,
    fontFamily: FONTS.semiBold,
    color: COLORS.grayDark,
    marginBottom: 10,
    marginLeft: 5,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
    elevation: 2,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  optionIconContainer: {
    backgroundColor: COLORS.greenPrimary,
    borderRadius: 10,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  optionText: {
    flex: 1,
    fontSize: SIZES.medium,
    fontFamily: FONTS.medium,
    color: COLORS.textPrimary,
  },
  chevron: {
    marginLeft: 'auto',
  },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    margin: 15,
    borderWidth: 1,
    borderColor: COLORS.error,
  },
  logoutIcon: {
    marginRight: 10,
  },
  logoutText: {
    color: COLORS.error,
    fontSize: SIZES.medium,
    fontFamily: FONTS.semiBold,
  },
  footer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  footerText: {
    color: COLORS.grayDark,
    fontSize: SIZES.small,
    fontFamily: FONTS.regular,
  }
});
