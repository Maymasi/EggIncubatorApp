import { View ,Switch,StyleSheet,Text,TouchableOpacity} from "react-native";
import { COLORS} from '../../../constants/theme';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useState } from "react";

export default function CouveuseParam(){
    const [isActive, setActive] = useState(false);
    return(
        <View>
            <View style={styles.Container}>
                <View style={[styles.principaleIcon,{backgroundColor:"#f3e5f5"}]}>
                    <Ionicons name="notifications-outline" size={24} color={COLORS.purple} />
                </View>
                <View>
                    <Text style={styles.PrincipaleTitle}>Activer les notifications</Text>
                    <Text style={styles.secondaryTitle}>Recevoir des alertes en cas de problème</Text>
                </View>
                <View >
                    <Switch
                        value={isActive}
                        onValueChange={setActive}
                        trackColor={{ false: COLORS.bgBlack20, true: COLORS.purpleLight }} 
                        thumbColor={isActive ? '#fff' : '#f4f3f4'} 
                    />                    
                </View>                
            </View>
            <View style={styles.Container}>
                <View style={[styles.principaleIcon,{backgroundColor:"#ffebee"}]}>
                    <MaterialCommunityIcons name="delete-outline" size={24} color={COLORS.red} />
                </View>
                <View>
                    <Text style={styles.PrincipaleTitle}>Supprimer la couveuse</Text>
                    <Text style={styles.secondaryTitle}>Retirer de l'application</Text>
                </View>
                <TouchableOpacity style={{ borderWidth:1,borderColor:"#f44336",borderRadius: 9999, paddingVertical: 10,paddingHorizontal:15 }}>
                    <Text style={{ color: "#f44336", textAlign: 'center' }}>Supprimer</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    principaleIcon : {
        width:50,
        height:50,
        display:"flex",
        justifyContent:"center",
        alignItems:"center",
        borderRadius:25,
    },   
    Container : {
        height:80,
        backgroundColor:COLORS.white,
        marginTop : 20,
        display: "flex",
        flexDirection:"row",
        justifyContent:"space-between",
        padding:15,
        alignItems:"center",
        borderRadius:20
    },
        PrincipaleTitle:{
        fontSize:18,
        fontWeight:600
    },
    secondaryTitle : {
        fontSize:13,
        color:COLORS.bgBlack30
    },
})