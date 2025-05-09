// ============================ 
// 📦 Imports
// ============================
import {
    ScrollView,
    View,
    Text,
    Dimensions,
    StyleSheet,
    SafeAreaView,
    Image,
    TouchableHighlight,
    TouchableOpacity,
    Animated,
    Easing
} from 'react-native';

import { useNavigation } from "@react-navigation/native";

import React, { useRef, useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import AntDesign from '@expo/vector-icons/AntDesign';

import { COLORS, SIZES, FONTS } from '../constants/theme';
import pages from '../constants/data';
import SmallCircle from '../components/smallCircle';

// ============================
// 📱 Constants
// ============================
const { width, height } = Dimensions.get('window');

// ============================
// 🚀 WelcomePage Component
// ============================
const WelcomePage = () => {
    const scrollRef = useRef(null);
    const [page, setPage] = useState(0);
    const navigation = useNavigation();
    // 🎞️ Animation Values
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideUpAnim = useRef(new Animated.Value(100)).current;
    const scaleAnim = useRef(new Animated.Value(0.9)).current;
    const buttonScale = useRef(new Animated.Value(1)).current;
    const imageTranslateX = useRef(new Animated.Value(0)).current;
    const imageTranslateY = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const animateIntro = () => {
            fadeAnim.setValue(0);
            slideUpAnim.setValue(30);
            scaleAnim.setValue(0.9);

            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                    easing: Easing.out(Easing.quad)
                }),
                Animated.timing(slideUpAnim, {
                    toValue: 0,
                    duration: 1000,
                    useNativeDriver: true,
                    easing: Easing.out(Easing.quad)
                }),
                Animated.timing(scaleAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                    easing: Easing.out(Easing.quad)
                })
            ]).start();
        };

        animateIntro();

        const isX = Math.random() > 0.5;
        const floatingAnim = Animated.loop(
            Animated.sequence([
                Animated.timing(isX ? imageTranslateX : imageTranslateY, {
                    toValue: 10,
                    duration: 2000,
                    useNativeDriver: true,
                    easing: Easing.inOut(Easing.quad),
                }),
                Animated.timing(isX ? imageTranslateX : imageTranslateY, {
                    toValue: -10,
                    duration: 2000,
                    useNativeDriver: true,
                    easing: Easing.inOut(Easing.quad),
                })
            ])
        );

        floatingAnim.start();

        const interval = setInterval(() => {
            const nextPage = (page + 1) % pages.length;
            scrollRef.current?.scrollTo({ x: nextPage * width, animated: false });
            setPage(nextPage);
        }, 7000);

        return () => {
            floatingAnim.stop();
            clearInterval(interval);
        };
    }, [page]);

    const animateButtonPress = () => {
        Animated.sequence([
            Animated.timing(buttonScale, {
                toValue: 0.95,
                duration: 100,
                useNativeDriver: true
            }),
            Animated.timing(buttonScale, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
                easing: Easing.out(Easing.quad)
            })
        ]).start();
    };

    const handleNextPress = (index) => {
        animateButtonPress();
        const nextPage = (index + 1) % pages.length;
        scrollRef.current?.scrollTo({ x: nextPage * width, animated: false });
        setPage(nextPage);
    };

    return (
        <View style={styles.container}>
            <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                ref={scrollRef}
                scrollEnabled={true}
                scrollEventThrottle={16}
                onScroll={(event) => {
                    const contentOffsetX = event.nativeEvent.contentOffset.x;
                    const newPage = Math.floor(contentOffsetX / width);
                    setPage(newPage);
                    
                }}
            >
                {pages.map((p, index) => (
                    <LinearGradient
                        key={index}
                        colors={p.backgroundColor.colors}
                        start={p.backgroundColor.start}
                        end={p.backgroundColor.end}
                        style={[styles.page, { width }]}
                    >
                        <SafeAreaView style={styles.center}>
                            <Animated.View style={{
                                opacity: fadeAnim,
                                transform: [
                                    { translateY: slideUpAnim },
                                    { scale: scaleAnim },
                                    { translateX: imageTranslateX },
                                    { translateY: imageTranslateY }
                                ]
                            }}>
                                <Image
                                    source={p.image}
                                    style={[styles.image, { resizeMode: 'contain' }]}
                                />
                            </Animated.View>

                            <Animated.View style={[styles.info, {
                                opacity: fadeAnim,
                                transform: [{ translateY: slideUpAnim }]
                            }]}> 
                                <Text style={styles.title}>{p.title}</Text>
                                <Text style={styles.desc}>{p.description}</Text>
                            </Animated.View>

                            <View style={styles.dotsContainer}>
                                {pages.map((_, i) => (
                                    <SmallCircle
                                        key={i}
                                        state={page === i ? 'active' : 'inactive'}
                                        pressHandlerCircle={() => {
                                            scrollRef.current?.scrollTo({ x: i * width, animated: true });
                                            setPage(i);
                                        }}
                                    />
                                ))}
                            </View>

                            {index !== pages.length - 1 ? (
                                <Animated.View style={[styles.navigation, {
                                    opacity: fadeAnim,
                                    transform: [{ translateY: slideUpAnim }]
                                }]}> 
                                    <TouchableHighlight
                                        onPress={() => handleNextPress(index)}
                                        underlayColor="lightgray"
                                        style={styles.button}
                                    >
                                        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                                            <View style={styles.nextRow}>
                                                <Text style={styles.nextText}>Suivant</Text>
                                                <AntDesign name="arrowright" size={17} color={COLORS.greenPrimary} />
                                            </View>
                                        </Animated.View>
                                    </TouchableHighlight>

                                    <TouchableOpacity
                                        style={styles.skipButton}
                                        onPress={() => {
                                            animateButtonPress();
                                            navigation.navigate('Login')
                                        }}
                                    >
                                        <Text style={styles.skipText}>Passer l'introduction</Text>
                                    </TouchableOpacity>
                                </Animated.View>
                            ) : (
                                <Animated.View style={{
                                    opacity: fadeAnim,
                                    transform: [{ translateY: slideUpAnim }]
                                }}>
                                    <TouchableHighlight
                                        onPress={() => {
                                            animateButtonPress();
                                            navigation.navigate('Login')
                                        }}
                                        underlayColor="lightgray"
                                        style={styles.button}
                                    >
                                        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                                            <Text style={styles.nextText}>Commencer</Text>
                                        </Animated.View>
                                    </TouchableHighlight>
                                </Animated.View>
                            )}
                        </SafeAreaView>
                    </LinearGradient>
                ))}
            </ScrollView>
        </View>
    );
};

export default WelcomePage;

// ============================
// 🎨 Styles
// ============================
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    page: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%'

    },
    center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: SIZES.xLarge,
    },
    image: {
        width: 180,
        height: 180,
        marginBottom: SIZES.large
    },
    info: {
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        gap: SIZES.medium,
        width: '100%'
    },
    title: {
        fontSize: SIZES.xLarge + 3,
        color: 'white',
        fontFamily: FONTS.bold,
        fontWeight: 'bold',
        textAlign: 'center',
        lineHeight: 32
    },
    desc: {
        fontSize: SIZES.medium - 2,
        color: 'white',
        fontFamily: FONTS.regular,
        textAlign: 'center',
        lineHeight: 22
    },
    dotsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: SIZES.small,
        marginVertical: SIZES.large
    },
    navigation: {
        display: 'flex',
        gap: SIZES.medium,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%'
    },
    button: {
        backgroundColor: COLORS.bgWhite80,
        paddingVertical: SIZES.medium,
        paddingHorizontal: SIZES.xLarge,
        borderRadius: SIZES.large,
        width: width - SIZES.xLarge * 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    nextRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SIZES.medium,
    },
    nextText: {
        fontSize: SIZES.medium,
        color: COLORS.greenPrimary,
        fontFamily: FONTS.semiBold
    },
    skipButton: {
        backgroundColor: COLORS.bgWhite10,
        paddingVertical: SIZES.medium,
        paddingHorizontal: SIZES.xLarge,
        borderRadius: SIZES.large,
        width: width - SIZES.xLarge * 2,
        alignItems: 'center',
    },
    skipText: {
        fontSize: SIZES.medium,
        color: COLORS.white,
        fontFamily: FONTS.regular
    },
});

// ============================
// ✨ Signature
// ============================
/**
 * ╔══════════════════════════════════╗
 * ║   Designed & Crafted with ❤️    ║
 * ║           by room67             ║
 * ╚══════════════════════════════════╝
 */
