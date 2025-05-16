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
} from "react-native";
import React, { useEffect, useState } from "react";
import ComicText from "../styled-components/custom-texts/ComicText";
import { useNavigation, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import images from "@/constants/images/images";

type Props = {
	data?: any[];
	title?: string;
};
// Dimensions of the phone
const { width, height } = Dimensions.get("window");
// round off the dimensions
const wid = Math.ceil(width);
const hei = Math.ceil(height);
// change the rounded values from number tostring
const wscreen = wid.toString();
const hscreen = hei.toString();

const FullHorizontalList = ({ title }: Props) => {
	// <--------------------<HOOKS>-------------------->
	const router = useRouter();
	// dammy data
	const data = [1, 2, 3, 4, 5, 6];
	const shopName =
		"Getrude shop rongai near Maasai lodge opposite Extreme shop ";

	return (
		<View className=" py-1">
			<View className="px-7">
				{/* <ComicText text={`${title}`} style={"text-xl"} /> */}
			</View>
			<ScrollView
				contentContainerStyle={{
					height: 200,
					gap: 20,
					paddingHorizontal: 20,
					paddingVertical: 10,
				}}
				horizontal
				showsHorizontalScrollIndicator={false}
			>
				{data.map((item, index) => {
					

					return (
						<TouchableWithoutFeedback key={index}>
							<View
								className="relative bg-white h-[190px] border border-gray-100 rounded-xl shadow-xl overflow-hidden"
								style={{
									width: wid * 0.9,
								}}
							>
								<View className="w-full h-full justify-end overflow-hidden">
									<Image
										source={images.water_bottles}
										className=" absolute w-full h-full"
										style={{}}
										resizeMode="cover"
									/>
									<LinearGradient
										className="w-full h-[60px] items-end flex-row gap-3  justify-between p-2 rounded-xl self-center"
										colors={["transparent", "white"]}
									>
										<View className="items-start">
											<ComicText
												text={
													shopName.length > 42
														? shopName
																.substring(
																	0,
																	39
																)
																.trim() + "..."
														: shopName
												}
												style={"text-black"}
											/>
											<View className="flex-row items-center gap-2">
												<Image
													source={require("../../assets/icons/bike-black.png")}
													className="w-5 h-5"
													tintColor={"black"}
												/>
												<ComicText
													text={"40 mins away"}
													style="text-gray-600"
												/>
											</View>
										</View>
										<TouchableOpacity
											activeOpacity={0.6}
											onPress={() => {
												router.push(
													`/(screens)/vendor/[id:1]`
												);
											}}
										>
											<View className="px-3 py-2 flex-row gap-1 items-center rounded-xl bg-accentbg">
												<Text className="text-whie">
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
