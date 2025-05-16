import { View, Text, StyleSheet,TouchableOpacity} from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Octicons from '@expo/vector-icons/Octicons';
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { SIZES ,COLORS} from '../../constants/theme';
import ProgressBar from '../Details/ProgressBar';
import Entypo from '@expo/vector-icons/Entypo';
import { useNavigation } from '@react-navigation/native';


const CardCouveuse = ({Name,EggNumber,Etat,Jour,Temp,Hum,Ventilateur,Rotation,Progress,EclosionPeriode,id}) => {
    const navigation =useNavigation();
    return (
        <View>
            <View style={styles.card}>
                <View style={styles.topCard}>
                    <View style={styles.topTopCard}>
                        <View style={{display:"flex",alignItems:"flex-end"}}>
                            <View style={{display:"flex",justifyContent:"center",alignItems:"center",backgroundColor:COLORS.greenSecondary,borderRadius:9999,width:30,height:30}}>
                                <Entypo name="check" size={20} color="white" />
                            </View>
                        </View>
                        <View style={{display:"flex",alignItems:"flex-start",gap:7}}>
                            <Text style={styles.bigTitle}>{Name}</Text>
                            <Text style={{backgroundColor:COLORS.bgWhite30,paddingVertical:6,paddingHorizontal:15,borderRadius:9999,color:COLORS.white}}>{EggNumber} œufs</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.bottomCard}>
                    <View style={{display:"flex",flexDirection:"row",justifyContent:"space-between"}}>
                        <View style={{display:"flex",flexDirection:"row",alignItems:"center",gap:7}}>
                            <Octicons name="dot-fill" size={24} color={COLORS.red} />
                            <Text style={{fontSize:16,color:COLORS.bgBlack40,fontWeight:500}}>{Etat}</Text>
                        </View>
                        <Text style={{fontSize:16,fontWeight:700}}>Jour {Jour}</Text>
                    </View>
                    <View style={{display:"flex",justifyContent:"space-between",flexDirection:"row"}}>
                        <View style={styles.partBottomCard}>
                            <View style={styles.InfoDivContainers}>
                                <FontAwesome6 name="temperature-half" size={24} color={COLORS.orange} />
                                <Text style={styles.txt}>{Temp}°C</Text>                                
                            </View>
                            <View style={[styles.InfoDivContainers, { marginLeft: -4 }]}>
                                <Ionicons name="water-outline" size={24} color={COLORS.blue} />                                
                                <Text style={[styles.txt,{marginLeft:-3}]}>{Hum}%</Text>
                            </View> 
                        </View>
                        <View style={styles.partBottomCard}>   
                            <View style={styles.InfoDivContainers}>
                                <MaterialCommunityIcons name="fan" size={24} color={COLORS.greenSecondary} />
                                <Text style={styles.txt}>{Ventilateur}</Text>
                            </View>                          
                            <View style={styles.InfoDivContainers}>
                                <Ionicons name="refresh" size={24} color={COLORS.purple}/>
                                <Text style={styles.txt}>Rotation: {Rotation}</Text>
                            </View>                          
                        </View>
                    </View>
                    <View style={{marginVertical:10}}>
                        <ProgressBar progress={Progress}/>
                    </View>
                    <View style={{display:"flex",flexDirection:"row",justifyContent:"space-between"}}>
                        <View style={{display:"flex",flexDirection:"row",alignItems:"center",gap:7}}>
                            <FontAwesome6 name="calendar" size={17} color={COLORS.bgBlack50} />
                            <Text style={{fontSize:16,color:COLORS.bgBlack50,fontWeight:400}}>Eclosion dans {EclosionPeriode} jours</Text>
                        </View>
                        <TouchableOpacity style={{display:"flex",flexDirection:"row",alignItems:"center",gap:10}}
                            onPress={()=>{
                                console.log(id)
                                navigation.navigate('Details', { idCouveuse: id ,Name});
                            }}
                        >
                            <Text style={{fontSize:17,fontWeight:500,color:COLORS.greenSecondary}}>Gérer</Text>
                            <AntDesign name="right" size={15} color={COLORS.greenSecondary} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    )
}

export default CardCouveuse
const styles = StyleSheet.create({
    container : {
        flex: 1
        // backgroundColor:"blue"
    },
    card :{
        borderRadius:20,
        overflow:'hidden',
        marginTop : 20
    },
    topCard:{
        flex:4,
        backgroundColor:COLORS.bgBlack20,
        justifyContent:"space-between",
        padding:20,
        overflow:'hidden'
    },
    bottomCard : {
        backgroundColor:COLORS.white,
        overflow:'hidden',
        padding:20,
        flex:6
        // height:"100%"
    },
    topTopCard:{
        display:'flex',
        justifyContent:'space-between',
        height:"100%"
    },
    bigTitle : {
        fontSize:22,
        fontWeight:700,
        color:COLORS.white
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
    partBottomCard : {
        display:"flex",
        gap:10,
        marginTop:10
    },
    iconStyle : {
        width:40,
        height:40,
        display:"flex",
        justifyContent:"center",
        alignItems:"center",
        borderRadius:25
    },    
    InfoDivContainers:{
        display:"flex",
        flexDirection:"row",
        gap:10,
        justifyContent:"flex-start",
        alignItems:"center"
    },
    txt : {
        fontSize:16
    }
})