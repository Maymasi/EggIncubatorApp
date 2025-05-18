import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  LayoutAnimation,
  UIManager,
  Platform,
  FlatList,
  StatusBar,
  SafeAreaView,
  Animated,
  Image,
} from "react-native";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { COLORS, SIZES, FONTS } from "../constants/theme";
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

// Enable LayoutAnimation for Android
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const faqData = [
  {
    question: "Comment fonctionne la couveuse connectée ?",
    answer:
      "La couveuse connectée régule automatiquement la température, l'humidité et l'aération pour favoriser l'incubation.",
    icon: "thermostat",
  },
  {
    question: "Comment créer un compte sur l'application ?",
    answer:
      "Vous pouvez créer un compte via l'écran d'inscription en fournissant une adresse email et un mot de passe.",
    icon: "person-add",
  },
  {
    question: "Comment connecter ma couveuse à l'application ?",
    answer:
      "Accédez aux paramètres Bluetooth de l'application et sélectionnez votre appareil.",
    icon: "bluetooth",
  },
  {
    question: "Quels sont les paramètres optimaux pour l'incubation ?",
    answer: "Température entre 37.5°C et 38°C, humidité entre 50% et 60%.",
    icon: "tune",
  },
  {
    question: "Comment modifier les paramètres de température et d'humidité ?",
    answer:
      "Depuis l'onglet paramètres dans l'application, vous pouvez ajuster manuellement les seuils.",
    icon: "settings",
  },
  {
    question: "Comment recevoir des alertes en cas de problème ?",
    answer: "Activez les notifications dans les paramètres de votre profil.",
    icon: "notifications",
  },
  {
    question: "Que faire en cas de coupure de courant ?",
    answer: "Utilisez une alimentation de secours (batterie externe ou onduleur).",
    icon: "power-off",
  },
  {
    question: "Comment mettre à jour le logiciel de ma couveuse ?",
    answer:
      "Connectez la couveuse à l'application et lancez la mise à jour depuis l'interface de l'application.",
    icon: "system-update",
  },
  {
    question: "Comment gérer mon profil utilisateur ?",
    answer:
      "Accédez à la section Profil et appuyez sur Modifier pour changer vos informations.",
    icon: "account-circle",
  },
];

const FAQItem = ({ item, isActive, onPress }) => {
  const animatedHeight = useRef(new Animated.Value(0)).current;
  const rotateAnimation = useRef(new Animated.Value(0)).current;
  
  const rotate = rotateAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(animatedHeight, {
        toValue: isActive ? 1 : 0,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(rotateAnimation, {
        toValue: isActive ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      })
    ]).start();
  }, [isActive]);

  const handlePress = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    onPress();
  };

  const animatedStyle = {
    maxHeight: animatedHeight.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 500],
    }),
    opacity: animatedHeight,
  };

  return (
    <View style={styles.card}>
      <TouchableOpacity 
        onPress={handlePress} 
        style={styles.questionRow}
        activeOpacity={0.7}
      >
        <View style={styles.questionContainer}>
          <View style={[styles.iconContainer, { backgroundColor: `${COLORS.greenPrimary}15` }]}>
            <MaterialIcons name={item.icon} size={20} color={COLORS.greenPrimary} />
          </View>
          <Text style={styles.question}>{item.question}</Text>
        </View>
        <Animated.View style={{ transform: [{ rotate }] }}>
          <AntDesign
            name="down"
            size={SIZES.medium}
            color={COLORS.greenPrimary}
          />
        </Animated.View>
      </TouchableOpacity>

      <Animated.View style={[styles.answerContainer, animatedStyle]}>
        <Text style={styles.answer}>{item.answer}</Text>
      </Animated.View>
    </View>
  );
};

const FAQPage = ({ navigation }) => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleIndex = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  const handleGoBack = () => {
    navigation && navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.greenPrimary} />
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <TouchableOpacity 
            onPress={handleGoBack} 
            style={styles.backButton}
            activeOpacity={0.7}
          >
          <Ionicons name="arrow-back" size={21} color="white" />
            </TouchableOpacity>
          <Text style={styles.header}>Foire Aux Questions</Text>
        </View>

        <View style={styles.contentWrapper}>
          <View style={styles.illustrationContainer}>
            <FontAwesome6 name="file-circle-question" size={24} color="black" />
            <Text style={styles.subHeader}>
              Comment pouvons-nous vous aider ?
            </Text>
          </View>

          <FlatList
            data={faqData}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
            renderItem={({ item, index }) => (
              <FAQItem
                item={item}
                isActive={activeIndex === index}
                onPress={() => toggleIndex(index)}
              />
            )}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.greenPrimary,
    paddingTop:20
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.greenPrimary,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    marginRight: 15,
  },
  header: {
    fontSize: SIZES.xLarge,
    fontFamily: FONTS.bold,
    color: COLORS.white,
    flex: 1,
  },
  contentWrapper: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: "hidden",
  },
  illustrationContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  illustration: {
    width: 150,
    height: 120,
  },
  subHeader: {
    fontSize: SIZES.large,
    fontFamily: FONTS.medium,
    color: COLORS.textPrimary,
    marginVertical: 10,
  },
  listContainer: {
    padding: 20,
    paddingTop: 10,
    paddingBottom: 30,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    overflow: "hidden",
  },
  questionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  questionContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    paddingRight: 15,
  },
  question: {
    fontSize: SIZES.medium,
    fontFamily: FONTS.medium,
    color: COLORS.textPrimary,
    flex: 1,
    marginLeft: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  answerContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(0, 0, 0, 0.05)",
    overflow: "hidden",
  },
  answer: {
    fontSize: SIZES.medium - 1,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    lineHeight: SIZES.medium * 1.5,
  },
});

export default FAQPage;