import { View,Text,StyleSheet, Dimensions,FlatList } from "react-native";
import { LineChart } from 'react-native-chart-kit';
import { SIZES ,COLORS} from '../../../constants/theme';
import DropDownPicker from 'react-native-dropdown-picker';
// icons
import Feather from '@expo/vector-icons/Feather';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import React, { useState } from "react";

const screenWidth = Dimensions.get("window").width;
// data reperes
const dataTemp = {
    labels: ["S1", "S2", "S3", "S4"],
    datasets: [
        {
            data: [37.3, 37.28, 37.29, 37.23],
            color: (opacity = 1) => COLORS.orange,
            strokeWidth: 2
        }
    ],
};
const dataHum = {
    labels: ["S1", "S2", "S3", "S4"],
    datasets: [
        {
            data: [68, 68.2, 68.4, 68.1],
            color: (opacity = 1) => COLORS.blue,
            strokeWidth: 2
        }
    ],
};
// chart config
const chartConfigTemp = {
    backgroundGradientFrom: COLORS.white,
    backgroundGradientTo: COLORS.white,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 0.1) => `rgba(0, 0, 0, ${opacity})`,
    propsForDots: {
        r: "5",
        strokeWidth: "2",
        stroke: COLORS.orange,
        fill: COLORS.white 
    },
    propsForBackgroundLines: {
        stroke: COLORS.bgBlack10
    },
    backgroundColor: COLORS.white, // couleur du fond global
    fillShadowGradient: "transparent", // plus de blanc
    fillShadowGradientOpacity: 0, // totalement invisible
};
const chartConfigHum = {
    backgroundGradientFrom: COLORS.white,
    backgroundGradientTo: COLORS.white,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 0.1) => `rgba(0, 0, 0, ${opacity})`,
    propsForDots: {
        r: "0"
    },
    propsForBackgroundLines: {
        stroke: COLORS.bgBlack10
    },
    backgroundColor: COLORS.white, 
    fillShadowGradient: "transparent", 
    fillShadowGradientOpacity: 0, 
};
// icons notifications
const eventIcons = {
    alert:<Feather name="alert-triangle" size={24} color={COLORS.red} />,
    rotation:<FontAwesome6 name="arrow-rotate-right" size={24} color={COLORS.greenSecondary} />,
    ventilateur:<FontAwesome5 name="fan" size={24} color={COLORS.blue} />,
    humidité:<MaterialCommunityIcons name="water-check-outline" size={26} color={COLORS.blue} />,
    température:<FontAwesome6 name="temperature-half" size={24} color={COLORS.orange} />
}
const getBackgroundColor = (type) => {
    switch (type) {
        case "alert":
            return COLORS.red + '20'; 
        case "rotation":
            return COLORS.greenSecondary + '20';
        case "ventilateur":
            return COLORS.blue + '20';
        case "humidité":
            return COLORS.blue + '20';
        case "température":
            return COLORS.orange + '20';
        default:
            return COLORS.bgBlack10;
    }
};

export default function Historique(){
    const [notifications,setNotifications] = useState([
        {id:1,type:"alert",message:"Température élevée",incubator:"Couveuse Secondaire",time:'10 min'},
        {id:2,type:"rotation",message:"Rotation effectuée",incubator:"Couveuse Principale",time:'30 min'},
        {id:3,type:"ventilateur",message:"Ventilateur activé",incubator:"Couveuse Principale",time:'1h'},
        {id:4,type:"humidité",message:"Humidité ajustée",incubator:"Couveuse Secondaire",time:'2h'},
        {id:5,type:"température",message:"Température ajustée",incubator:"Couveuse Principale",time:'3h'},

    ])
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState("Couveuse Principale");
    const [items, setItems] = useState([
        { label: 'Toutes les couveuses', value: 'Toutes les couveuses' },
        { label: 'Couveuse Principale', value: 'Couveuse Principale' },
    ]);

    const renderItem = ({item}) => {
        return(
            <View style={styles.item}>
                <View style={[styles.icon, { backgroundColor: getBackgroundColor(item.type) }]}>{eventIcons[item.type]}</View>
                <View style={styles.textContainer}>
                    <Text style={styles.content}>{item.message}</Text>
                    <Text style={styles.couveuse}>{item.incubator} • {item.time}</Text>
                </View>
            </View>
        );
    }
    return (
        <View>
            <View style={styles.SelectCard}>
                <Text style={styles.titleCard}>Sélectionner une couveuse</Text>
                <View style={styles.selectContainer}>
                    <DropDownPicker
                    open={open}
                    value={value}
                    items={items}
                    setOpen={setOpen}
                    setValue={setValue}
                    setItems={setItems}
                    listMode="SCROLLVIEW"
                    dropDownDirection="BOTTOM"
                    style={{
                        borderWidth: 1,
                        borderColor: COLORS.bgBlack10,
                        borderRadius: 20,
                        backgroundColor: COLORS.white,
                        height: 45,
                        paddingHorizontal: 12,
                        zIndex: 1000,
                    }}
                    dropDownContainerStyle={{
                        borderWidth: 1,
                        borderColor: COLORS.bgBlack10,
                        borderRadius: 20,
                        backgroundColor: COLORS.white,
                        zIndex: 999,
                        marginTop: 0, 
                    }}
                    textStyle={{
                        fontSize: 16,
                        color: COLORS.black,
                    }}
                    labelStyle={{
                        fontWeight: 500,
                    }}
                    />
                </View>
            </View>
            <View style={styles.cardRepere}>
                <Text style={{ fontSize: SIZES.xLarge, fontWeight: 'bold', marginBottom: 30 }}>
                    Historique: {value}
                </Text>
                <View>
                    <Text style={{marginBottom:10,color:COLORS.bgBlack40}}>Température (°C)</Text>
                    <LineChart
                        data={dataTemp}
                        width={screenWidth - 10}
                        height={220}
                        yAxisInterval={1}
                        chartConfig={chartConfigTemp}
                        bezier
                        withShadow={false}    
                        style={{
                        borderRadius: 15
                        }}
                    />
                </View>
                <View style={{marginTop:20}}>
                    <Text style={{marginBottom:10,color:COLORS.bgBlack40}}>Humidité (%)</Text>
                    <LineChart
                        data={dataHum}
                        width={screenWidth - 10}
                        height={220}
                        yAxisInterval={1}
                        chartConfig={chartConfigHum}
                        bezier
                        withShadow={false}    
                        style={{
                        borderRadius: 15
                        }}
                    />
                </View>
            </View>
            <View style={styles.notificationContainer}>
                <Text style={{fontSize:21,fontWeight:600,marginBottom:20}}>Événements récents</Text>
                <FlatList
                    data={notifications}
                    keyExtractor={item => item.id}
                    renderItem={renderItem}
                />
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    SelectCard : {
        backgroundColor:COLORS.white,
        borderRadius:19,
        height:90,
        display:"flex",
        flexDirection:"row",
        justifyContent:"space-between",
        padding:13,
        gap:2,
        alignItems:"center",
        marginTop:20
    },
    titleCard :{
        fontSize:18,
        fontWeight:600,
        width:"40%"
    },
    selectContainer : {
        width:"60%"
    },
    cardRepere : {
        backgroundColor: COLORS.white,
        padding: 15,
        borderRadius: 15,
        overflow:"hidden",
        marginTop:20
    },
    notificationContainer:{
        backgroundColor:"white",
        padding:20,
        marginTop:20,
        borderRadius:20,

    },
    item:{
        display:"flex",
        flexDirection:"row",
        alignItems:"center",
        gap:14,
        marginVertical:7,
    },
    content:{
        fontSize:18,
        fontWeight:600
    },
    couveuse:{
        color:COLORS.bgBlack30
    },
    icon:{
        height:50,
        width:50,
        borderRadius:"50%",
        display:"flex",
        justifyContent:"center",
        alignItems:"center"
    },
    textContainer:{
        
    }
})
