import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginUser, registerUser } from '../services/auth'; // Importez vos services
import { ref, get } from 'firebase/database';
import { database } from '../config/firebase';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Charge l'utilisateur au démarrage
  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('userData');
        if (storedUser) {
          setCurrentUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Load user error:", error);
      } finally {
        setIsAuthLoading(false);
      }
    };

    loadUser();
  }, []);

  // Met à jour les données dans AsyncStorage et le state
  const updateUserData = async (firebaseUser) => {
    try {
      const userRef = ref(database, `users/${firebaseUser.uid}`);
      const snapshot = await get(userRef);
      const dbData = snapshot.val();

      const userData = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        farmName: dbData?.farmName,
        couveusesGeres: dbData?.couveusesGeres || {},
        metadata: dbData?._metadata || { createdAt: Date.now() }
      };

      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      setCurrentUser(userData);
      return userData;
    } catch (error) {
      throw error;
    }
  };

  // Connexion (utilise VOTRE loginUser)
  const login = async (email, password) => {
    setIsAuthLoading(true);
    try {
      const user = await loginUser(email, password); // Appel à votre service
      return await updateUserData(user);
    } catch (error) {
      setAuthError(mapAuthError(error)); // Utilisez votre gestion d'erreur existante
      throw error;
    } finally {
      setIsAuthLoading(false);
    }
  };

  // Inscription (utilise VOTRE registerUser)
  const register = async (email, password, fullName, farmName) => {
    setIsAuthLoading(true);
    try {
      const user = await registerUser(email, password, fullName, farmName); // Appel à votre service
      return await updateUserData(user);
    } catch (error) {
      setAuthError(error.message);
      throw error;
    } finally {
      setIsAuthLoading(false);
    }
  };

  // Déconnexion
  const logout = async () => {
    try {
      await AsyncStorage.removeItem('userData');
      setCurrentUser(null);
    } catch (error) {
      setAuthError(error.message);
      throw error;
    }
  };

  // Helper pour les erreurs Firebase (adaptez à votre système existant)
  const mapAuthError = (error) => {
    const errors = {
      'auth/invalid-email': 'Email invalide',
      'auth/user-not-found': 'Utilisateur non trouvé',
      'auth/wrong-password': 'Mot de passe incorrect',
    };
    return errors[error.code] || error.message;
  };

  return (
    <AuthContext.Provider
      value={{
        user: currentUser,
        isLoading: isAuthLoading,
        error: authError,
        login,
        register,
        logout,
        refreshUser: () => currentUser && updateUserData(currentUser)
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};