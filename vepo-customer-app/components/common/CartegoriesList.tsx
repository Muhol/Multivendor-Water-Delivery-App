import { View, Text, ScrollView, TouchableOpacity, useColorScheme } from "react-native";
import React, { useContext, useState } from "react";
import { UIThemeContext } from "@/context/ThemeContext";

type Props = {
	data: string[];
};

const CartegoriesList = ({ data }: Props) => {
	// <----------------HOOKS---------------->
	const {currentTheme} = useContext(UIThemeContext);
	const darkTheme = currentTheme === "dark"

	// <---------------STATES---------------->
    const [active , setActive] = useState(0);

	return (
		<ScrollView
			horizontal={true}
			className="shadow-xl"
            showsHorizontalScrollIndicator={false}
			contentContainerStyle={{
				paddingHorizontal: 10,
				gap: 10,
                paddingVertical: 5
			}}
		>
			{data.map((i,index) => {
				return (
                    <TouchableOpacity
                        key={index}
                        activeOpacity={0.7}
                        onPress={()=>{
                            setActive(index)
                        }}
                    >
                        <View className={`py-3 z-30 px-4 justify-center rounded-full ${active === index ? darkTheme ? "bg-gray-400" : "bg-black" : darkTheme ? "bg-gray-800" : "bg-white"} shadow-x`}>
                            <Text className={`${active === index ? "text-white": darkTheme ? "text-white":"text-black" }`} >{i}</Text>
                        </View>
                    </TouchableOpacity>
				);
			})}
		</ScrollView>
	);
};

export default CartegoriesList;
