import {
	View,
	Text,
	Dimensions,
	ScrollView,
	Image,
	Touchable,
	TouchableOpacity,
	TouchableWithoutFeedback,
	StyleSheet,
	useColorScheme,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import ComicText from "../styled-components/custom-texts/ComicText";
import { useNavigation, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import images from "@/constants/images/images";
import { UIThemeContext } from "@/context/ThemeContext";
import Animated from "react-native-reanimated";
import Context from "@/context/context";

type Props = {
	data?: any[];
	title?: string;
	loaded: boolean;
};
// Dimensions of the phone
const { width } = Dimensions.get("window");
// round off the dimensions
const wid = Math.ceil(width);

const FullHorizontalList = ({ title, data, loaded }: Props) => {
	// <--------------------<HOOKS>-------------------->
	const router = useRouter();
	const {fetchCart} = useContext(Context)
	const { currentTheme } = useContext(UIThemeContext);
	const darkTheme = currentTheme === "dark";

	if (!loaded) {
		return (
			<View className=" py-3">
				<View className="px-7">
					<Animated.View
						className={`${
							darkTheme ? "bg-gray-100/15" : "bg-gray-200"
						} w-[100px] h-3 rounded-full animate-pulse `}
					/>
				</View>
				<ScrollView
					contentContainerStyle={{
						height: 200,
						gap: wid * 0.05,
						paddingHorizontal: wid * 0.05,
						paddingVertical: 10,
					}}
					horizontal
					showsHorizontalScrollIndicator={false}
				>
					{[...Array(3)].map((item, index) => {
						return (
							<TouchableWithoutFeedback key={index}>
								<Animated.View
									className={`relative animate-pulse ${
										darkTheme ? "bg-gray-200/10" : "bg-white"
									} h-[190px] rounded shadow-x overflow-hidden`}
									style={{
										width: wid * 0.9,
									}}
								>
									<Animated.View className="w-full h-full justify-end overflow-hidden">
										<View
											className="w-full h-[60px] items-end flex-row gap-3  justify-between p-2 rounded self-center"
											// colors={[
											// 	"transparent",
											// 	darkTheme ? "black" : "white",
											// ]}
										>
											<View className="items-start gap-2">
												<Animated.View
													className={`w-[170px] h-3 rounded-full ${darkTheme?"bg-gray-100/15":"bg-gray-200"} `}
												/>
												<Animated.View
													className={`w-[100px] h-3 rounded-full ${darkTheme?"bg-gray-100/15":"bg-gray-200"} `}
												/>
											</View>
											<Animated.View className={`w-[100px] h-[35px] flex-row gap-1 items-center rounded ${darkTheme?"bg-gray-100/20":"bg-gray-200"} `}/>
										</View>
									</Animated.View>
								</Animated.View>
							</TouchableWithoutFeedback>
						);
					})}
				</ScrollView>
			</View>
		);
	}

	if(loaded && data?.length === 0){
		return
	}
	
	return (
		<View className=" py-1">
			<View className="px-7">
				<Text className={`font-semibold text-xl ${darkTheme?"text-white":"text-black"}`}>{title}</Text>
			</View>
			<ScrollView
				contentContainerStyle={{
					height: 200,
					gap: wid*0.05,
					paddingHorizontal: wid*0.05,
					paddingVertical: 10,
				}}
				horizontal
				showsHorizontalScrollIndicator={false}
			>
				{data?.map((item, index) => {
					return (
						<TouchableWithoutFeedback key={index}>
							<View
								className={`relative ${
									darkTheme ? "bg-black" : "bg-white"
								} h-[190px] rounded shadow-x overflow-hidden`}
								style={{
									width: wid *0.9,
								}}
							>
								<View className="w-full h-full justify-end overflow-hidden">
									<Image
										// source={{ uri: item.products[0].image_url }}
										source={{ uri: item.profile_pic }}
										className=" absolute w-full h-full rounded"
										style={{}}
										resizeMode="cover"
									/>
									<LinearGradient
										className="w-full h-[60px] items-end flex-row gap-3  justify-between p-2 rounded self-center"
										colors={[
											"transparent",
											darkTheme ? "black" : "white",
										]}
									>
										<View className="items-start">
											<ComicText
												text={
													item.business_name.length >
													42
														? item.business_name
																.substring(
																	0,
																	39
																)
																.trim() + "..."
														: item.business_name
												}
												style={
													darkTheme
														? "text-white"
														: "text-black"
												}
											/>
											<View className="flex-row items-center gap-2">
												<Image
													source={require("../../assets/icons/bike-black.png")}
													className="w-5 h-5"
													tintColor={
														darkTheme
															? "white"
															: "black"
													}
												/>
												<ComicText
													text={"40 mins away"}
													style={
														darkTheme
															? "text-gray-200"
															: "text-gray-600"
													}
												/>
											</View>
										</View>
										{/* ORDER NOW BUTTON */}
										<TouchableOpacity
											activeOpacity={0.6}
											onPress={() => {
												// router.push(
												// 	`/(screens)/vendor/[id:1]`
												// );
												// fetchCart()
											}}
										>
											<View className="px-5 py-2 flex-row gap-1 items-center rounded-2xl bg-accentbg">
												<Text className="text-black ">
													Order Now
												</Text>
												<Image
													source={require("../../assets/icons/ordernow-black.png")}
													className="w-5 h-5"
													tintColor={"black"}
												/>
											</View>
										</TouchableOpacity>
									</LinearGradient>
								</View>
							</View>
						</TouchableWithoutFeedback>
					);
				})}
			</ScrollView>
		</View>
	);
};

export default FullHorizontalList;
