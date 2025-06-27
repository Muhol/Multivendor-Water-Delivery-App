import { Dimensions, StatusBar, View, useColorScheme } from "react-native";
import "../global.css";
import { Stack } from "expo-router";
import { ClerkProvider} from '@clerk/clerk-expo'
import { tokenCache } from '@clerk/clerk-expo/token-cache'
import Context from '../context/context'
import ThemeContextProvider from '../context/ThemeContext'
import { useEffect, useState } from "react";
import * as SplashScreen from 'expo-splash-screen';
import { preloadImages } from "@/constants/images/images";
import { GestureHandlerRootView } from "react-native-gesture-handler";


SplashScreen.preventAutoHideAsync();

const { height, width } = Dimensions.get("window");
export default function Layout() {

	// <------------------HOOKES------------------>
	const darkTheme = useColorScheme() === "dark"


	// <------------------STATES------------------>
	// const [IsReady, setIsReady] = useState(false);

	// <------------------VARIABLES------------------>
	const statusBarHeight = StatusBar.currentHeight || 40;


	useEffect(() => {
		const prepare = async () => {
			try {
				await preloadImages();
			} catch (e) {
				// console.warn("Error loading images:", e);
			} finally {
				// setIsReady(true);
				await SplashScreen.hideAsync();
			}
		};
	
		prepare();
	}, []);

	return (
		<>
			<StatusBar
				backgroundColor={"transparent"}
				barStyle={"dark-content"}
			/>
			<GestureHandlerRootView>
				<ThemeContextProvider>
						<ClerkProvider publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY} tokenCache={tokenCache}>
							<View
								className={` absolute top-0 w-full ${darkTheme?"bg-black":""}`}
								style={{
									height: height + statusBarHeight,
								}}
							>
								<Stack
									screenOptions={{
										headerShown: false,
										animation: "slide_from_right", // Options: 'fade', 'slide_from_right', 'slide_from_left', 'none'
										statusBarAnimation: "slide"
									}}
								/>
							</View>
						</ClerkProvider>
				</ThemeContextProvider>
			</GestureHandlerRootView>
		</>
	);
}
