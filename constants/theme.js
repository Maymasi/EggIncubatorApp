import { PixelRatio } from "react-native";
const fontScale = PixelRatio.getFontScale();
export const SIZES = {
  small: 9 * fontScale,
  medium: 14 * fontScale,
  large: 18 * fontScale,
  xLarge: 24 * fontScale,
};
export const COLORS = {
    // Couleurs principales
    greenPrimary: '#7ed957',
    greenSecondary: '#5dc264',
    greenTertiary: '#a4c263',
    accent: "#e6f5c4",
    
    // Couleurs de base
    white: "#ffffff",
    black: "#000000",
    
    // Gris
    gray: "#808080",
    grayLight: "#f1f5f9",
    grayMedium: "#a0aec0",
    grayDark: "#718096",
    
    // Statuts
    success: "#7ed957",
    warning: "#ff9f43",
    error: "#ff6b6b",
    offline: "#a0aec0",
    
    // Couleurs fonctionnelles
    temperature: "#FF9F43",
    humidity: "#5BBCE4",
    rotation: "#A55EEA",
    
    // Couleurs d'accentuation
    blue: "#5BBCE4",
    blueLight: "#7DCDF5",
    orange: "#FF9F43",
    orangeLight: "#FFB347",
    purple: "#A55EEA",
    purpleLight: "#B57BF2",
    red: "#FF6B6B",
    redLight: "#FF8E8E",
    
    // Couleurs de fond
    backgroundLight: "#ffffff",
    backgroundTransparent: "rgba(255, 255, 255, 0.1)",
    
    // Fonds spécifiques
    bgGradientPrimary: "linear-gradient(to bottom, #7ed957 0%, #5dc264 100%)",
    bgGradientOrange: "linear-gradient(to right, #FF9F43 0%, #FFB347 100%)",
    bgGradientBlue: "linear-gradient(to right, #5BBCE4 0%, #7DCDF5 100%)",
    bgGradientPurple: "linear-gradient(to right, #A55EEA 0%, #B57BF2 100%)",
    bgGradientRed: "linear-gradient(to right, #FF6B6B 0%, #FF8E8E 100%)",
    
    // Fonds avec transparence
    bgWhite10: "rgba(255, 255, 255, 0.1)",
    bgWhite20: "rgba(255, 255, 255, 0.2)",
    bgWhite30: "rgba(255, 255, 255, 0.3)",
    bgWhite50: "rgba(255, 255, 255, 0.5)",
    bgWhite80: "rgba(255, 255, 255, 0.8)",
    bgBlack10: "rgba(0, 0, 0, 0.1)",
    bgBlack20: "rgba(0, 0, 0, 0.2)",
    bgBlack30: "rgba(0, 0, 0, 0.3)",
    bgBlack50: "rgba(0, 0, 0, 0.5)",
    
    // Fonds de cartes et composants
    bgCard: "#ffffff",
    bgCardHover: "#f8fafc",
    bgInput: "#f1f5f9",
    bgInputFocus: "#ffffff",
    bgButton: "#7ed957",
    bgButtonHover: "#6dc348",
    bgButtonSecondary: "#ffffff",
    bgButtonSecondaryHover: "#f8fafc",
    
    // Couleurs de texte
    textPrimary: "#1A202C",
    textSecondary: "#718096",
    textLight: "#ffffff",
  };
export const FONTS = {
  bold: "InterBold",
  semiBold: "InterSemiBold",
  medium: "InterMedium",
  regular: "InterRegular",
  light: "InterLight",
};