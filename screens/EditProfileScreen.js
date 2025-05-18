import React, { useState, useContext, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  TextInput,
  ActivityIndicator,
  Animated
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { COLORS, SIZES, FONTS } from '../constants/theme';
import { AuthContext } from '../contexts/AuthContext';
import { updateUserProfile } from '../services/auth';

// Composant Toast personnalisé amélioré
const Toast = ({ visible, message, type, onHide }) => {
  const translateY = useState(new Animated.Value(100))[0];
  const opacity = useState(new Animated.Value(0))[0];
  const scale = useState(new Animated.Value(0.9))[0];

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true
        }),
        Animated.spring(scale, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true
        })
      ]).start();

      const timer = setTimeout(() => {
        Animated.parallel([
          Animated.timing(translateY, {
            toValue: 100,
            duration: 300,
            useNativeDriver: true
          }),
          Animated.timing(opacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true
          }),
          Animated.timing(scale, {
            toValue: 0.9,
            duration: 300,
            useNativeDriver: true
          })
        ]).start(() => {
          if (onHide) onHide();
        });
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!visible) return null;

  const getStyles = () => {
    switch (type) {
      case 'success':
        return {
          backgroundColor: COLORS.greenPrimary,
          borderColor: `${COLORS.greenPrimary}50`,
          iconName: 'checkmark-circle',
          iconColor: '#FFFFFF'
        };
      case 'error':
        return {
          backgroundColor: '#F15A59',
          borderColor: '#F15A5950',
          iconName: 'alert-circle',
          iconColor: '#FFFFFF'
        };
      case 'info':
        return {
          backgroundColor: '#3498DB',
          borderColor: '#3498DB50',
          iconName: 'information-circle',
          iconColor: '#FFFFFF'
        };
      case 'warning':
        return {
          backgroundColor: '#FFA41B',
          borderColor: '#FFA41B50',
          iconName: 'warning',
          iconColor: '#FFFFFF'
        };
      default:
        return {
          backgroundColor: COLORS.greenPrimary,
          borderColor: `${COLORS.greenPrimary}50`,
          iconName: 'checkmark-circle',
          iconColor: '#FFFFFF'
        };
    }
  };

  const toastStyle = getStyles();

  return (
    <Animated.View style={[
      styles.toast,
      { 
        backgroundColor: toastStyle.backgroundColor,
        borderColor: toastStyle.borderColor,
        transform: [
          { translateY: translateY },
          { scale: scale }
        ],
        opacity
      }
    ]}>
      <View style={styles.toastIconContainer}>
        <Ionicons name={toastStyle.iconName} size={24} color={toastStyle.iconColor} />
      </View>
      <Text style={styles.toastText}>{message}</Text>
      <TouchableOpacity 
        style={styles.closeButton}
        onPress={() => {
          Animated.parallel([
            Animated.timing(translateY, {
              toValue: 100,
              duration: 300,
              useNativeDriver: true
            }),
            Animated.timing(opacity, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true
            })
          ]).start(() => {
            if (onHide) onHide();
          });
        }}
      >
        <Ionicons name="close" size={18} color="#FFFFFF" />
      </TouchableOpacity>
    </Animated.View>
  );
};

const EditProfileScreen = () => {
  const navigation = useNavigation();
  const { user, updateUserData } = useContext(AuthContext);
  
  const [fullName, setFullName] = useState(user?.displayName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [activeField, setActiveField] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // États pour le toast
  const [toast, setToast] = useState({
    visible: false,
    message: '',
    type: 'success' // 'success', 'error', 'info', 'warning'
  });

  const showToast = (message, type = 'success') => {
    setToast({
      visible: true,
      message,
      type
    });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, visible: false }));
  };

  const handleSave = async () => {
    if (!fullName.trim()) {
      showToast('Le nom complet est requis', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const updates = {
        displayName: fullName,
        fullName: fullName,
        ...(email !== user.email && { email }),
        ...(password && { password })
      };

      const updatedUser = await updateUserProfile(user.uid, updates);
      await updateUserData(updatedUser);
      
      showToast('Profil mis à jour avec succès');
      setTimeout(() => {
        navigation.goBack();
      }, 1000);
    } catch (error) {
      console.error('Update error:', error);
      showToast(error.message || 'Échec de la mise à jour du profil', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const renderInputField = (label, value, setValue, keyboardType = 'default', secure = false) => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <View style={[
        styles.inputContainer,
        activeField === label && styles.activeInputContainer
      ]}>
        {label === 'Nom complet' && (
          <Ionicons 
            name="person-outline" 
            size={20} 
            color={activeField === label ? COLORS.greenPrimary : COLORS.grayDark} 
            style={styles.inputIcon} 
          />
        )}
        {label === 'Email' && (
          <Ionicons 
            name="mail-outline" 
            size={20} 
            color={activeField === label ? COLORS.greenPrimary : COLORS.grayDark} 
            style={styles.inputIcon} 
          />
        )}
        {label === 'Mot de passe' && (
          <Ionicons 
            name="lock-closed-outline" 
            size={20} 
            color={activeField === label ? COLORS.greenPrimary : COLORS.grayDark} 
            style={styles.inputIcon} 
          />
        )}
        
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={setValue}
          keyboardType={keyboardType}
          secureTextEntry={secure && !showPassword}
          placeholder={`Entrez votre ${label.toLowerCase()}`}
          placeholderTextColor={COLORS.grayMedium}
          onFocus={() => setActiveField(label)}
          onBlur={() => setActiveField('')}
          editable={!isLoading}
        />
        
        {label === 'Mot de passe' && (
          <TouchableOpacity 
            onPress={() => setShowPassword(!showPassword)} 
            style={styles.eyeIcon}
            disabled={isLoading}
          >
            <Ionicons 
              name={showPassword ? 'eye-off-outline' : 'eye-outline'} 
              size={20} 
              color={activeField === label ? COLORS.greenPrimary : COLORS.grayDark} 
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backButton}
          disabled={isLoading}
        >
          <Ionicons name="chevron-back" size={28} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Modifier le profil</Text>
        <View style={styles.placeholderButton} />
      </View>
      
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <View style={styles.profileHeader}>
            <View style={styles.defaultImage}>
              <Text style={styles.initials}>
                {user?.displayName?.split(' ').map(n => n[0]).join('') || 'US'}
              </Text>
            </View>
          </View>

          <View style={styles.formContainer}>
            {renderInputField('Nom complet', fullName, setFullName)}
            {renderInputField('Email', email, setEmail, 'email-address')}
            {renderInputField('Mot de passe', password, setPassword, 'default', true)}
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity 
              style={[styles.cancelButton, isLoading && { opacity: 0.6 }]} 
              onPress={() => navigation.goBack()}
              disabled={isLoading}
            >
              <Text style={styles.cancelText}>Annuler</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.saveButton, isLoading && { opacity: 0.6 }]} 
              onPress={handleSave}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color={COLORS.white} />
              ) : (
                <Text style={styles.saveText}>Enregistrer</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Composant Toast */}
      <Toast 
        visible={toast.visible} 
        message={toast.message} 
        type={toast.type} 
        onHide={hideToast} 
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.greenPrimary,
    paddingTop: SIZES.xLarge
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.greenPrimary,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    color: COLORS.white,
    fontSize: SIZES.large,
    fontFamily: FONTS.bold,
  },
  placeholderButton: {
    width: 44,
    height: 44,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 24,
    marginTop: 16,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 10,
    marginBottom: 20,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  defaultImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.greenSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.white,
  },
  initials: {
    fontSize: SIZES.xLarge + 8,
    fontFamily: FONTS.bold,
    color: COLORS.white,
  },
  formContainer: {
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.small + 2,
    marginBottom: 8,
    color: COLORS.grayDark,
    paddingLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.grayLight,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'transparent',
    paddingHorizontal: 16,
  },
  activeInputContainer: {
    borderColor: COLORS.greenPrimary,
    backgroundColor: `${COLORS.greenPrimary}10`,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontFamily: FONTS.regular,
    fontSize: SIZES.medium,
    color: COLORS.black,
  },
  eyeIcon: {
    padding: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  cancelButton: {
    flex: 1,
    marginRight: 12,
    backgroundColor: COLORS.grayLight,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  saveButton: {
    flex: 1,
    marginLeft: 12,
    backgroundColor: COLORS.greenPrimary,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: COLORS.greenPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  cancelText: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.medium,
    color: COLORS.grayDark,
  },
  saveText: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.medium,
    color: COLORS.white,
  },
  // Styles de toast améliorés
  toast: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    backgroundColor: COLORS.greenPrimary,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
    zIndex: 1000,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  toastIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  toastText: {
    flex: 1,
    fontFamily: FONTS.medium,
    fontSize: SIZES.medium - 1,
    color: COLORS.white,
    lineHeight: 22,
  },
  closeButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  }
});

export default EditProfileScreen;