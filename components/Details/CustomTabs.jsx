import  { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SIZES ,COLORS} from '../../constants/theme';
import Controle from './tabs/Controle';
import Historique from './tabs/Historique';
import CouveuseParam from './tabs/CouveuseParam';

const tabs = ['Contrôle', 'Historique', 'Paramètres'];

export default function CustomTabs() {
    const [activeTab, setActiveTab] = useState('Contrôle');
    return (
        <View style={{ flex: 1 }}>
            <View style={styles.tabContainer}>
                {tabs.map(tab => (
                    <TouchableOpacity
                        key={tab}
                        onPress={() => setActiveTab(tab)}
                        style={[
                            styles.tab,
                            activeTab === tab && styles.activeTab
                        ]}
                        >
                        <Text style={[
                            styles.tabText,
                            activeTab === tab && styles.activeTabText
                        ]}>
                            {tab}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
            <View style={{ flex: 1 }}>
                {activeTab === 'Contrôle' && <Controle />}
                {activeTab === 'Historique' && <Historique />}
                {activeTab === 'Paramètres' && <CouveuseParam />}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: COLORS.bgWhite30, 
        padding: 5,
        borderRadius: 30,
        justifyContent: 'space-around',
        marginTop: 20,
    },
    tab: {
        paddingVertical: 13,
        paddingHorizontal: 28,
        borderRadius: 20,
    },
    activeTab: {
        backgroundColor: COLORS.white,
    },
    tabText: {
        color: 'white',
        fontWeight: '700',
        fontSize:SIZES.large
    },
    activeTabText: {
        color: '#2E7D32', 
    }
});
