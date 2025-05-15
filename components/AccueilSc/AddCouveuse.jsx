import { useState } from 'react';
import {View,Text,TextInput,TouchableOpacity,StyleSheet} from 'react-native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS, SIZES,FONTS } from '../../constants/theme';

export default function AddCouveuse() {
    const [nom, setNom] = useState('');
    const [identifiant, setIdentifiant] = useState('');
    const [nbOeufs, setNbOeufs] = useState('');
    const [dureeIncubation, setDureeIncubation] = useState('');
    const [date, setDate] = useState('Aujourd\'hui');
    const [heure, setHeure] = useState('Maintenant');

    const handleAdd = () => {
    };

    return (
        <View style={styles.container}>
        <View style={styles.header}>
            <Text style={styles.title}>Ajouter une couveuse</Text>
        </View>

        <Text style={styles.label}>Nom de la couveuse</Text>
        <TextInput
            style={styles.input}
            placeholder="Ex: Couveuse Principale"
            value={nom}
            onChangeText={setNom}
        />

        <Text style={styles.label}>Identifiant unique</Text>
        <TextInput
            style={styles.input}
            placeholder="Ex: INC-123456"
            value={identifiant}
            onChangeText={setIdentifiant}
        />
        <Text style={styles.helperText}>
            L'identifiant se trouve généralement sous la couveuse ou dans sa documentation
        </Text>

        <View style={styles.row}>
            <View style={styles.inputGroup}>
            <Text style={styles.label}>Nombre d'œufs</Text>
            <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={nbOeufs}
                onChangeText={setNbOeufs}
            />
            </View>
            <View style={styles.inputGroup}>
            <Text style={styles.label}>Durée d'incubation (jours)</Text>
            <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={dureeIncubation}
                onChangeText={setDureeIncubation}
            />
            </View>
        </View>

        <Text style={styles.label}>Date de début d'incubation</Text>
        <View style={styles.row}>
            <TouchableOpacity style={styles.dateButton}>
            <FontAwesome6 name="calendar" size={20} color="black" />
            <Text style={styles.dateButtonText}>{date}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.dateButton}>
            <Ionicons name="time-outline" size={20} color="black" />
            <Text style={styles.dateButtonText}>{heure}</Text>
            </TouchableOpacity>
        </View>

        <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
            <Text style={styles.addText}>Ajouter</Text>
            </TouchableOpacity>
        </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: COLORS.backgroundLight,
        borderRadius: 15,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: SIZES.large,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        fontFamily: FONTS.semiBold,
    },
    closeButton: {
        fontSize: 22,
        color: COLORS.grayMedium,
    },
    label: {
        fontSize: SIZES.medium,
        color: COLORS.textPrimary,
        marginTop: 15,
        marginBottom: 5,
        fontFamily: FONTS.medium,
    },
    helperText: {
        fontSize: SIZES.small,
        color: COLORS.textSecondary,
        marginBottom: 10,
        fontFamily: FONTS.regular,
    },
    input: {
        borderWidth: 1,
        borderColor: COLORS.grayMedium,
        borderRadius: 8,
        padding: 10,
        backgroundColor: COLORS.bgInput,
        color: COLORS.textPrimary,
        fontFamily: FONTS.regular,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
        marginTop: 10,
    },
    inputGroup: {
        flex: 1,
    },
    dateButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        borderWidth: 1,
        borderColor: COLORS.grayMedium,
        padding: 10,
        borderRadius: 8,
        backgroundColor: COLORS.bgInput,
        flex: 1,
        justifyContent: 'center',
    },
    dateButtonText: {
        fontSize: SIZES.medium,
        color: COLORS.textPrimary,
        fontFamily: FONTS.regular,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 25,
        gap: 10,
    },
    cancelButton: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        backgroundColor: COLORS.bgButtonSecondary,
        borderRadius: 8,
    },
    cancelText: {
        color: COLORS.textPrimary,
        fontWeight: 'bold',
        fontFamily: FONTS.medium,
    },
    addButton: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        backgroundColor: COLORS.greenPrimary,
        borderRadius: 8,
    },
    addText: {
        color: COLORS.white,
        fontWeight: 'bold',
        fontFamily: FONTS.medium,
    },
});
