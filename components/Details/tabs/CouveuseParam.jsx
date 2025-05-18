import { View, Switch, StyleSheet, Text, TouchableOpacity, Alert } from "react-native";
import { COLORS } from '../../../constants/theme';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useState,useContext} from "react";
import { deleteCouveuse } from '../../../services/couveuseServices'; 
import { AuthContext } from "../../../contexts/AuthContext";
import { useNavigation } from "@react-navigation/native";

export default function CouveuseParam({ id }) {
    const [isActive, setActive] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const navigation=useNavigation();
    const{user}=useContext(AuthContext)
    const handleDeleteCouveuse = async () => {
        Alert.alert(
            "Confirmation de suppression",
            "Êtes-vous sûr de vouloir supprimer cette couveuse de votre liste ?",
            [
                {
                    text: "Annuler",
                    style: "cancel"
                },
                {
                    text: "Supprimer",
                    onPress: async () => {
                        try {
                            setIsDeleting(true);
                            await deleteCouveuse(user.uid, id);
                            
                            // Si la suppression réussit, naviguez vers l'écran précédent ou la liste des couveuses
                            if (navigation) {
                                navigation.navigate('Home');
                                // Ou naviguez vers une liste: navigation.navigate('CouveusesListe');
                            }
                        } catch (error) {
                            Alert.alert(
                                "Erreur",
                                `Impossible de supprimer la couveuse: ${error.message}`
                            );
                        } finally {
                            setIsDeleting(false);
                        }
                    }
                }
            ]
        );
    };

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
                <View>
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
                <TouchableOpacity 
                    style={{ 
                        borderWidth: 1, 
                        borderColor: "#f44336", 
                        borderRadius: 9999, 
                        paddingVertical: 10, 
                        paddingHorizontal: 15,
                        opacity: isDeleting ? 0.5 : 1 
                    }}
                    onPress={handleDeleteCouveuse}
                    disabled={isDeleting}
                >
                    <Text style={{ color: "#f44336", textAlign: 'center' }}>
                        {isDeleting ? "Suppression..." : "Supprimer"}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    principaleIcon : {
        width: 50,
        height: 50,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 25,
    },   
    Container : {
        height: 80,
        backgroundColor: COLORS.white,
        marginTop: 20,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 15,
        alignItems: "center",
        borderRadius: 20
    },
    PrincipaleTitle: {
        fontSize: 18,
        fontWeight: 600
    },
    secondaryTitle: {
        fontSize: 13,
        color: COLORS.bgBlack30
    },
})