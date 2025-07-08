import { View, Text, Image } from "react-native";
import React, { useContext } from "react";
import { UIThemeContext } from "@/context/ThemeContext";

type Props = {};

const BackButton = (props: Props) => {

	const { currentTheme } = useContext(UIThemeContext);
	const darkTheme = currentTheme === "dark";
	return (
		<View
			className={`p-2 rounded-full ${darkTheme?"bg-black":"bg-accentbg"} flex-row w-[45px] h-[45px] items-center justify-center`}
			style={{
				boxShadow: `2px 2px 20px ${darkTheme?"#f1f1f140" : "#00000070"}`,
				zIndex: 20,
			}}
		>
			<View className={`pr-1`}>
				<Image
					source={require("../../assets/icons/back-arrow-black.png")}
					className="h-7 w-7"
					tintColor={darkTheme?"#d9a31b":"black"}
				/>
			</View>
		</View>
	);
};

export default BackButton;
