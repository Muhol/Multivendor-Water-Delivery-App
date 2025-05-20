import { Dimensions, StatusBar, View } from "react-native";
import "../global.css";
import { Stack } from "expo-router";
import { ClerkProvider } from '@clerk/clerk-expo'
import { tokenCache } from '@clerk/clerk-expo/token-cache'

const { height, width } = Dimensions.get("window");


export default function Layout() {

	// <------------------VARIABLES------------------>
	const statusBarHeight = StatusBar.currentHeight || 40;

	return (
		<>
			<StatusBar
				backgroundColor={"transparent"}
				barStyle={"dark-content"}
			/>
			<ClerkProvider tokenCache={tokenCache}>
				<View
					className=" absolute top-0 w-full "
					style={{
						height: height + statusBarHeight,
					}}
				>
					<Stack
						screenOptions={{
							headerShown: false,
							animation: "slide_from_right", // Options: 'fade', 'slide_from_right', 'slide_from_left', 'none'
						}}
					/>
				</View>
			</ClerkProvider>
		</>
	);
}
