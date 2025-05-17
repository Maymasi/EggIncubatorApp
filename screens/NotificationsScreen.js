import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import NotificationCard from '../components/NotificationCard';
import { COLORS, SIZES, FONTS } from '../constants/theme';

const notifications = [
  {
    type: 'temperature',
    title: 'Alerte température',
    subtitle: 'Couveuse Secondaire',
    time: 'Il y a 10 min',
  },
  {
    type: 'humidity',
    title: 'Humidité basse',
    subtitle: 'Couveuse Principale',
    time: 'Il y a 30 min',
  },
  {
    type: 'rotation',
    title: 'Rotation effectuée',
    subtitle: 'Couveuse Principale',
    time: 'Il y a 1h',
  },
];

const NotificationsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Notifications</Text>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.cardWrapper}>
          {notifications.map((notif, index) => (
            <NotificationCard key={index} {...notif} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: COLORS.greenPrimary,
  },
  header: {
    fontSize: SIZES.xLarge,
    fontFamily: FONTS.bold,
    color: COLORS.white,
    marginBottom: 16,
  },
  cardWrapper: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
});

export default NotificationsScreen;


