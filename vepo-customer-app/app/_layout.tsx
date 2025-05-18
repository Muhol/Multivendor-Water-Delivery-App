import { Dimensions, StatusBar, View } from "react-native";
import "../global.css";
import { Stack } from "expo-router";

const { height, width } = Dimensions.get("window");


export default function Layout() {
	const statusBarHeight = StatusBar.currentHeight || 40;

	return (
		<>
			<StatusBar
				backgroundColor={"transparent"}
				barStyle={"dark-content"}
			/>
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
		</>
	);
}
