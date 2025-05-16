import { View, Text, StyleSheet, Switch, ScrollView, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import AntDesign from '@expo/vector-icons/AntDesign';
import { SIZES, COLORS } from '../../../constants/theme';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Ionicons from '@expo/vector-icons/Ionicons';
import ProgressBar from '../ProgressBar';
import { useState, useEffect,useContext } from 'react';
import { listenToCouveuseConfig, updateCouveuseConfig, turnManualStateOn, listenToCouveuseCardData} from '../../../services/couveuseServices';
import { AuthContext } from '../../../contexts/AuthContext';

export default function Controle({ id }) {
    const {user}=useContext(AuthContext);
  const [isAuto, setIsAuto] = useState(false);
  const [isVentilateur, setIsVentilateur] = useState(false);
  const [rotation, setRotation] = useState(false);
  const [cardData, setCardData] = useState({
    eggNumber: 0,
    currentDay: 0,
    totalDays: 21,
    temperature: 0,
    humidity: 0,
    lastRotation: "00:00",
    daysToHatch: 21,
    progress: 0
  });
   useEffect(() => {
    // Remplacez 'currentUserId' par l'ID de l'utilisateur actuel
    const stopListeningCard = listenToCouveuseCardData(user.uid, id, setCardData);
    return () => stopListeningCard();
  }, [id]);
  // Écoute de la config en temps réel
  useEffect(() => {
    const stopListening = listenToCouveuseConfig(id, (config) => {
      if (config) {
        setIsAuto(config.mode === "auto" && config.fanMode === "auto");
        setIsVentilateur(config.fanState === "on");
      }
    });
    return () => stopListening();
  }, [id]);

  // Mode automatique = affecte `mode` ET `fanMode`
  const handleToggleAuto = async (value) => {
    setIsAuto(value);
    await updateCouveuseConfig(id, {
      mode: value ? "auto" : "manual",
      fanMode: value ? "auto" : "manual"
    });
  };

  // Switch ventilateur seul
  const handleToggleFan = async (value) => {
    setIsVentilateur(value);
    await updateCouveuseConfig(id, { fanState: value ? "on" : "off" });
  };

  // Bouton Tourner Maintenant
  const handleRotation = async () => {
    try {
      await turnManualStateOn(id); // met manualState: "on" si besoin
      setRotation(true);
    } catch (error) {
      console.error("Erreur lors de l'activation de la rotation :", error);
    }
  };

  // Désactive les contrôles manuels si mode auto activé
  const isAutoMode = isAuto;

  return (
     <ScrollView style={{ flex: 1 }}>
      <View style={styles.card}>
        <View style={styles.topCard}>
          <View style={styles.topTopCard}>
            <Text style={{ backgroundColor: COLORS.bgWhite30, padding: 10, borderRadius: 9999, color: COLORS.white }}>
              {cardData.eggNumber} œufs
            </Text>
            <View style={{ flexDirection: "row", gap: 5, alignItems: "center", paddingHorizontal: 14, paddingVertical: 4, backgroundColor: COLORS.bgWhite30, borderRadius: 9999 }}>
              <MaterialCommunityIcons name="calendar-blank" size={24} color={COLORS.white} />
              <Text style={{ color: COLORS.white }}>Jour {cardData.currentDay}/{cardData.totalDays}</Text>
            </View>
          </View>
          <View style={styles.infoCard}>
            <View style={{ flexDirection: "row", gap: 10 }}>
              <View style={[styles.iconStyle, { backgroundColor: COLORS.orange }]}>
                <FontAwesome6 name="temperature-half" size={18} color={COLORS.white} />
              </View>
              <View >
                <Text style={{ color: COLORS.white }}>Température</Text>
                <Text style={{ color: COLORS.white, fontWeight: 900, fontSize: SIZES.large }}>{cardData.temperature}°C</Text>
              </View>
            </View>
            <View style={{ flexDirection: "row", gap: 10 }}>
              <View style={[styles.iconStyle, { backgroundColor: COLORS.blue }]}>
                <MaterialCommunityIcons name="water-check-outline" size={24} color={COLORS.white} />
              </View>
              <View>
                <Text style={{ color: COLORS.white }}>Humidité</Text>
                <Text style={{ color: COLORS.white, fontWeight: 900, fontSize: SIZES.large }}>{cardData.humidity}%</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.bottomCard}>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 7 }}>
              <AntDesign name="clockcircleo" size={18} color={COLORS.bgBlack30} />
              <Text style={{ fontSize: SIZES.large, color: COLORS.bgBlack30, fontWeight: 600 }}>
                Dernière rotation: {cardData.lastRotation}
              </Text>
            </View>
            <Text style={{ fontSize: 14, color: COLORS.greenSecondary, fontWeight: 700 }}>
              Éclosion dans {cardData.daysToHatch} jours
            </Text>
          </View>
          <View>
            <ProgressBar progress={cardData.progress} />
          </View>
        </View>
      </View>

      {/* Mode Automatique */}
      <View style={styles.ModeAutomatique}>
        <View style={[styles.principaleIcon, { backgroundColor: COLORS.greenSecondary }]}>
          <AntDesign name="poweroff" size={22} color={COLORS.white} />
        </View>
        <View>
          <Text style={styles.PrincipaleTitle}>Mode Automatique</Text>
          <Text style={styles.secondaryTitle}>Contrôle automatique des paramètres</Text>
        </View>
        <Switch
          value={isAuto}
          onValueChange={handleToggleAuto}
          trackColor={{ false: COLORS.bgBlack20, true: COLORS.greenSecondary }}
          thumbColor={isAuto ? '#fff' : '#f4f3f4'}
        />
      </View>

      {/* Contrôle manuel */}
      <View style={styles.ControleMan}>
        <View style={styles.ventilateur}>
          <View style={[styles.principaleIcon, { backgroundColor: COLORS.blue }]}>
            <FontAwesome5 name="fan" size={22} color={COLORS.white} />
          </View>
          <View>
            <Text style={styles.PrincipaleTitle}>Ventilateur</Text>
            <Text style={styles.secondaryTitle}>Contrôle de la circulation d'air</Text>
          </View>
          <Switch
            value={isVentilateur}
            onValueChange={handleToggleFan}
            trackColor={{ false: COLORS.bgBlack20, true: COLORS.bgGradientBlue }}
            thumbColor={isVentilateur ? '#fff' : '#f4f3f4'}
            disabled={isAutoMode}
          />
        </View>

        <View style={styles.RotationOeuf}>
          <View style={[styles.principaleIcon, { backgroundColor: COLORS.purple }]}>
            <Ionicons name="refresh" size={20} color={COLORS.white} />
          </View>
          <View>
            <Text style={styles.PrincipaleTitle}>Rotation des Œufs</Text>
            <Text style={styles.secondaryTitle}>Tourner manuellement les œufs</Text>
          </View>
        </View>
        <TouchableOpacity
          style={{ backgroundColor: COLORS.purple, padding: 17, justifyContent: "center", alignItems: "center", borderRadius: 20, opacity: isAutoMode ? 0.5 : 1 }}
          onPress={handleRotation}
          disabled={isAutoMode}
        >
          <Text style={{ color: COLORS.white, fontSize: SIZES.large, fontWeight: 700 }}>Tourner Maintenant</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
    // backgroundColor:"blue"
  },
  card: {
    height: 240,
    // backgroundColor:"yellow",
    borderRadius: 20,
    overflow: 'hidden',
    marginTop: 20
  },
  topCard: {
    height: "65%",
    backgroundColor: COLORS.bgBlack20,
    display: "flex",
    justifyContent: "space-between",
    padding: 20,
    overflow: 'hidden'
  },
  topTopCard: {
    display: 'flex',
    flexDirection: "row",
    justifyContent: "space-between"
  },
  infoCard: {
    display: 'flex',
    flexDirection: "row",
    justifyContent: "start",
    gap: 40,
    backgroundColor: COLORS.bgWhite20,
    padding: 10,
    borderRadius: 9999
  },
  bottomCard: {
    backgroundColor: COLORS.white,
    overflow: 'hidden',
    padding: 20
  },
  iconStyle: {
    width: 40,
    height: 40,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25
  },
  ModeAutomatique: {
    height: 100,
    backgroundColor: COLORS.white,
    marginTop: 20,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    alignItems: "center",
    borderRadius: 20
  },
  principaleIcon: {
    width: 50,
    height: 50,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
  },
  PrincipaleTitle: {
    fontSize: SIZES.xLarge,
    fontWeight: 600
  },
  secondaryTitle: {
    fontSize: SIZES.medium,
    color: COLORS.bgBlack30
  },
  ventilateur: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  RotationOeuf: {
    display: "flex",
    flexDirection: "row",
    gap: 40,
    alignItems: "center"
  },
  ControleMan: {
    backgroundColor: COLORS.white,
    marginTop: 20,
    padding: 20,
    borderRadius: 20,
    display: "flex",
    gap: 20
  }
});
