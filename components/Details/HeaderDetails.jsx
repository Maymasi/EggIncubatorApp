import { View,StyleSheet,Text, Pressable,TouchableOpacity,SafeAreaView  } from "react-native";
import { useState,useContext } from "react";
import {COLORS,SIZES} from "../../constants/theme";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import AntDesign from '@expo/vector-icons/AntDesign';
import { AuthContext } from '../../contexts/AuthContext';
import { useNavigation } from "@react-navigation/native";

export default function HeaderDetails(){
    const { 
  user,           // → { uid, email, displayName, farmName, couveusesGeres... }
  isLoading,      // → true/false
  error,          // → Dernière erreur
  login,          // → (email, password) => Promise
  register,       // → (email, password, fullName, farmName) => Promise
  logout,         // => () => Promise
  refreshUser     // → Force la mise à jour des données
} = useContext(AuthContext);
const navigation=useNavigation();
    const [hovered, setHovered] = useState(false);
    const [notifVal , setnotifVal] = useState(3);
    const [userName, setUserName]= useState("Pierre Dupont");
    return(
        <SafeAreaView style={styles.container}>
            <View style={styles.containerInfo}>
                <View style={styles.pdp}>
                </View>
                <View>
                    <Text style={{color:COLORS.bgWhite80,fontWeight:400,fontSize:SIZES.large}}>Bonjour</Text>
                    <Text style={styles.name}>{user.displayName}</Text>
                </View>
            </View>
            <View style={styles.notification}>
                <TouchableOpacity
                    style={styles.notifContainer}
                    activeOpacity={0.4}
                    onPress={()=>{
                        navigation.navigate('Profile')
                    }}
                >
                    <FontAwesome5 name="user-cog" size={24} color="white" />
                    <View style={styles.badge}>
                        <AntDesign name="dingding" size={13} color="white" />
                    </View>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
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
        alignItems:"center",
        gap:SIZES.x
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
    backgroundColor: COLORS.orange,
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