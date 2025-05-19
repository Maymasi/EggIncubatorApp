import { View, Text, StyleSheet, Dimensions, FlatList, TouchableOpacity } from "react-native";
import { LineChart } from 'react-native-chart-kit';
import { SIZES, COLORS } from '../../../constants/theme';
import DropDownPicker from 'react-native-dropdown-picker';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { listenToHistoriqueData } from '../../../services/historiqueService';
import { AuthContext } from "../../../contexts/AuthContext";
import React, { useState, useEffect, useContext } from "react";

const screenWidth = Dimensions.get("window").width;

const chartConfigTemp = {
  backgroundGradientFrom: COLORS.white,
  backgroundGradientTo: COLORS.white,
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  labelColor: (opacity = 0.1) => `rgba(0, 0, 0, ${opacity})`,
  propsForDots: { r: "5", strokeWidth: "2", stroke: COLORS.orange, fill: COLORS.white },
  propsForBackgroundLines: { stroke: COLORS.bgBlack10 },
  backgroundColor: COLORS.white,
  fillShadowGradient: "transparent",
  fillShadowGradientOpacity: 0,
};

const chartConfigHum = {
  ...chartConfigTemp,
  propsForDots: { r: "0" },
};

const eventIcons = {
  alert: <Feather name="alert-triangle" size={24} color={COLORS.red} />,
  rotation: <FontAwesome6 name="arrow-rotate-right" size={24} color={COLORS.greenSecondary} />,
  ventilateur: <FontAwesome5 name="fan" size={24} color={COLORS.blue} />,
  humidité: <MaterialCommunityIcons name="water-check-outline" size={26} color={COLORS.blue} />,
  température: <FontAwesome6 name="temperature-half" size={24} color={COLORS.orange} />
};

const getBackgroundColor = (type) => {
  switch (type) {
    case "alert": return COLORS.red + '20';
    case "rotation": return COLORS.greenSecondary + '20';
    case "ventilateur": return COLORS.blue + '20';
    case "humidité": return COLORS.blue + '20';
    case "température": return COLORS.orange + '20';
    default: return COLORS.bgBlack10;
  }
};

// Fonction pour formater une date timestamp en format lisible
const formatDate = (timestamp) => {
  if (!timestamp) return "Non définie";
  
  const date = new Date(Number(timestamp));
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Fonction pour calculer le nombre de jours écoulés depuis le début de l'incubation
const calculateDaysSinceIncubation = (timestamp) => {
  if (!timestamp) return 0;
  
  const startDate = new Date(Number(timestamp));
  const currentDate = new Date();
  const diffTime = Math.abs(currentDate - startDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

export default function Historique() {
  const [showAllEvents, setShowAllEvents] = useState(false);
  const { user } = useContext(AuthContext);
  const [alertes, setAlertes] = useState([]);
  const [actions, setActions] = useState([]);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("Toutes les couveuses");
  const [items, setItems] = useState([]);
  const [dataTemp, setDataTemp] = useState({ labels: ["S1", "S2", "S3", "S4"], datasets: [{ data: [] }] });
  const [dataHum, setDataHum] = useState({ labels: ["S1", "S2", "S3", "S4"], datasets: [{ data: [] }] });
  const [incubationStartDates, setIncubationStartDates] = useState({});
  const [timeRange, setTimeRange] = useState('week'); // 'day', 'week', 'month'
  
  // Nouveaux états pour le sélecteur d'événements
  const [eventTypeOpen, setEventTypeOpen] = useState(false);
  const [eventTypeValue, setEventTypeValue] = useState("alert");
  const [eventTypeItems, setEventTypeItems] = useState([
    { label: 'Alertes', value: 'alert' },
    { label: 'Actions', value: 'action' }
  ]);

  useEffect(() => {
    if (!user?.uid) return;

    const unsubscribe = listenToHistoriqueData(user.uid, ({
      historiqueTemp,
      historiqueHum,
      evenements,
      listeCouveuses,
      couveusesGereses // Récupération de la structure couveusesGereses depuis Firebase
    }) => {
      // Séparation des événements en alertes et actions
      const newAlertes = [];
      const newActions = [];
      
      (evenements || []).forEach(event => {
        if (event.type === 'alert') {
          newAlertes.push(event);
        } else {
          newActions.push(event);
        }
      });

      setAlertes(newAlertes);
      setActions(newActions);

      // Mise à jour de la liste des couveuses et des dates de début d'incubation
      const newItems = [
        { label: 'Toutes les couveuses', value: 'Toutes les couveuses' },
        ...(listeCouveuses || []).map(n => ({ label: n.nom, value: n.id }))
      ];
      setItems(newItems);
      
      // Stockage des dates de début d'incubation pour chaque couveuse
      const datesMap = {};
    if (couveusesGereses) {
      Object.keys(couveusesGereses).forEach(incubatorId => {
        const incubatorData = couveusesGereses[incubatorId];
        if (incubatorData?.dateAjout) {
          datesMap[incubatorId] = incubatorData.dateAjout;
        }
      });
    }
      setIncubationStartDates(datesMap);
      
      updateChartData(value, historiqueTemp || {}, historiqueHum || {}, timeRange);
    });

    return () => unsubscribe();
  }, [user?.uid, value, timeRange]);

  const updateChartData = (selectedValue, tempData, humData, selectedTimeRange) => {
    // Définir les labels en fonction de la plage de temps sélectionnée
    let labels;
    let dataLength;
    
    switch(selectedTimeRange) {
      case 'day':
        labels = ["6h", "12h", "18h", "24h"];
        dataLength = 4;
        break;
      case 'month':
        labels = ["S1", "S2", "S3", "S4"];
        dataLength = 4;
        break;
      case 'week':
      default:
        labels = ["J1", "J2", "J3", "J4", "J5", "J6", "J7"];
        dataLength = 7;
        break;
    }

    const getLimitedData = (arr) => {
      const limitedArr = arr.slice(0, dataLength);
      // Si nous avons moins de données que nécessaire, remplir avec des valeurs null
      while (limitedArr.length < dataLength) {
        limitedArr.push({ value: null });
      }
      return limitedArr.map(p => p?.value || null);
    };

    if (selectedValue === 'Toutes les couveuses') {
      const allTempPoints = Object.values(tempData).flat();
      const allHumPoints = Object.values(humData).flat();

      setDataTemp({
        labels,
        datasets: [{ data: getLimitedData(allTempPoints), color: () => COLORS.orange, strokeWidth: 2 }]
      });

      setDataHum({
        labels,
        datasets: [{ data: getLimitedData(allHumPoints), color: () => COLORS.blue, strokeWidth: 2 }]
      });
    } else {
      const tempPoints = tempData[selectedValue] || [];
      const humPoints = humData[selectedValue] || [];

      setDataTemp({
        labels,
        datasets: [{ data: getLimitedData(tempPoints), color: () => COLORS.orange, strokeWidth: 2 }]
      });

      setDataHum({
        labels,
        datasets: [{ data: getLimitedData(humPoints), color: () => COLORS.blue, strokeWidth: 2 }]
      });
    }
  };

  const filteredAlertes = value === "Toutes les couveuses"
    ? alertes
    : alertes.filter(n => n.incubatorId === value);

  const filteredActions = value === "Toutes les couveuses"
    ? actions
    : actions.filter(n => n.incubatorId === value);

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <View style={[styles.icon, { backgroundColor: getBackgroundColor(item.type) }]}>
        {eventIcons[item.type]}
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.content}>{item.message}</Text>
        <Text style={styles.couveuse}>{item.incubator} • {item.time}</Text>
      </View>
    </View>
  );

  // Obtenir la date de début d'incubation pour la couveuse sélectionnée
  const selectedIncubationDate = value !== "Toutes les couveuses" 
    ? incubationStartDates[value]
    : null;

  // Options pour la sélection de la plage de temps
  const timeRangeOptions = [
    { label: 'Jour', value: 'day' },
    { label: 'Semaine', value: 'week' },
    { label: 'Mois', value: 'month' }
  ];

  return (
    <View>
      <View style={styles.SelectCard}>
        <Text style={styles.titleCard}>Sélectionner une couveuse</Text>
        <View style={styles.selectContainer}>
          <DropDownPicker
            open={open}
            value={value}
            items={items}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setItems}
            listMode="SCROLLVIEW"
            dropDownDirection="BOTTOM"
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownContainer}
            textStyle={{ fontSize: 16, color: COLORS.black }}
            labelStyle={{ fontWeight: 500 }}
          />
        </View>
      </View>

      <View style={styles.cardRepere}>
        <Text style={{ fontSize: SIZES.xLarge, fontWeight: 'bold', marginBottom: 15 }}>
          Historique: {items.find(i => i.value === value)?.label || value}
        </Text>
        
        {value !== "Toutes les couveuses" && selectedIncubationDate && (
          <View style={styles.incubationInfoContainer}>
            <View style={styles.incubationInfoItem}>
              <Text style={styles.incubationInfoLabel}>Début d'incubation:</Text>
              <Text style={styles.incubationInfoValue}>{formatDate(selectedIncubationDate)}</Text>
            </View>
            <View style={styles.incubationInfoItem}>
              <Text style={styles.incubationInfoLabel}>Durée:</Text>
              <Text style={styles.incubationInfoValue}>{calculateDaysSinceIncubation(selectedIncubationDate)} jours</Text>
            </View>
          </View>
        )}

        <View style={styles.timeRangeContainer}>
          {timeRangeOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.timeRangeButton,
                timeRange === option.value && styles.timeRangeButtonActive
              ]}
              onPress={() => setTimeRange(option.value)}
            >
              <Text style={[
                styles.timeRangeText,
                timeRange === option.value && styles.timeRangeTextActive
              ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        
        <View>
          <Text style={{ marginBottom: 10, color: COLORS.bgBlack40 }}>Température (°C)</Text>
          <LineChart
            data={dataTemp}
            width={screenWidth - 10}
            height={220}
            chartConfig={chartConfigTemp}
            bezier
            withShadow={false}
            style={{ borderRadius: 15 }}
          />
        </View>
        <View style={{ marginTop: 20 }}>
          <Text style={{ marginBottom: 10, color: COLORS.bgBlack40 }}>Humidité (%)</Text>
          <LineChart
            data={dataHum}
            width={screenWidth - 10}
            height={220}
            chartConfig={chartConfigHum}
            bezier
            withShadow={false}
            style={{ borderRadius: 15 }}
          />
        </View>
      </View>

    <View style={styles.notificationContainer}>
      <View style={{ flexDirection: 'column', justifyContent: 'space-between', alignItems: 'start', marginBottom: 15, gap: SIZES.medium }}>
        <Text style={{ fontSize: 21, fontWeight: 600 }}>Événements récents</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: SIZES.medium }}>
          <View style={{ width: 150 }}>
            <DropDownPicker
              open={eventTypeOpen}
              value={eventTypeValue}
              items={eventTypeItems}
              setOpen={setEventTypeOpen}
              setValue={setEventTypeValue}
              setItems={setEventTypeItems}
              listMode="SCROLLVIEW"
              dropDownDirection="BOTTOM"
              style={[styles.dropdown, { height: 40 }]}
              dropDownContainerStyle={[styles.dropdownContainer, { width: 150 }]}
              textStyle={{ fontSize: 14 }}
            />
          </View>
          {((eventTypeValue === 'alert' && filteredAlertes.length > 5) || 
            (eventTypeValue === 'action' && filteredActions.length > 5)) && (
            <TouchableOpacity 
              onPress={() => setShowAllEvents(!showAllEvents)}
              style={styles.showAllButton}
            >
              <Text style={styles.showAllText}>
                {showAllEvents ? 'Voir moins' : 'Voir tout'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {eventTypeValue === 'alert' ? (
        filteredAlertes.length > 0 ? (
          <>
            <FlatList
              data={showAllEvents ? filteredAlertes : filteredAlertes.slice(0, 5)}
              keyExtractor={item => item.id}
              renderItem={renderItem}
              ListFooterComponent={
                filteredAlertes.length > 5 && !showAllEvents ? (
                  <TouchableOpacity 
                    onPress={() => setShowAllEvents(true)}
                    style={styles.seeMoreContainer}
                  >
                    <Text style={styles.seeMoreText}>
                      +{filteredAlertes.length - 5} autres alertes
                    </Text>
                  </TouchableOpacity>
                ) : null
              }
            />
            {showAllEvents && filteredAlertes.length > 5 && (
              <TouchableOpacity 
                onPress={() => setShowAllEvents(false)}
                style={styles.seeMoreContainer}
              >
                <Text style={styles.seeMoreText}>Réduire la liste</Text>
              </TouchableOpacity>
            )}
          </>
        ) : (
          <Text style={{ fontStyle: 'italic', color: COLORS.bgBlack30 }}>
            Aucune alerte récente
          </Text>
        )
      ) : (
        filteredActions.length > 0 ? (
          <>
            <FlatList
              data={showAllEvents ? filteredActions : filteredActions.slice(0, 5)}
              keyExtractor={item => item.id}
              renderItem={renderItem}
              ListFooterComponent={
                filteredActions.length > 5 && !showAllEvents ? (
                  <TouchableOpacity 
                    onPress={() => setShowAllEvents(true)}
                    style={styles.seeMoreContainer}
                  >
                    <Text style={styles.seeMoreText}>
                      +{filteredActions.length - 5} autres actions
                    </Text>
                  </TouchableOpacity>
                ) : null
              }
            />
            {showAllEvents && filteredActions.length > 5 && (
              <TouchableOpacity 
                onPress={() => setShowAllEvents(false)}
                style={styles.seeMoreContainer}
              >
                <Text style={styles.seeMoreText}>Réduire la liste</Text>
              </TouchableOpacity>
            )}
          </>
        ) : (
          <Text style={{ fontStyle: 'italic', color: COLORS.bgBlack30 }}>
            Aucune action récente
          </Text>
        )
      )}
    </View>
    </View>
  );
}

const styles = StyleSheet.create({
  SelectCard: {
    backgroundColor: COLORS.white,
    borderRadius: 19,
    height: 90,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 13,
    alignItems: "center",
    marginTop: 20
  },
  titleCard: {
    fontSize: 18,
    fontWeight: '600',
    width: "40%"
  },
  selectContainer: {
    width: "60%"
  },
  dropdown: {
    borderWidth: 1,
    borderColor: COLORS.bgBlack10,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    height: 45,
    paddingHorizontal: 12,
    zIndex: 1000,
  },
  dropdownContainer: {
    borderWidth: 1,
    borderColor: COLORS.bgBlack10,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    zIndex: 999,
    marginTop: 0,
  },
  cardRepere: {
    backgroundColor: COLORS.white,
    padding: 15,
    borderRadius: 15,
    overflow: "hidden",
    marginTop: 20
  },
  incubationInfoContainer: {
    backgroundColor: COLORS.bgBlack5,
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  incubationInfoItem: {
    flexDirection: 'column',
  },
  incubationInfoLabel: {
    fontSize: 14,
    color: COLORS.bgBlack40,
    marginBottom: 4
  },
  incubationInfoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.black
  },
  timeRangeContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.bgBlack5,
    borderRadius: 20,
    marginBottom: 20,
    padding: 3,
  },
  timeRangeButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 18,
  },
  timeRangeButtonActive: {
    backgroundColor: COLORS.white,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  timeRangeText: {
    fontSize: 14,
    color: COLORS.bgBlack40,
  },
  timeRangeTextActive: {
    fontWeight: '600',
    color: COLORS.black,
  },
  notificationContainer: {
    backgroundColor: "white",
    padding: 20,
    marginTop: 20,
    borderRadius: 20,
    marginBottom: 20
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginVertical: 7,
  },
  content: {
    fontSize: 18,
    fontWeight: '600'
  },
  couveuse: {
    color: COLORS.bgBlack30
  },
  icon: {
    height: 50,
    width: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center"
  },
    seeMoreContainer: {
    padding: 10,
    alignItems: 'center',
    marginTop: 5,
  },
  seeMoreText: {
    color: COLORS.blue,
    fontWeight: '600',
    fontSize: 14,
  },
  showAllButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: COLORS.bgBlack5,
    borderRadius: 20,
  },
  showAllText: {
    color: COLORS.blue,
    fontWeight: '600',
    fontSize: 14,
  },

  textContainer: {}
  
});
