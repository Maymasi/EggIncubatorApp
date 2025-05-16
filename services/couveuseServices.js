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

        return {
          name: localData.nom || "Sans nom",
          eggNumber: localData.nbOeufs || 0,
          etat: etat,
          jour: `${localData.joursEcoules || 0}/${localData.dureeIncubation || 21}`,
          temp: lastMesure.temperature || 0,
          hum: lastMesure.humidite || 0,
          ventilateur: globalData.Config?.fanState === "on" ? "Actif" : "Inactif",
          rotation: lastRotationTime,
          progress: Math.round(((localData.joursEcoules || 0) / (localData.dureeIncubation || 21)) * 100),
          eclosionPeriode: (localData.dureeIncubation || 21) - (localData.joursEcoules || 0)
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

