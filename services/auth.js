import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  updateProfile,
  updateEmail,
  updatePassword
} from 'firebase/auth';

import { ref, set, update, get } from 'firebase/database';
import { auth, database } from '../config/firebase';

export const registerUser = async (email, password, fullName, farmName) => {
  try {
    // 1. Création du compte
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // 2. Mise à jour du profil
    await updateProfile(user, {
      displayName: fullName
    });

    // 3. Vérification que database est bien initialisé
    if (!database) throw new Error("Database non initialisée");

    // 4. Écriture dans la DB avec vérification
    const userRef = ref(database, `users/${user.uid}`);
    await set(userRef, {
      fullName,
      email,
      farmName,
      couveusesGeres: {},
      _metadata: {
        createdAt: Date.now(),
        lastLogin: null
      }
    });

    return user;

  } catch (error) {
    throw new Error(`Échec inscription: ${error.message}`);
  }
};

export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    // Vérification database
    if (!database) throw new Error("Database non initialisée");

    // Mise à jour lastLogin avec vérification du chemin
    const metadataRef = ref(database, `users/${userCredential.user.uid}/_metadata`);
    await update(metadataRef, {
      lastLogin: Date.now()
    });

    return userCredential.user;

  } catch (error) {
    // console.error("Erreur connexion:", {
    //   message: error.message,
    //   code: error.code,
    //   stack: error.stack
    // });
    throw error;
  }
};
export const updateUserProfile = async (userId, updates) => {
  try {
    // Vérification des données
    if (!userId || !updates) {
      throw new Error("Données manquantes pour la mise à jour");
    }

    // Mise à jour dans Firebase Auth (si email ou mot de passe)
    const user = auth.currentUser;
    
    if (updates.email) {
      await updateEmail(user, updates.email);
    }
    
    if (updates.password) {
      await updatePassword(user, updates.password);
    }
    
    if (updates.displayName) {
      await updateProfile(user, {
        displayName: updates.displayName
      });
    }

    // Mise à jour dans la Realtime Database
    const userRef = ref(database, `users/${userId}`);
    const dbUpdates = {};
    
    if (updates.fullName) dbUpdates.fullName = updates.fullName;
    if (updates.farmName) dbUpdates.farmName = updates.farmName;
    
    if (Object.keys(dbUpdates).length > 0) {
      await update(userRef, dbUpdates);
    }

    return auth.currentUser; 
  } catch (error) {
    throw error;
  }
};