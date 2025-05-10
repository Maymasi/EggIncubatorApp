import { View,StyleSheet,Text, Pressable,TouchableOpacity  } from "react-native";
import { useState } from "react";
import {COLORS,SIZES} from "../../constants/theme";
import Ionicons from '@expo/vector-icons/Ionicons';
export default function HeaderDetails(){
    const [hovered, setHovered] = useState(false);
    const [notifVal , setnotifVal] = useState(3);
    const [userName, setUserName]= useState("Pierre Dupont");
    return(
        <View style={styles.container}>
            <View style={styles.containerInfo}>
                <View style={styles.pdp}>
                </View>
                <View>
                    <Text style={{color:COLORS.bgWhite80,fontWeight:400,fontSize:SIZES.large}}>Bonjour</Text>
                    <Text style={styles.name}>{userName}</Text>
                </View>
            </View>
            <View style={styles.notification}>
                <TouchableOpacity
                    style={styles.notifContainer}
                    activeOpacity={0.4}
                >
                    <Ionicons name="notifications-outline" color="white" size={25}/>
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>{notifVal}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        height:120,
        width:"100%",
        display:"flex",
        flexDirection:"row",
        justifyContent:"space-between",
        // backgroundColor:"red"
    },
    containerInfo : {
        height:"100%",
        width:"52%",
        // backgroundColor:COLORS.gray,
        display:"flex",
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"center"
    },
    pdp : {
        backgroundColor:COLORS.grayLight,
        height:60,
        width:60,
        borderRadius:"50%"
    },
    name:{
        fontSize:SIZES.xLarge,
        fontWeight:700,
        color:COLORS.bgWhite80
    },
    notification : {
        display:"flex",
        alignItems:"flex-end",
        justifyContent:"center",
        height:"fit-content",
    },
    notifContainer : {
        backgroundColor:COLORS.bgBlack10,
        padding:10,
        borderRadius:"50%"
    },
    badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    },
    badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    },
})