import { View,StyleSheet,Text,TouchableHighlight } from "react-native";
import {COLORS, SIZES} from "../../constants/theme"
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import CustomTabs from "./CustomTabs";
export default function CouveusePart(){
    return (
        <View style={styles.container}>
            <View style={styles.top}>
                <TouchableHighlight 
                    style = {styles.goLeft}
                    underlayColor={COLORS.greenSecondary}
                >
                    <AntDesign name="left" size={13} color={COLORS.white} />
                </TouchableHighlight >
                <Text style={{fontSize:24,fontWeight:700,color:COLORS.white}}>Couveuse Principale</Text>
                <View 
                    style={{padding:7,backgroundColor:COLORS.greenSecondary,borderRadius:"50%"}} 
                >
                    <FontAwesome6 name="check" size={18} color="white" />
                </View>
            </View>
            <CustomTabs/>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        width:"100%",
        flex: 1,
        display:"flex",
        marginTop:20
        // backgroundColor:"blue"
    },
    top : {
        display:"flex",
        flexDirection:"row",
        alignItems : "center",
        gap:10
    },
    goLeft : {
        backgroundColor:COLORS.bgWhite20,
        padding:13,
        borderRadius:"50%"
    }
})