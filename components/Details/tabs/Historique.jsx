import { View,Text,StyleSheet, Dimensions } from "react-native";
import { LineChart } from 'react-native-chart-kit';
import { SIZES ,COLORS} from '../../../constants/theme';
import DropDownPicker from 'react-native-dropdown-picker';
import React, { useState } from "react";

const screenWidth = Dimensions.get("window").width;

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

export default function Historique(){
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState("Couveuse Principale");
    const [items, setItems] = useState([
        { label: 'Toutes les couveuses', value: 'Toutes les couveuses' },
        { label: 'Couveuse Principale', value: 'Couveuse Principale' },
    ]);
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
    }
})
