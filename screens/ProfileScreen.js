import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { COLORS, SIZES, FONTS } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [profileImage, setProfileImage] = useState(null);

  useFocusEffect(
    useCallback(() => {
      // Vérifie si une image a été passée depuis la page de modification
      if (navigation?.getState) {
        const routes = navigation.getState().routes;
        const currentRoute = routes[routes.length - 1];
        const imageFromEdit = currentRoute.params?.profileImage;
        if (imageFromEdit) {
          setProfileImage(imageFromEdit);
        }
      }
    }, [navigation])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Profil</Text>
      <View style={styles.card}>
        <View style={styles.profileInfo}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatar}>
              <Ionicons name="person" size={40} color={COLORS.greenPrimary} />
            </View>
          )}
          <View>
            <Text style={styles.name}>Pierre Dupont</Text>
            <Text style={styles.email}>pierre.dupont@example.com</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.editSection}
          onPress={() => navigation.navigate('EditProfile')}
        >
          <Ionicons name="person-outline" size={20} color={COLORS.textPrimary} />
          <Text style={styles.editText}>Modifier le profil</Text>
          <Ionicons name="chevron-forward" size={20} color={COLORS.grayDark} style={styles.chevron} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton}>
          <Text style={styles.logoutText}>Déconnexion</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.greenPrimary,
    padding: 30,
    
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
    elevation: 5,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    backgroundColor: COLORS.greenSecondary,
    borderRadius: 50,
    padding: 15,
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
  editSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.grayLight,
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  editText: {
    flex: 1,
    fontSize: SIZES.medium,
    marginLeft: 10,
    fontFamily: FONTS.medium,
    color: COLORS.textPrimary,
  },
  chevron: {
    marginLeft: 'auto',
  },
  logoutButton: {
    backgroundColor: COLORS.white,
    padding: 15,
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.error,
  },
  logoutText: {
    color: COLORS.error,
    fontSize: SIZES.medium,
    fontFamily: FONTS.semiBold,
  },
  avatarImage: {
    width: 70,
    height: 70,
    borderRadius: 50,
    marginRight: 15,
  },
});
