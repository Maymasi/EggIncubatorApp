import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  LayoutAnimation,
  UIManager,
  Platform,
  FlatList,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { COLORS, SIZES, FONTS } from "../constants/theme";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const faqData = [
  {
    question: "Comment fonctionne la couveuse connectée ?",
    answer:
      "La couveuse connectée régule automatiquement la température, l'humidité et l'aération pour favoriser l'incubation.",
  },
  {
    question: "Comment créer un compte sur l'application ?",
    answer:
      "Vous pouvez créer un compte via l'écran d'inscription en fournissant une adresse email et un mot de passe.",
  },
  {
    question: "Comment connecter ma couveuse à l'application ?",
    answer:
      "Accédez aux paramètres Bluetooth de l’application et sélectionnez votre appareil.",
  },
  {
    question: "Quels sont les paramètres optimaux pour l'incubation ?",
    answer: "Température entre 37.5°C et 38°C, humidité entre 50% et 60%.",
  },
  {
    question: "Comment modifier les paramètres de température et d'humidité ?",
    answer:
      "Depuis l’onglet paramètres dans l’application, vous pouvez ajuster manuellement les seuils.",
  },
  {
    question: "Comment recevoir des alertes en cas de problème ?",
    answer: "Activez les notifications dans les paramètres de votre profil.",
  },
  {
    question: "Que faire en cas de coupure de courant ?",
    answer: "Utilisez une alimentation de secours (batterie externe ou onduleur).",
  },
  {
    question: "Comment mettre à jour le logiciel de ma couveuse ?",
    answer:
      "Connectez la couveuse à l’application et lancez la mise à jour depuis l’interface de l’application.",
  },
  {
    question: "Comment gérer mon profil utilisateur ?",
    answer:
      "Accédez à la section Profil et appuyez sur Modifier pour changer vos informations.",
  },
];

const FAQItem = ({ item, isActive, onPress }) => {
  const handlePress = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    onPress();
  };

  return (
    <View style={styles.card}>
      <TouchableOpacity onPress={handlePress} style={styles.questionRow}>
        <Text style={styles.question}>{item.question}</Text>
        <AntDesign
          name={isActive ? "up" : "down"}
          size={SIZES.large}
          color={COLORS.black}
        />
      </TouchableOpacity>

      {isActive && (
        <View style={styles.answerContainer}>
          <Text style={styles.answer}>{item.answer}</Text>
        </View>
      )}
    </View>
  );
};

const FAQPage = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleIndex = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Foire Aux Questions</Text>

      <FlatList
        data={faqData}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item, index }) => (
          <FAQItem
            item={item}
            isActive={activeIndex === index}
            onPress={() => toggleIndex(index)}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.greenPrimary,
    padding: 15,
    paddingTop: 40,
  },
  header: {
    fontSize: SIZES.xLarge,
    fontFamily: FONTS.bold,
    color: COLORS.white,
    marginBottom: 20,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 13,
    marginBottom: 10,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  questionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  question: {
    fontSize: SIZES.large,
    fontFamily: FONTS.medium,
    color: COLORS.textPrimary,
    flex: 1,
    paddingRight: 10,
  },
  answerContainer: {
    marginTop: 10,
  },
  answer: {
    fontSize: SIZES.medium,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
  },
});

export default FAQPage;
