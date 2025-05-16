// export const unstable_settings = {
//   animation: "slide_from_right", // Applies slide animation when navigating to this screen
// };
import {
	Text,
	View,
	Image,
	Dimensions,
	TouchableOpacity,
	TouchableWithoutFeedback,
	Platform,
	StatusBar,
	ImageBackground,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
// import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import ComicText from "@/components/styled-components/custom-texts/ComicText";
import HorizontalList from "@/components/common/HorizontalList";
import Reviews from "@/components/common/Reviews";
import BackButton from "@/components/ui/BackButton";
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import icons from "@/constants/icons/icons";

type Props = {};

const { height: screenHeight } = Dimensions.get("window");

const VendorDetails = (props: Props) => {
	// <-------------------<HOOKES>------------------->
	const router = useRouter();
	// DUMMY DATA
	const shopname =
		"Lorem ipsum dolor sit amet consectetur, adipisicing elit. Officia iusto nesciunt odio";
	const shopaddress =
		"laboriosam assumenda animia alias aut, repudiandae amet explicabo neque, maxime at minima distinctio";
	const rate = [1, 2, 3, 4, 5];
	const image = true;
	const reviews = "500k+";
	const offer = true;

	// SCROLL FUNCTION TO CREATE SHADOW EFFECT
	const Opacity = useSharedValue(0);

	const shadowStyle = useAnimatedStyle(() => {
		return {
			backgroundColor: `rgba(0,0,0,${Opacity.value})`,
		};
	});

	const handleScroll = (event: {
		nativeEvent: { contentOffset: { y: any } };
	}) => {
		const yOffset = event.nativeEvent.contentOffset.y;
		if (yOffset >= 70) {
			Opacity.value = withTiming(0.2);
		} else {
			Opacity.value = withTiming(0.0, { duration: 300 });
		}
	};

	return (
		<>
			<StatusBar barStyle="dark-content" backgroundColor="transparent" />

			<View
				className="bg-white absolute gap-[20px] justify-between"
				style={{
					flex: 1,
				}}
			>
				{/* <--------------------------<STICKY TOP BAR>--------------------------> */}
				<View
					className="absolute z-20 w-full  h-[70px] px-5 items-center justify-between flex-row"
					style={{
						marginTop: StatusBar.currentHeight,
					}}
				>
					{/* BACK BUTTON */}
					<TouchableOpacity
						activeOpacity={0.7}
						onPress={() => {
							router.back();
						}}
					>
						<BackButton />
					</TouchableOpacity>
					{/* LIKE BUTTON */}
					<TouchableOpacity
						activeOpacity={0.7}
						onPress={()=>{

						}}
					>
						<View className="w-12 h-12 items-center justify-center rounded-3xl bg-white shadow-2xl shadow-black ">
							<Image source={icons.like} className="w-7 h-7" tintColor={"black"}/> 
						</View>
					</TouchableOpacity>
				</View>

				{/* <--------------------------<EXTENDABLE SRCOLLVIEW>--------------------------> */}
				<View
					style={{
						height: screenHeight,
					}}
				>
					<Animated.ScrollView
						overScrollMode={"never"}
						showsVerticalScrollIndicator={false}
						onScroll={handleScroll}
					>
						<View className="flex-1 pb-5">
							<TouchableWithoutFeedback>
								<View className="flex-1 ">
									{/* <-------------------------<BACKGROUND IMAGE>------------------------> */}
									<ImageBackground
										className="w-screen "
										source={require("../../../assets/prop-images/dasani.png")}
										style={{
											height: screenHeight * 0.3,
											marginBottom: -(screenHeight * 0.1),
										}}
									>
										<LinearGradient
											className="w-full h-full"
											colors={[
												"transparent",
												"rgba(255,255,255,0.3)",
												"rgba(255,255,255,0.6)",
												"white",
											]}
										></LinearGradient>
									</ImageBackground>
									<View
										className={` ${
											image ? "p-4" : "p-4 "
										} gap-5 `}
										style={{}}
									>
										{/* <------------------------------<Brand logo if present>------------------------------>  */}
										{image && (
											<Image
												source={require("../../../assets/prop-images/Dasani-Logo-2016.png")}
												className="h-[150px] w-[150px] self-center rounded-full bg-gray-50 shadow-xl"
												resizeMode="contain"
											/>
										)}
										{/* <--------------------------<SHOPNAME AND LINK TO MAPS>------------------------------> */}
										<View className="flex-row justify-between items-start  gap-2 ">
											<View className="px-2">
												<Text className="text-wrap text-2xl text-semibold text-gray-800">
													{shopname.length > 50
														? shopname
																.substring(0, 50)
																.trim() + "..."
														: shopname}
												</Text>
											</View>
										</View>
										{/* <---------------------------------<LINK TO MAPS>------------------------------------> */}
										<View className="flex-row  gap-2 px-2 items-start">
											<TouchableOpacity
												activeOpacity={0.7}
												onPress={()=>{
													router.push('/(screens)/Maps')
												}}
											>
												<View className=" flex-row items-center gap-1 w-[95%]">
													<Image
														source={require("../../../assets/icons/maps-black.png")}
														className="h-5 w-5"
														tintColor={"gray"}
													/>
													<ComicText
														text={`Find Us at ${
															shopaddress.length > 50
																? shopaddress
																		.substring(
																			0,
																			50
																		)
																		.trim() +
																"..."
																: shopaddress
														}`}
														style=" text-sm text-gray-500 text-wrap "
													/>
												</View>
											</TouchableOpacity>
										</View>
										{/* <---------------------------------<OPENING HOURS>-----------------------------------> */}
										<View className="px-2 flex-row items-center">
											<ComicText
												text={`Operating hours: `}
												style="text-gray-600"
											/>
											<ComicText
												text={`Open from ${"8:00AM"} to ${"9:00PM"}`}
												style="text-gray-400"
											/>
										</View>
										{/* <-------------------------------<EST DELIVERY TIME>---------------------------------> */}
										<View className="px-2 flex-row items-center">
											<ComicText
												text={`Estimated delivery time: 30-45 mins `}
												style="text-gray-600"
											/>
										</View>
										{/* <-------------------------------------<RATINGS>-------------------------------------> */}
										<View className="flex-row gap-2 items-center bg-gray-100 mb-[25px] p-1 pl-3 justify-between max-w-[99%] flex- rounded-full ">
											<View className="flex-row gap-2 flex-1 items-center">
												<View className="justify-center">
													<ComicText
														text={`Rating: `}
														style="text-semibold"
													/>
												</View>

												{/* <--------------------------------<RATE STARS>--------------------------------> */}
												<View className="flex-row gap-1 items-center  h-7">
													{rate.map((i, index) => {
														return (
															<Text key={index}>
																⭐
															</Text>
														);
													})}
													<ComicText
														text={` ${"4.3"}`}
														style="text-semibold"
													/>
												</View>
											</View>
											<View className="border-l px-7 flex-row items-center justify-end p-2 border-gray-200 h-full">
												<ComicText
													text={`from ${reviews} reviews`}
													style="text-sm"
												/>
											</View>
											
										</View>
										{/* <--------------------------------<FEATURED PRODUCTS>--------------------------------> */}
									</View>
									{/* <---------------------------------<HORIZONTAL LISTS>---------------------------------> */}
									<View className=" gap-4">
										{offer && (
											<View className="pt-4">
												<HorizontalList
													title={"Our Deals and Offers"}
													type={"product"}
												/>
											</View>
										)}
										<HorizontalList
											title={"Our Products"}
											type={"product"}
										/>
									</View>
									{/* <-------------------------------------<REVIEWS>-------------------------------------> */}
									<View className="p-4">
										<Reviews />
									</View>
								</View>
							</TouchableWithoutFeedback>
						</View>
					</Animated.ScrollView>
				</View>
			</View>
		</>
	);
};

export default VendorDetails;
