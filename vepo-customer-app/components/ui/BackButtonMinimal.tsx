import { View, Text, Image } from "react-native";
import React, { useContext } from "react";
import icons from "@/constants/icons/icons";
import { UIThemeContext } from "@/context/ThemeContext";

type Props = {};

const BackButtonMinimal = (props: Props) => {
	const { currentTheme } = useContext(UIThemeContext);
	const darkTheme = currentTheme === "dark";
	return (
		<View
			className={`w-12 h-12 items-center justify-center ${
				darkTheme ? "bg-black" : "bg-white"
			} rounded-xl`}
		>
			<Image
				source={icons.leftArrow}
				className="w-8 h-8"
				tintColor={darkTheme ? "white" : "black"}
			/>
		</View>
	);
};

export default BackButtonMinimal;
