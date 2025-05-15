import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  updateProfile
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
    console.error("Erreur inscription:", error);
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
    console.error("Erreur connexion:", {
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    throw error;
  }
};