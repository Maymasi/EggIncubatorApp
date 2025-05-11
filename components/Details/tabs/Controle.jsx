import { View, Text, StyleSheet,Switch ,ScrollView,TouchableOpacity} from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import AntDesign from '@expo/vector-icons/AntDesign';
import { SIZES ,COLORS} from '../../../constants/theme';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Ionicons from '@expo/vector-icons/Ionicons';
import ProgressBar from '../ProgressBar';
import { useState } from 'react';
// import { Button } from '@mui/material';
export default function Controle(){
    const [isAuto, setIsAuto] = useState(false);
    const [isVentilateur, setIsVentilateur] = useState(false);
    const [rotation , setRotation] = useState(false);
    // handlers
    const handleRotation= ()=>{
        setRotation(true)
    }
    return(
        <ScrollView style={{ flex: 1 }} >
            <View style={styles.card}>
                <View style={styles.topCard}>
                    <View style={styles.topTopCard}>
                        <Text style={{backgroundColor:COLORS.bgWhite30,padding:10,borderRadius:9999,color:COLORS.white}}>12 œufs</Text>
                        <View style={{display:"flex",flexDirection:"row",gap:5,alignItems:"center",paddingHorizontal:14,paddingVertical:4,backgroundColor:COLORS.bgWhite30,borderRadius:9999}}>
                            <MaterialCommunityIcons name="calendar-blank" size={24} color={COLORS.white} />
                            <Text style={{color:COLORS.white}}>Jour 9/21</Text>
                        </View>
                    </View>
                    <View style={styles.infoCard}>
                        <View style={{display:"flex",flexDirection:"row",gap:10}}>
                            <View style={[styles.iconStyle,{backgroundColor:COLORS.orange}]}>
                                <FontAwesome6 name="temperature-half" size={18} color={COLORS.white} />
                            </View>
                            <View >
                                <Text style={{color:COLORS.white}}>Température</Text>
                                <Text style={{color:COLORS.white,fontWeight:900,fontSize:SIZES.large}}>37.3°C</Text>
                            </View>
                        </View>
                        <View style={{display:"flex",flexDirection:"row",gap:10}}>
                            <View style={[styles.iconStyle,{backgroundColor:COLORS.blue}]}>
                                <MaterialCommunityIcons name="water-check-outline" size={24} color={COLORS.white} />
                            </View>
                            <View>
                                <Text style={{color:COLORS.white}}>Humidité</Text>
                                <Text style={{color:COLORS.white,fontWeight:900,fontSize:SIZES.large}}>65%</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={styles.bottomCard}>
                    <View style={{display:"flex",flexDirection:"row",justifyContent:"space-between"}}>
                        <View style={{display:"flex",flexDirection:"row",alignItems:"center",gap:7}}>
                            <AntDesign name="clockcircleo" size={18} color={COLORS.bgBlack30} />
                            <Text style={{fontSize:SIZES.large,color:COLORS.bgBlack30,fontWeight:600}}>Dernière rotation: 14:30</Text>
                        </View>
                        <Text style={{fontSize:14,color:COLORS.greenSecondary,fontWeight:700}}>Éclosion dans 12 jours</Text>
                    </View>
                    <View>
                        <ProgressBar progress={0.6}/>
                    </View>
                </View>
            </View>
            <View style={styles.ModeAutomatique}>
                <View style={[styles.principaleIcon,{backgroundColor:COLORS.greenSecondary}]}>
                    <AntDesign name="poweroff" size={22} color={COLORS.white} />
                </View>
                <View>
                    <Text style={styles.PrincipaleTitle}>Mode Automatique</Text>
                    <Text style={styles.secondaryTitle}>Contrôle automatique des paramètres</Text>
                </View>
                <View >
                    <Switch
                        value={isAuto}
                        onValueChange={setIsAuto}
                        trackColor={{ false: COLORS.bgBlack20, true: COLORS.greenSecondary }} 
                        thumbColor={isAuto ? '#fff' : '#f4f3f4'} 
                    />                    
                </View>
            </View>
            <View style={styles.ControleMan}>
                <View style={styles.ventilateur}>
                    <View style={[styles.principaleIcon,{backgroundColor:COLORS.blue}]}>
                        <FontAwesome5 name="fan" size={22} color={COLORS.white} />
                    </View>
                    <View>
                        <Text style={styles.PrincipaleTitle}>Ventilateur</Text>
                        <Text style={styles.secondaryTitle}>Contrôle de la circulation d'air</Text>
                    </View>
                    <View >
                        <Switch
                            value={isVentilateur}
                            onValueChange={setIsVentilateur}
                            trackColor={{ false: COLORS.bgBlack20, true: COLORS.bgGradientBlue}} 
                            thumbColor={isVentilateur ? '#fff' : '#f4f3f4'} 
                        />                    
                    </View>
                </View>
                <View style={styles.RotationOeuf}>
                    <View style={[styles.principaleIcon,{backgroundColor:COLORS.purple}]}>
                        <Ionicons name="refresh" size={20} color={COLORS.white}/>
                    </View>
                    <View>
                        <Text style={styles.PrincipaleTitle}>Rotation des Œufs</Text>
                        <Text style={styles.secondaryTitle}>Tourner manuellement les œufs</Text>
                    </View>                    
                </View>
                <TouchableOpacity style={{ backgroundColor: COLORS.purple,padding:17,display:"flex",justifyContent:"center",alignItems:"center",borderRadius:20 }} onClick={handleRotation}>
                    <Text style={{color:COLORS.white,fontSize:SIZES.large,fontWeight:700}}>Tourner Maintenant</Text>
                </TouchableOpacity>
            </View>            
        </ScrollView>
    );
}
const styles = StyleSheet.create({
    container : {
        flex: 1
        // backgroundColor:"blue"
    },
    card :{
        height:240,
        // backgroundColor:"yellow",
        borderRadius:20,
        overflow:'hidden',
        marginTop : 20
    },
    topCard:{
        height:"65%",
        backgroundColor:COLORS.bgBlack20,
        display:"flex",
        justifyContent:"space-between",
        padding:20,
        overflow:'hidden'
    },
    topTopCard:{
        display:'flex',
        flexDirection:"row",
        justifyContent:"space-between"
    },
    infoCard:{
        display:'flex',
        flexDirection:"row",
        justifyContent:"start",
        gap:40,
        backgroundColor:COLORS.bgWhite20,
        padding:10,
        borderRadius:9999
    },
    bottomCard : {
        backgroundColor:COLORS.white,
        overflow:'hidden',
        padding:20
    },
    iconStyle : {
        width:40,
        height:40,
        display:"flex",
        justifyContent:"center",
        alignItems:"center",
        borderRadius:25
    },
    ModeAutomatique : {
        height:100,
        backgroundColor:COLORS.white,
        marginTop : 20,
        display: "flex",
        flexDirection:"row",
        justifyContent:"space-between",
        padding:20,
        alignItems:"center",
        borderRadius:20
    },
    principaleIcon : {
        width:50,
        height:50,
        display:"flex",
        justifyContent:"center",
        alignItems:"center",
        borderRadius:25,
    },
    PrincipaleTitle:{
        fontSize:SIZES.xLarge,
        fontWeight:600
    },
    secondaryTitle : {
        fontSize:SIZES.medium,
        color:COLORS.bgBlack30
    },
    ventilateur:{
        display:"flex",
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"center"
    },
    RotationOeuf:{
        display:"flex",
        flexDirection:"row",
        gap:40,
        alignItems:"center"
    },
    ControleMan:{
        backgroundColor:COLORS.white,
        marginTop:20,
        padding:20,
        borderRadius:20,
        display:"flex",
        gap:20
    }
})