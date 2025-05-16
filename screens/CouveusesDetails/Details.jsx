import { View, StyleSheet, Text, FlatList } from "react-native";
import { COLORS } from "../../constants/theme";
import HeaderDetails from "../../components/Details/HeaderDetails";
import Localisation from "../../components/Details/Localisation";
import CouveusePart from "../../components/Details/CouveusePart";
import { useRoute } from "@react-navigation/native"; // ✅ Import du hook

export default function Details() {
    const route = useRoute();
    const { idCouveuse, Name } = route.params || {};

  const components = [
    (props) => <HeaderDetails />,
    (props) => <Localisation  />,
    (props) => <CouveusePart id={idCouveuse} name={Name} {...props} />
  ];

  return (
    <FlatList
      data={components}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item: Component }) => <Component />}
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 100 }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.greenPrimary,
    flex: 1,
    width: "100%",
    paddingHorizontal: 16,
    paddingTop: 40
  }
});
