import { View, StyleSheet, Text, TouchableOpacity, FlatList, Modal, Image } from "react-native";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { SIZES, COLORS } from '../../constants/theme';
import CardCouveuse from "./CardCouveuse";
import LottieView from 'lottie-react-native';
import { useState, useContext, useEffect } from "react";
import AddCouveuse from "./AddCouveuse";
import { AuthContext } from '../../contexts/AuthContext';
import { listenToCouveusesGereesParUser } from '../../services/couveuseServices';

export default function MesCouveuses() {
  const [couveuses, setCouveuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tempMoy, setTempMoy] = useState(0);
  const [humMoy, setHumMoy] = useState(0);
  const [cardAdd, setCardAdd] = useState(false);

  const { user } = useContext(AuthContext);

  const handlevisibleAdd = () => setCardAdd(true);
  const handlemasqueAdd = () => setCardAdd(false);

  useEffect(() => {
    if (!user?.uid) return;

    const stopListening = listenToCouveusesGereesParUser(user.uid, (data) => {
      setCouveuses(data.couveuses);
      setTempMoy(data.tempMoy);
      setHumMoy(data.humMoy);
    });

    return () => {
      stopListening();
    };
  }, [user]);

  // Détection des alertes critiques
  const hasCriticalAlert = couveuses.some(couveuse => couveuse.etat.includes("alerte"));
  const criticalCouveuses = couveuses.filter(c => c.etat.includes("alerte"));

  // Vérifier si la liste des couveuses est vide
  const isEmpty = couveuses.length === 0;

  return (
    <View style={styles.container}>
      <Modal
        visible={cardAdd}
        transparent
        animationType="fade"
        statusBarTranslucent={true}
        onRequestClose={handlemasqueAdd}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={handlemasqueAdd} />
          <View style={styles.modalContent}>
            <AddCouveuse />
          </View>
        </View>
      </Modal>

      {/* Titre et bouton ajout */}
      <View style={styles.top}>
        <Text style={styles.bigTitle}>Mes Couveuses</Text>
        <View style={styles.btnsAddCouveuse}>
          <TouchableOpacity style={styles.scan_Add_Btn} onPress={handlevisibleAdd}>
            <FontAwesome6 name="add" size={20} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Affichage conditionnel basé sur l'état de la liste */}
      {isEmpty ? (
        <View style={styles.emptyContainer}>
          <LottieView
            source={require('../../assets/animation/Animation.json')}
            autoPlay
            loop
            style={styles.emptyAnimation}
          />
          <Text style={styles.emptyTitle}>Aucune couveuse disponible</Text>
          <Text style={styles.emptySubtitle}>
            Ajoutez votre première couveuse en cliquant sur le bouton + en haut de l'écran
          </Text>
          <TouchableOpacity style={styles.addButton} onPress={handlevisibleAdd}>
            <Text style={styles.addButtonText}>Ajouter une couveuse</Text>
            <MaterialIcons name="add-circle-outline" size={20} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={couveuses}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <CardCouveuse
              id={item.id}
              Name={item.name}
              EggNumber={item.eggNumber}
              Etat={item.etat}
              Jour={item.jour}
              Temp={item.temp}
              Hum={item.hum}
              Ventilateur={item.ventilateur}
              Rotation={item.rotation}
              Progress={item.progress}
              EclosionPeriode={item.eclosionPeriode}
            />
          )}
        />
      )}

      {/* Aperçu rapide - seulement affiché quand il y a des couveuses */}
      {!isEmpty && (
        <>
          <Text style={[styles.bigTitle, { marginVertical: 20 }]}>Aperçu Rapide</Text>
          <View style={styles.apercuTop}>
            <View style={styles.apercuLtlCard}>
              <View style={{ flexDirection: "row", gap: 10, alignItems: "center", width: "100%" }}>
                <View style={[styles.iconApercu, { backgroundColor: COLORS.orange }]}>
                  <FontAwesome6 name="temperature-half" size={23} color={COLORS.white} />
                </View>
                <Text style={{ color: COLORS.bgBlack50, fontSize: 16, flexShrink: 1 }}>Température Moy.</Text>
              </View>
              <Text style={{ fontSize: 25, fontWeight: '700', width: "100%" }}>{tempMoy}°C</Text>
            </View>
            <View style={styles.apercuLtlCard}>
              <View style={{ flexDirection: "row", gap: 10, alignItems: "center", width: "100%" }}>
                <View style={[styles.iconApercu, { backgroundColor: COLORS.purple }]}>
                  <MaterialCommunityIcons name="water-check-outline" size={23} color={COLORS.white} />
                </View>
                <Text style={{ color: COLORS.bgBlack50, fontSize: 16, flexShrink: 1 }}>Humidité Moy.</Text>
              </View>
              <Text style={{ fontSize: 25, fontWeight: '700', width: "100%" }}>{humMoy}%</Text>
            </View>
          </View>
        </>
      )}

      {/* Affichage conditionnel des alertes - seulement quand il y a des alertes et des couveuses */}
      {!isEmpty && hasCriticalAlert && (
        <View style={styles.statusCard}>
          <View style={styles.topStatusCard}>
            <Text style={{ color: COLORS.white, fontSize: SIZES.xLarge, fontWeight: '700' }}>
              Alertes Critiques 
            </Text>
          </View>
          <View style={styles.bottomStatusCard}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 19, color: "#d50000", fontWeight: '500', marginBottom: 10 }}>
                Action requise immédiatement.
              </Text>
             
            </View>
            <LottieView
              source={require('../../assets/animation/Animation_Sad.json')}
              autoPlay
              loop
              style={{ width: 100, height: 100 }}
            />
          </View>
        </View>
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  top: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20
  },
  bigTitle: {
    fontSize: 25,
    fontWeight: '700',
    color: COLORS.white
  },
  btnsAddCouveuse: {
    flexDirection: "row",
    gap: 10
  },
  scan_Add_Btn: {
    backgroundColor: COLORS.bgWhite20,
    width: 35,
    height: 35,
    borderRadius: 9999,
    justifyContent: "center",
    alignItems: "center"
  },
  apercuTop: {
    flexDirection: "row",
    gap: 10
  },
  apercuLtlCard: {
    backgroundColor: COLORS.white,
    width: "48%",
    justifyContent: "center",
    alignItems: "center",
    padding: 17,
    gap: 8,
    borderRadius: 12
  },
  iconApercu: {
    width: 45,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 9999
  },
  statusCard: {
    backgroundColor: "white",
    marginVertical: 20,
    borderRadius: 17,
    overflow: "hidden"
  },
  topStatusCard: {
    backgroundColor: "#ff5252",
    padding: 20
  },
  bottomStatusCard: {
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  modalOverlay: {
    position: 'absolute',
    top: 0, bottom: 0, left: 0, right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    position: 'absolute',
    top: 0, bottom: 0, left: 0, right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    zIndex: 10,
    elevation: 10,
    width: '90%',
    borderRadius: 10,
    overflow: 'hidden',
  },
  // Nouveaux styles pour l'état vide
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 20
  },
  emptyAnimation: {
    width: 200,
    height: 200,
    marginBottom: 20
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: 10,
    textAlign: 'center'
  },
  emptySubtitle: {
    fontSize: 16,
    color: COLORS.bgWhite80,
    textAlign: 'center',
    marginBottom: 30
  },
  addButton: {
    backgroundColor: COLORS.bgWhite20,
    flexDirection: 'row',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10
  },
  addButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600'
  }
});