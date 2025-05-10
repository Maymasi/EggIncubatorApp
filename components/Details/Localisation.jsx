import { View,StyleSheet,Text } from "react-native";
import {COLORS,SIZES} from "../../constants/theme"
import Fontisto from '@expo/vector-icons/Fontisto';
export default function Localisation(){
    return (
        <View style={styles.container}>
            <View style={styles.LeftSide}>
                <View style={styles.MeteoIcn}>
                    <Fontisto name="day-sunny" size={25} color={COLORS.white} />
                </View>
                <View>
                    <Text>ven. 9 mai</Text>
                    <Text style={{fontSize:SIZES.xLarge,fontWeight:700}}>Ferme des Oliviers</Text>
                </View>
            </View>
            <View style={styles.DateEtMeteo}>
                <Text style={{fontSize:SIZES.large,fontWeight:700}}>09:53</Text>
                <Text>Ensoleillé, 24°C</Text>
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        height:80,
        width:"100%",
        backgroundColor : COLORS.white,
        display:"flex",
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"space-between",
        paddingHorizontal:10,
        borderRadius:15
    },
    LeftSide : {
        display:"flex",
        flexDirection:"row",
        gap:10
    },
    MeteoIcn : {
        backgroundColor:COLORS.blue,
        width:50,
        display:"flex",
        justifyContent:"center",
        alignItems:"center",
        height:50,
        borderRadius:"50%"
    },
    DateEtMeteo : {
        display:"flex",
        alignItems:"flex-end",
    }
})