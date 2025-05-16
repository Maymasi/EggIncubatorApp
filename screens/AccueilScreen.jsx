import {  
  StyleSheet, 
  FlatList,
  Dimensions,
  RefreshControl 
} from "react-native";
import { COLORS } from "../constants/theme";
import HeaderDetails from "../components/Details/HeaderDetails";
import Localisation from "../components/Details/Localisation";
import MesCouveuses from "../components/AccueilSc/MesCouveuses";
import { useState } from "react";

const components = [HeaderDetails, Localisation, MesCouveuses];

const { width } = Dimensions.get('window');

export default function AccueilScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); // Clé pour forcer le re-rendu

  const onRefresh = () => {
    setRefreshing(true);
    // Change la clé pour forcer le re-rendu de tous les composants
    setRefreshKey(prevKey => prevKey + 1);
    setRefreshing(false);
  };

  return (
    <FlatList
      key={refreshKey} // Cette clé force le re-rendu du FlatList et ses enfants
      data={components}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item: Component }) => <Component key={refreshKey} />} // Clé aussi sur chaque composant
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 100 }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[COLORS.greenPrimary]}
          tintColor={COLORS.greenPrimary}
        />
      }
    />
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.greenPrimary,
    flex: 1,
    width: width,
    paddingHorizontal: 16,
    paddingTop: 40    
  }
});