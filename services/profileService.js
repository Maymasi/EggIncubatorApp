import { updateProfile, updateEmail, updatePassword } from 'firebase/auth';
import { ref, update } from 'firebase/database';
import { auth, database } from '../config/firebase';

export const updateUserProfile = async ({ displayName, email, photoURL, fullName, farmName }) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('Utilisateur non connecté');

    // Mise à jour Firebase Auth
    const authUpdates = {};
    if (displayName && displayName !== user.displayName) authUpdates.displayName = displayName;
    if (photoURL && photoURL !== user.photoURL) authUpdates.photoURL = photoURL;
    if (email && email !== user.email) {
      await updateEmail(user, email);
    }

    if (Object.keys(authUpdates).length > 0) {
      await updateProfile(user, authUpdates);
    }

    // Mise à jour Realtime Database
    const dbUpdates = {};
    if (fullName) dbUpdates.fullName = fullName;
    if (farmName) dbUpdates.farmName = farmName;

    if (Object.keys(dbUpdates).length > 0) {
      const userRef = ref(database, `users/${user.uid}`);
      await update(userRef, dbUpdates);
    }

    return { success: true, user };
  } catch (error) {
    console.error("Erreur mise à jour profil:", error);
    throw error;
  }
};

export const changeUserPassword = async (newPassword) => {
  try {
    await updatePassword(auth.currentUser, newPassword);
    return { success: true };
  } catch (error) {
    console.error("Erreur changement mot de passe:", error);
    throw error;
  }
};