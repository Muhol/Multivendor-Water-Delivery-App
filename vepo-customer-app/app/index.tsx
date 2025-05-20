import { StatusBar } from "expo-status-bar";
// import Spinner from "react-native-loading-spinner-overlay";
import React, { useLayoutEffect, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
// import SystemNavigationBar from 'react-native-system-navigation-bar';
import Animated from "react-native-reanimated";
import icons from "@/constants/icons/icons";
import { useRouter } from "expo-router";
import { preloadImages } from "@/constants/images/images";

export default function Index() {
	// <-----------------HOOKES----------------->
	const router = useRouter();
	
	// <-----------------STATES----------------->
	const [IsReady, setIsReady] = useState(false);
    
	// SystemNavigationBar.setNavigationColor('black', 'light', 'both')


	useLayoutEffect(() => {
		const loadAssets = async () => {
			try {
				await preloadImages().then(() => {
					setIsReady(true);
				});
			} catch (error) {}
		};
		loadAssets();
	}, []);

	
	useLayoutEffect(() => {
		if (IsReady) {
			router.replace('/(screens)')
		}
	}, [IsReady]);

	return (
		<>
			<StatusBar style="dark" backgroundColor="#f0f0f0" />
			<View className="flex-1 bg-[#f0f0f0] w-full items-center justify-center gap-[10px]">
				<Animated.View className={"animate-spin"}>
					<Image
						source={icons.spinner}
						className="w-28 h-28"
						tintColor={"#d9a31b"}
					/>
				</Animated.View>
			</View>
		</>
	);
}
