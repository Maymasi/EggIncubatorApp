import { View, Text, StyleSheet, Dimensions, FlatList } from "react-native";
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

export default function Historique() {
  const { user } = useContext(AuthContext);
  const [alertes, setAlertes] = useState([]);
  const [actions, setActions] = useState([]);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("Toutes les couveuses");
  const [items, setItems] = useState([]);
  const [dataTemp, setDataTemp] = useState({ labels: ["S1", "S2", "S3", "S4"], datasets: [{ data: [] }] });
  const [dataHum, setDataHum] = useState({ labels: ["S1", "S2", "S3", "S4"], datasets: [{ data: [] }] });
  
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
      listeCouveuses
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

      // Mise à jour de la liste des couveuses
      const newItems = [
        { label: 'Toutes les couveuses', value: 'Toutes les couveuses' },
        ...(listeCouveuses || []).map(n => ({ label: n.nom, value: n.id }))
      ];
      setItems(newItems);
      updateChartData(value, historiqueTemp || {}, historiqueHum || {});
    });

    return () => unsubscribe();
  }, [user?.uid, value]);

  const updateChartData = (selectedValue, tempData, humData) => {
    const getLimitedData = (arr) => arr.slice(0, 4).map(p => p.value);

    if (selectedValue === 'Toutes les couveuses') {
      const allTempPoints = Object.values(tempData).flat();
      const allHumPoints = Object.values(humData).flat();

      setDataTemp({
        labels: ["S1", "S2", "S3", "S4"],
        datasets: [{ data: getLimitedData(allTempPoints), color: () => COLORS.orange, strokeWidth: 2 }]
      });

      setDataHum({
        labels: ["S1", "S2", "S3", "S4"],
        datasets: [{ data: getLimitedData(allHumPoints), color: () => COLORS.blue, strokeWidth: 2 }]
      });
    } else {
      const tempPoints = tempData[selectedValue] || [];
      const humPoints = humData[selectedValue] || [];

      setDataTemp({
        labels: ["S1", "S2", "S3", "S4"],
        datasets: [{ data: getLimitedData(tempPoints), color: () => COLORS.orange, strokeWidth: 2 }]
      });

      setDataHum({
        labels: ["S1", "S2", "S3", "S4"],
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
        <Text style={{ fontSize: SIZES.xLarge, fontWeight: 'bold', marginBottom: 30 }}>
          Historique: {items.find(i => i.value === value)?.label || value}
        </Text>
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
        <View style={{ flexDirection: 'column', justifyContent: 'space-between', alignItems: 'start', marginBottom: 15,gap:SIZES.medium }}>
          <Text style={{ fontSize: 21, fontWeight: 600 }}>Événements récents</Text>
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
        </View>

        {eventTypeValue === 'alert' ? (
          filteredAlertes.length > 0 ? (
            <FlatList
              data={filteredAlertes}
              keyExtractor={item => item.id}
              renderItem={renderItem}
            />
          ) : (
            <Text style={{ fontStyle: 'italic', color: COLORS.bgBlack30 }}>
              Aucune alerte récente
            </Text>
          )
        ) : (
          filteredActions.length > 0 ? (
            <FlatList
              data={filteredActions}
              keyExtractor={item => item.id}
              renderItem={renderItem}
            />
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
  textContainer: {}
});