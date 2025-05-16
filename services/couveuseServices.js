import { ref, get, update,onValue,off } from 'firebase/database';
import { database } from '../config/firebase';

/**
 * Ajoute une couveuse gérée par un utilisateur après vérifications :
 * - La couveuse existe globalement
 * - L'utilisateur ne la gère pas déjà
 *
 * @param {string} userId - L'ID Firebase de l'utilisateur
 * @param {string} identifiant - Identifiant unique de la couveuse
 * @param {object} dataCouveuse - Données à stocker dans couveusesGereses
 * @throws {Error} en cas d'erreur de validation ou Firebase
 */
export const addCouveuse = async (userId, identifiant, dataCouveuse) => {
  if (!userId) throw new Error('Utilisateur non connecté');
  if (!identifiant) throw new Error('Identifiant de couveuse requis');

  // Vérifie que la couveuse existe globalement
  const couveuseGlobaleRef = ref(database, `Couveuses/${identifiant}`);
  const globalSnapshot = await get(couveuseGlobaleRef);
  if (!globalSnapshot.exists()) {
    throw new Error('Cette couveuse n\'existe pas dans la base de données globale.');
  }

  // Vérifie si l'utilisateur gère déjà cette couveuse
  const userCouveuseRef = ref(database, `users/${userId}/couveusesGereses/${identifiant}`);
  const userSnapshot = await get(userCouveuseRef);
  if (userSnapshot.exists()) {
    throw new Error('Vous gérez déjà cette couveuse.');
  }

  // Ajoute la couveuse à la liste des couveuses gérées par l'utilisateur
  await update(userCouveuseRef, dataCouveuse);
};




export function listenToCouveusesGereesParUser(userId, callback) {
  if (!userId) return;

  const userCouveusesRef = ref(database, `users/${userId}/couveusesGereses`);

  const listener = onValue(userCouveusesRef, async (snapshotUser) => {
    const couveusesGerees = snapshotUser.val();
    if (!couveusesGerees) {
      callback({ couveuses: [], tempMoy: 0, humMoy: 0 });
      return;
    }

    let totalTemp = 0;
    let totalHum = 0;
    let count = 0;

    const couveusesAvecDetails = await Promise.all(
      Object.entries(couveusesGerees).map(async ([idCouveuse, localData]) => {
        const couveuseGlobalRef = ref(database, `Couveuses/${idCouveuse}`);
        const snapshotGlobal = await new Promise(resolve =>
          onValue(couveuseGlobalRef, resolve, { onlyOnce: true })
        );
        const globalData = snapshotGlobal.val() || {};

        const historyMesures = globalData.history?.mesures || {};
        const lastMesureKey = Object.keys(historyMesures).pop();
        const lastMesure = lastMesureKey ? historyMesures[lastMesureKey] : {};

        if (lastMesure.temperature !== undefined) totalTemp += lastMesure.temperature;
        if (lastMesure.humidite !== undefined) totalHum += lastMesure.humidite;
        if (lastMesure.temperature !== undefined || lastMesure.humidite !== undefined) count++;

        const historyActions = globalData.history?.action || {};
        let lastRotationTime = "00:00";
        for (const [timestamp, action] of Object.entries(historyActions).reverse()) {
          if (action.servo === "rotation") {
            const timePart = timestamp.split('_')[1].substring(0, 5);
            lastRotationTime = timePart.replace('-', ':');
            break;
          }
        }

        let etat = "normal";
        if (globalData.alertes && Object.keys(globalData.alertes).length > 0) {
          etat = "alerte critique";
        }

        // Calcul des jours écoulés depuis la date d'ajout
        const dateAjout = localData.dateAjout ? new Date(localData.dateAjout) : new Date();
        const aujourdHui = new Date();
        const joursEcoules = Math.floor((aujourdHui - dateAjout) / (1000 * 60 * 60 * 24));
        const dureeIncubation = localData.dureeIncubation || 21;

        return {
          id: idCouveuse,
          name: localData.nom || "Sans nom",
          eggNumber: localData.nbOeufs || 0,
          etat: etat,
          jour: `${joursEcoules}/${dureeIncubation}`,
          temp: lastMesure.temperature || 0,
          hum: lastMesure.humidite || 0,
          ventilateur: globalData.Config?.fanState === "on" ? "Actif" : "Inactif",
          rotation: lastRotationTime,
          progress: Math.min(1, Math.max(0, joursEcoules / dureeIncubation)),
          eclosionPeriode: dureeIncubation - joursEcoules
        };
      })
    );

    const tempMoy = count > 0 ? (totalTemp / count).toFixed(1) : 0;
    const humMoy = count > 0 ? (totalHum / count).toFixed(0) : 0;

    callback({
      couveuses: couveusesAvecDetails,
      tempMoy: Number(tempMoy),
      humMoy: Number(humMoy)
    });
  });

  // Retourne une fonction pour arrêter l'écoute
  return () => {
    off(userCouveusesRef);
  };
}



/**
 * Récupère les données pour afficher la carte d'une couveuse spécifique
 * @param {string} userId - ID de l'utilisateur
 * @param {string} couveuseId - ID de la couveuse
 * @param {function} callback - Fonction de callback avec les données
 * @returns {function} Fonction pour arrêter l'écoute
 */
export function listenToCouveuseCardData(userId, couveuseId, callback) {
  if (!userId || !couveuseId) return () => {};

  // Références aux données nécessaires
  const userCouveuseRef = ref(database, `users/${userId}/couveusesGereses/${couveuseId}`);
  const couveuseGlobalRef = ref(database, `Couveuses/${couveuseId}`);
  
  let userData = {};
  let globalData = {};

  const updateCallback = () => {
    if (!userData || !globalData) return;

    // Dernière mesure de température/humidité
    const historyMesures = globalData.history?.mesures || {};
    const lastMesureKey = Object.keys(historyMesures).pop();
    const lastMesure = lastMesureKey ? historyMesures[lastMesureKey] : {};

    // Dernière rotation
    const historyActions = globalData.history?.action || {};
    let lastRotationTime = "00:00";
    for (const [timestamp, action] of Object.entries(historyActions).reverse()) {
      if (action.servo === "rotation") {
        const timePart = timestamp.split('_')[1].substring(0, 5);
        lastRotationTime = timePart.replace('-', ':');
        break;
      }
    }

    // Calcul des jours écoulés depuis la date d'ajout
    const dateAjout = userData.dateAjout ? new Date(userData.dateAjout) : new Date();
    const aujourdHui = new Date();
    const joursEcoules = Math.floor((aujourdHui - dateAjout) / (1000 * 60 * 60 * 24));
    const dureeIncubation = userData.dureeIncubation || 21;
    const joursRestants = Math.max(0, dureeIncubation - joursEcoules); // Évite les valeurs négatives

    // Données pour la carte
    const cardData = {
      eggNumber: userData.nbOeufs || 0,
      currentDay: joursEcoules,
      totalDays: dureeIncubation,
      temperature: lastMesure.temperature || 0,
      humidity: lastMesure.humidite || 0,
      lastRotation: lastRotationTime,
      daysToHatch: joursRestants,
      progress: Math.min(1, Math.max(0, joursEcoules / dureeIncubation)) // Garantit une valeur entre 0 et 1
    };

    callback(cardData);
  };

  // Écoute des données utilisateur
  const userListener = onValue(userCouveuseRef, (snapshot) => {
    userData = snapshot.val() || {};
    updateCallback();
  });

  // Écoute des données globales
  const globalListener = onValue(couveuseGlobalRef, (snapshot) => {
    globalData = snapshot.val() || {};
    updateCallback();
  });

  // Retourne une fonction pour arrêter les listeners
  return () => {
    off(userCouveuseRef);
    off(couveuseGlobalRef);
  };
}


/**
 * Écoute en temps réel la configuration d'une couveuse
 */
export function listenToCouveuseConfig(idCouveuse, callback) {
  const configRef = ref(database, `Couveuses/${idCouveuse}/Config`);
  const unsubscribe = onValue(configRef, (snapshot) => {
    callback(snapshot.val());
  });
  return () => unsubscribe(); // Permet de détacher le listener
}

/**
 * Met à jour la configuration d'une couveuse
 */
export async function updateCouveuseConfig(idCouveuse, updates) {
  if (!idCouveuse) throw new Error("ID de couveuse requis");
  const configRef = ref(database, `Couveuses/${idCouveuse}/Config`);
  await update(configRef, updates);
}

// ✅ Met à jour manualState si nécessaire
export async function turnManualStateOn(idCouveuse) {
  const configRef = ref(database, `Couveuses/${idCouveuse}/Config`);
  const snapshot = await get(configRef);
  const currentConfig = snapshot.val();

  if (currentConfig?.manualState !== "on") {
    await update(configRef, { manualState: "on" });
  }
}

