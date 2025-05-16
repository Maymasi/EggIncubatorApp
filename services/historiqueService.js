import { ref, onValue, off } from 'firebase/database';
import { database } from '../config/firebase';

/**
 * Écoute l'historique des mesures et événements des couveuses d'un utilisateur
 * @param {string} userId - ID utilisateur Firebase
 * @param {function} callback - Fonction à appeler avec les données
 * @returns {function} unsubscribe - Fonction pour arrêter l'écoute
 */
export function listenToHistoriqueData(userId, callback) {
  if (!userId) return () => {};

  const userCouveusesRef = ref(database, `users/${userId}/couveusesGereses`);
  const unsubListeners = [];

  const listener = onValue(userCouveusesRef, async (snapshot) => {
    const userCouveuses = snapshot.val();
    if (!userCouveuses) {
      callback({ 
        historiqueTemp: {}, 
        historiqueHum: {}, 
        evenements: [], 
        listeCouveuses: [] 
      });
      return;
    }

    const couveuseIds = Object.keys(userCouveuses);
    const historiqueTemp = {};
    const historiqueHum = {};
    const evenements = [];

    await Promise.all(
      couveuseIds.map(async (id) => {
        const couveuseRef = ref(database, `Couveuses/${id}`);
        const couveuseSnap = await new Promise((resolve) =>
          onValue(couveuseRef, resolve, { onlyOnce: true })
        );
        const data = couveuseSnap.val();
        if (!data) return;

        const mesures = data.history?.mesures || {};
        const actions = data.history?.action || {};
        const alertes = data.alertes || {};

        // Historique température
        historiqueTemp[id] = Object.entries(mesures).map(([ts, val]) => ({
          label: ts.split('_')[1]?.substring(0, 5),
          value: val.temperature || 0,
        }));

        // Historique humidité
        historiqueHum[id] = Object.entries(mesures).map(([ts, val]) => ({
          label: ts.split('_')[1]?.substring(0, 5),
          value: val.humidite || 0,
        }));

        // Alertes
        Object.entries(alertes).forEach(([ts, alert]) => {
          evenements.push({
            id: ts,
            type: 'alert',
            message: `${alert.type}`,
            incubator: userCouveuses[id]?.nom || id,
            incubatorId: id,  // Ajout de l'ID de la couveuse
            time: ts.split('_')[1]?.replace('-', ':') || ''
          });
        });

        // Actions
        Object.entries(actions).forEach(([ts, action]) => {
          if (action.servo === 'rotation') {
            evenements.push({
              id: ts + '_rotation',
              type: 'rotation',
              message: "Rotation effectuée",
              incubator: userCouveuses[id]?.nom || id,
              incubatorId: id,  // Ajout de l'ID de la couveuse
              time: ts.split('_')[1]?.replace('-', ':') || ''
            });
          }
          if (action.ventilateur) {
            evenements.push({
              id: ts + '_ventilateur',
              type: 'ventilateur',
              message: `Ventilateur ${action.ventilateur}`,
              incubator: userCouveuses[id]?.nom || id,
              incubatorId: id,  // Ajout de l'ID de la couveuse
              time: ts.split('_')[1]?.replace('-', ':') || ''
            });
          }
        });
      })
    );

    callback({
      historiqueTemp,
      historiqueHum,
      evenements: evenements.sort((a, b) => b.id.localeCompare(a.id)),
      listeCouveuses: couveuseIds.map(id => ({ 
        id, 
        nom: userCouveuses[id]?.nom || id 
      })),
    });
  });

  unsubListeners.push(() => off(userCouveusesRef));

  return () => unsubListeners.forEach(unsub => unsub());
}
