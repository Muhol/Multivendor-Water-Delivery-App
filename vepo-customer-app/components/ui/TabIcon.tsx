import { View, Text, Image, useColorScheme } from "react-native";
import React, { useContext } from "react";
import Animated from "react-native-reanimated";
import { UIThemeContext } from "@/context/ThemeContext";

type Props = {
	name: string;
	active: boolean;
	count?: any | null;
};

const TabIcon = ({ name, active, count }: Props) => {
	// <-----------------HOOKS----------------->
	const { currentTheme } = useContext(UIThemeContext);
	const darkTheme = currentTheme === "dark";
	if (name === "home") {
		return (
			<View className="items-center gap-1">
				<Image
					source={require("../../assets/icons/home-black.png")}
					className="w-[25px] h-[25px]"
					tintColor={`${
						active ? "#deb020" : darkTheme ? "white" : "black"
					}`}
				/>
				{active && (
					<View
						className="h-1 w-2 rounded-full"
						style={{
							backgroundColor: "#deb020",
						}}
					/>
				)}
			</View>
		);
	} else if (name === "notification") {
		return (
			<View className="items-center gap-1">
				<Image
					source={require("../../assets/icons/notification-black.png")}
					className="w-[25px] h-[25px]"
					tintColor={`${
						active ? "#deb020" : darkTheme ? "white" : "black"
					}`}
				/>
				{active && (
					<View
						className="h-1 w-2 rounded-full"
						style={{
							backgroundColor: "#deb020",
						}}
					/>
				)}
			</View>
		);
	} else if (name === "cart") {
		return (
			<View className="items-center gap-1 relative">
				{count >= 1 && (
					<View
						className={`absolute bg-red-500 rounded-full min-h-6 min-w-6  items-center justify-center -top-2 -right-2 z-20`}
					>
						<Text
							className={`${
								darkTheme ? "text-white" : " text-white"
							}`}
						>
							{count}
						</Text>
					</View>
				)}
				<Image
					source={require("../../assets/icons/cart-black.png")}
					className="w-[25px] h-[25px]"
					tintColor={`${
						active ? "#deb020" : darkTheme ? "white" : "black"
					}`}
				/>
				{active && (
					<View
						className="h-1 w-2 rounded-full"
						style={{
							backgroundColor: "#deb020",
						}}
					/>
				)}
			</View>
		);
	} else if (name === "search") {
		return (
			<View className="items-center gap-1">
				<Image
					source={require("../../assets/icons/search-icon-black.png")}
					className="w-[25px] h-[25px]"
					tintColor={`${
						active ? "#deb020" : darkTheme ? "white" : "black"
					}`}
				/>
				{active && (
					<View
						className="h-1 w-2 rounded-full"
						style={{
							backgroundColor: "#deb020",
						}}
					/>
				)}
			</View>
		);
	} else if (name === "order") {
		return (
			<View className="items-center gap-1">
				{count >= 1 && (
					<View
						className={`absolute bg-red-500 rounded-full min-h-6 min-w-6 items-center justify-center -top-2 -right-2 z-20`}
					>
						<Text
							className={`${
								darkTheme ? "text-white" : " text-white"
							}`}
						>
							3
						</Text>
					</View>
				)}
				<Image
					source={require("../../assets/icons/ordernow-black.png")}
					className="w-[25px] h-[25px]"
					tintColor={`${
						active ? "#deb020" : darkTheme ? "white" : "black"
					}`}
				/>
				{active && (
					<View
						className="h-1 w-2 rounded-full"
						style={{
							backgroundColor: "#deb020",
						}}
					/>
				)}
			</View>
		);
	} else if (name === "profile") {
		return (
			<View className="items-center gap-1">
				<Image
					source={require("../../assets/icons/profile-black.png")}
					className="w-[25px] h-[25px]"
					tintColor={`${
						active ? "#deb020" : darkTheme ? "white" : "black"
					}`}
				/>
				{active && (
					<View
						className="h-1 w-2 rounded-full"
						style={{
							backgroundColor: "#deb020",
						}}
					/>
				)}
			</View>
		);
	}
};

export default TabIcon;
