import { View,StyleSheet,Text,ScrollView  } from "react-native";
import {COLORS} from "../../constants/theme"
import HeaderDetails from "../../components/Details/HeaderDetails";
import Localisation from "../../components/Details/Localisation";
import CouveusePart from "../../components/Details/CouveusePart";
export default function Details(){
    return(
        <ScrollView  style={styles.container} contentContainerStyle={{ paddingBottom: 100 }}>
            <HeaderDetails/>
            <Localisation/>
            <CouveusePart/>
        </ScrollView >
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