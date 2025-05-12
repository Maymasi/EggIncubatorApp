import { View,StyleSheet,Text,ActivityIndicator  } from "react-native";
import {COLORS,SIZES} from "../../constants/theme"
import Fontisto from '@expo/vector-icons/Fontisto';
import * as Location from 'expo-location';
import { useState,useEffect } from "react";
const now = new Date();
const date = now.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' });
const time = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
export default function Localisation(){
    const [location, setLocation] = useState(null);
    const [address, setAddress] = useState(null);
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
    (async () => {
        // Demande la permission d'accéder à la localisation
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
        console.log('Permission non accordée');
        return;
        }

        // Obtenir la position GPS (latitude & longitude)
        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
        const { latitude, longitude } = location.coords;

        
        //  Appeler l’API météo avec les coordonnées
        const API_KEY = '8b8356434b9070577f27c2b1cdef1a88'; 
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric&lang=fr`;

        try {
            let response = await fetch(url);
            let data = await response.json();
            setWeather(data);
        } catch (error) {
            console.error('Erreur lors de la récupération météo :', error);
        } finally {
            setLoading(false);
        }
        
        // Transformer les coordonnées GPS en adresse humaine 
        let geocode = await Location.reverseGeocodeAsync(location.coords);
        setAddress(geocode[0]); // on prend la première adresse trouvée
    })();
    }, []);
    if (loading) return <ActivityIndicator size="large" />;
    return (
        <View style={styles.container}>
            <View style={styles.LeftSide}>
                <View style={styles.MeteoIcn}>
                    <Fontisto name="day-sunny" size={25} color={COLORS.white} />
                </View>
                <View>
                    <Text>{date}</Text>
                    {address ? (
                        <Text  style={{fontSize:SIZES.xLarge,fontWeight:700}}>{address.city}</Text>
                        ) : (
                        <Text>Chargement...</Text>
                    )}
                </View>
            </View>
            <View style={styles.DateEtMeteo}>
                <Text style={{fontSize:SIZES.large,fontWeight:700}}>{time}</Text>

                {weather ? (
                    <Text>{weather.weather[0].description}, {weather.main.temp}°C</Text>
                ) : (
                    <Text>Impossible de charger la météo</Text>
                )}
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