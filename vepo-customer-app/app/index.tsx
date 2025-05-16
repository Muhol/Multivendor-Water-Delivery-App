import { useFonts } from "expo-font";
import { SplashScreen, useRouter, useRootNavigationState } from "expo-router";
import { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
// import Spinner from "react-native-loading-spinner-overlay";
import React, { Component } from "react";
import { Image, Platform, StyleSheet, Text, View } from "react-native";
// import SystemNavigationBar from 'react-native-system-navigation-bar';
import Animated from "react-native-reanimated";
import icons from "@/constants/icons/icons";
import images from "@/constants/images/images";
import { preloadImages } from "@/constants/images/images";

// import * as NavigationBar from 'expo-navigation-bar';

SplashScreen.preventAutoHideAsync();

export default function Index() {
	const router = useRouter();
	const navigationState = useRootNavigationState();
    
	const [loaded] = useFonts({
        SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
	});

	const [isReady, setIsReady] = useState(false);




  useEffect(() => {
    const loadAssetsAndHideSplash = async () => {
        try {
            // Prevent the splash screen from hiding automatically
            await SplashScreen.preventAutoHideAsync();

            // Preload images
            await preloadImages();

            // Now hide the splash screen
            setIsReady(true);
            await SplashScreen.hideAsync();
        } catch (error) {
        }
    };

    loadAssetsAndHideSplash();
}, []);
    
	useEffect(() => {
        if (loaded && isReady && navigationState?.key) {
            SplashScreen.hideAsync();
			router.replace('/(Auth)');
		}
	}, [loaded, navigationState?.key, isReady]);
    
	if (!loaded) {
        return;
	}
    // SystemNavigationBar.setNavigationColor('black', 'light', 'both')

	return (
		<>
            <StatusBar style='dark' backgroundColor="#f0f0f0"/>
            <View className="flex-1 bg-[#f0f0f0] w-full items-center justify-center">
                
                {/* <Animated.View className={'animate-bounce'}>
                    <Image source={images.logo} className="w-44 h-20 " tintColor={'#d9a31b'}/>
                </Animated.View> */}
                <Animated.View className={'animate-spin'}>
                    <Image source={icons.spinner} className="w-14 h-14 " tintColor={'#d9a31b'}/>
                </Animated.View>

            </View>
		</>
	);
}
