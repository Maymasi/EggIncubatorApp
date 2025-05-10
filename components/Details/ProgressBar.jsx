import React from 'react';
import { SIZES ,COLORS} from '../../constants/theme';
import { View, StyleSheet } from 'react-native';

const ProgressBar = ({ progress }) => {
    return (
        <View style={styles.container}>
        <View style={[styles.progress, { width: `${progress * 100}%` }]} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 6,
        backgroundColor: COLORS.bgBlack10,
        borderRadius: 10,
        overflow: 'hidden',
        marginVertical: 10,
    },
    progress: {
        height: '100%',
        backgroundColor: COLORS.greenSecondary, 
        borderRadius: 10,
    },
});

export default ProgressBar;
