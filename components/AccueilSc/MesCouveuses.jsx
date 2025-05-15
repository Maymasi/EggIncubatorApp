import { View,StyleSheet,Text ,TouchableOpacity,FlatList} from "react-native";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';import { SIZES ,COLORS} from '../../constants/theme';
import CardCouveuse from "./CardCouveuse";
import { Modal } from 'react-native';
import LottieView from 'lottie-react-native';
import { useState } from "react";
import AddCouveuse from "./AddCouveuse";
export default function MesCouveuses(){
    const [couveuses, setCouveuses] = useState([
        {name:"Couveuse Principale",eggNumber:12,etat:"alert critique",jour:"9/12",temp:39.4,hum:65,ventilateur:"Actif",rotation:"14:30",progress:40,eclosionPeriode:13},
        {name:"Couveuse Secondaire",eggNumber:12,etat:"alert critique",jour:"9/12",temp:39.4,hum:65,ventilateur:"Actif",rotation:"14:30",progress:40,eclosionPeriode:13}
    ]);
    const [cardAdd , setCardAdd] = useState(false);
    const [tempMoy,setTempMoy] = useState(38.1);
    const [humMoy,setHumMoy] = useState(36);
    const handlevisibleAdd = () => {
        setCardAdd(true)
    };    
    const handlemasqueAdd = ()=> {
        setCardAdd(false)
    }
    return(
        <View style={styles.container}>
            <Modal
                visible={cardAdd}
                transparent
                animationType="fade"
                statusBarTranslucent={true}
                onRequestClose={handlemasqueAdd}
                >
                <View style={styles.modalOverlay}>
                    <TouchableOpacity
                    style={styles.backdrop}
                    activeOpacity={1}
                    onPress={handlemasqueAdd}
                    />
                    <View style={styles.modalContent}>
                    <AddCouveuse />
                    </View>
                </View>
            </Modal>
            {/* mes couveuses */}
            <View style={styles.top}>
                <Text style={styles.bigTitle}>Mes Couveuses</Text>
                <View style={styles.btnsAddCouveuse} >
                    
                    <TouchableOpacity style={styles.scan_Add_Btn} onPress={handlevisibleAdd}>
                        <FontAwesome6 name="add" size={20} color={COLORS.white} />
                    </TouchableOpacity>
                </View>
            </View>
            <FlatList
                data={couveuses}
                keyExtractor={(item,index) =>  index.toString()}
                renderItem={({item}) => (
                    <CardCouveuse
                    Name={item.name}
                    EggNumber={item.eggNumber}
                    Etat={item.etat}
                    Jour={item.jour}
                    Temp={item.temp}
                    Hum={item.hum}
                    Ventilateur={item.ventilateur}
                    Rotation={item.rotation}
                    Progress={item.progress}
                    EclosionPeriode={item.eclosionPeriode}
                />
                )}
            />
            {/* apercu rapide */}
            <Text style={[styles.bigTitle,{marginVertical:20}]}>Aperçu Rapide</Text>
            <View style={styles.apercuTop}>
                <View style={styles.apercuLtlCard}>
                    <View style={{display:"flex", flexDirection:"row",gap:10,alignItems:"center",width:"100%"}}>
                        <View style={[styles.iconApercu,{backgroundColor:COLORS.orange}]}>
                            <FontAwesome6 name="temperature-half" size={23} color={COLORS.white} />
                        </View>
                        <Text style={{color:COLORS.bgBlack50,fontSize:16,flexShrink: 1}}>Température Moy.</Text>
                    </View>
                    <Text style={{fontSize:25,fontWeight:700,width:"100%"}}>{tempMoy}°C</Text>
                </View>
                <View style={styles.apercuLtlCard}>
                    <View style={{display:"flex", flexDirection:"row",gap:10,alignItems:"center",width:"100%"}}>
                        <View style={[styles.iconApercu,{backgroundColor:COLORS.purple}]}>
                            <MaterialCommunityIcons name="water-check-outline" size={23} color={COLORS.white} />
                        </View>
                        <Text style={{color:COLORS.bgBlack50,fontSize:16,flexShrink: 1}}>Humidité Moy.</Text>
                    </View>
                    <Text style={{fontSize:25,fontWeight:700,width:"100%"}}>{humMoy}%</Text>
                </View>
            </View>
            {/* statut du systeme */}
            <View style={styles.statusCard}>
                <View style={styles.topStatusCard}>
                    <Text style={{color:COLORS.white,fontSize:SIZES.xLarge,fontWeight:700}}>Statut du Système</Text>
                </View>
                <View style={styles.bottomStatusCard}>
                    <View style={{flex:1}}>
                        <Text style={{fontSize:19,color:"#d50000",fontWeight:500}}>Alerte Critique</Text>
                        <Text style={{fontSize:18}}>Alerte critique ! Action requise immédiatement.</Text>
                    </View>
                    <View >
                        <LottieView
                        source={require('../../assets/animation/Animation_Sad.json')}
                        autoPlay
                        loop
                        style={{ width: 100, height: 100 }}
                        />
                    </View>
                </View>
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    container:{
        flex:1
    },
    top : {
        display:"flex",
        flexDirection : "row",
        justifyContent:"space-between",
        marginTop:20
    },
    bigTitle : {
        fontSize:25,
        fontWeight:700,
        color:COLORS.white
    },
    btnsAddCouveuse:{
        display:"flex",
        flexDirection:"row",
        gap:10
    },
    scan_Add_Btn : {
        backgroundColor : COLORS.bgWhite20,
        width:35,
        height:35,
        borderRadius:9999,
        display:"flex",
        justifyContent:"center",
        alignItems:"center"
    },
    apercuTop:{
        display:"flex",
        flexDirection:"row",
        gap:10
    },
    apercuLtlCard :{
        backgroundColor:COLORS.white,
        // flex:1,
        width:"48%",
        display:"flex",
        justifyContent:"center",
        alignItems:"center",
        padding:17,
        gap:8,
        borderRadius:12,
    },
    iconApercu:{
        width:45,
        height:45,
        backgroundColor:"orange",
        display:"flex",
        justifyContent:"center",
        alignItems:"center",
        borderRadius:"50%"
    },
    statusCard:{
        backgroundColor:"white",
        marginVertical:20,
        borderRadius:17,
        overflow:"hidden"

    },
    topStatusCard:{
        backgroundColor:"#ff5252",
        padding:20
    },
    bottomStatusCard:{
        padding:15,
        display:"flex",
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"center"
    },
    modalOverlay: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },

    backdrop: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },

    modalContent: {
    zIndex: 10,
    elevation: 10,
    // facultatif : largeur fixe ou responsive
    width: '90%',
    borderRadius: 10,
    overflow: 'hidden',
    }


})