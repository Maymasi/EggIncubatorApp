import {  StyleSheet, FlatList } from "react-native";
import { COLORS } from "../constants/theme";
import HeaderDetails from "../components/Details/HeaderDetails";
import Localisation from "../components/Details/Localisation";
import MesCouveuses from "../components/AccueilSc/MesCouveuses";
const components = [HeaderDetails, Localisation, MesCouveuses];

export default function AccueilScreen() {
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
        backgroundColor:COLORS.greenPrimary,
        flex: 1,
        width:"100%",
        paddingHorizontal:16,
        paddingTop:40    
    }
})