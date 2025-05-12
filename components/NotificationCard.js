import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS } from '../constants/theme';

const iconData = {
  temperature: {
    icon: <MaterialIcons name="error-outline" size={24} color="#F44336" />,
    bg: '#FFE5E5',
  },
  humidity: {
    icon: <MaterialIcons name="warning" size={24} color="#FFA726" />,
    bg: '#FFF1DC',
  },
  rotation: {
    icon: <MaterialCommunityIcons name="rotate-360" size={24} color="#4CAF50" />,
    bg: '#E6F9EC',
  },
};

const NotificationCard = ({ type, title, subtitle, time }) => {
  return (
    <View style={styles.card}>
      <View style={[styles.iconContainer, { backgroundColor: iconData[type].bg }]}>
        {iconData[type].icon}
      </View>
      <View style={styles.texts}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{`${subtitle} • ${time}`}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 6,
    backgroundColor: 'transparent', 
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 0,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  texts: {
    flex: 1,
  },
  title: {
    fontSize: SIZES.large,
    fontFamily: FONTS.semiBold,
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontSize: SIZES.medium,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
});

export default NotificationCard;

