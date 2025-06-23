
import {
	Text,
	View,
	Image,
	Dimensions,
	TouchableOpacity,
	TouchableWithoutFeedback,
	// Platform,
	StatusBar,
	ImageBackground,
	Alert,
	// AppRegistry,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
// import { StatusBar } from "expo-status-bar";
import { usePathname, useRouter } from "expo-router";
import ComicText from "@/components/styled-components/custom-texts/ComicText";
import HorizontalList from "@/components/common/HorizontalList";
import Reviews from "@/components/common/Reviews";
import BackButton from "@/components/ui/BackButton";
import Animated from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import icons from "@/constants/icons/icons";
import { UIThemeContext } from "@/context/ThemeContext";
import ApiRoutes from "@/API/routes/ApiRoutes";
import { useAuth } from "@clerk/clerk-expo";

type Props = {};

const { height: screenHeight } = Dimensions.get("window");

const VendorDetails = (props: Props) => {
	// <-------------------<HOOKES>------------------->
	const router = useRouter();
	const path = usePathname();
	const auth = useAuth();
	const { currentTheme } = useContext(UIThemeContext);
	const darkTheme = currentTheme === "dark";

	// <--------------------STATES----------------------->
	const [VendorDetails, setVendorDetails] = useState<any>();
	const [VendorDetailsLoaded, setVendorDetailsLoaded] = useState(false);

	// <-------------------VARIABLES--------------------->
	const token = auth.getToken();
	const vendorId = path.split("/")[2];

	// <-------------------FUNCTIONS--------------------->
	// API CALLS
	const fetchVendorDetails = async () => {
		try {
			const apiCall = await fetch(ApiRoutes.VendorShopDetails.path, {
				method: ApiRoutes.VendorShopDetails.method,
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "Application/json",
				},
				body: JSON.stringify({
					id: vendorId,
				}),
			});

			const response = await apiCall.json();
			setVendorDetails(response);
		} catch (error) {
			Alert.alert("Error", `An Error Occurred ${error}`);
		} finally {
			setVendorDetailsLoaded(true);
		}
	};

	// DUMMY DATA
	const image = true;
	const reviews = "500k+";

	// SCROLL FUNCTION TO CREATE SHADOW EFFECT

	// const shadowStyle = useAnimatedStyle(() => {
	// 	return {
	// 		backgroundColor: `rgba(0,0,0,${Opacity.value})`,
	// 	};
	// });

	
	useEffect(() => {
		fetchVendorDetails();
	}, []);

	return (
		<>
			<StatusBar
				barStyle={darkTheme ? "light-content" : "dark-content"}
				backgroundColor="transparent"
			/>

			<View
				className={`${
					darkTheme ? "bg-black" : "bg-white"
				} absolute gap-[20px] justify-between`}
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
					<TouchableOpacity activeOpacity={0.7} onPress={() => {}}>
						<View
							className={`w-12 h-12 items-center justify-center rounded-3xl ${
								darkTheme ? "bg-black" : "bg-white"
							} shadow-2xl shadow-black `}
						>
							<Image
								source={icons.like}
								className="w-7 h-7"
								tintColor={darkTheme ? "white" : "black"}
							/>
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
					>
						<View className="flex-1 pb-5">
							<TouchableWithoutFeedback>
								<View className="flex-1 ">
									{/* <-------------------------<BACKGROUND IMAGE>------------------------> */}
									<ImageBackground
										className="w-screen "
										source={{
											uri: VendorDetails?.profile_pic,
										}}
										style={{
											height: screenHeight * 0.3,
											marginBottom: -(
												screenHeight * 0.14
											),
										}}
									>
										<LinearGradient
											className="w-full h-full"
											colors={[
												darkTheme
													? "rgba(0,0,0,0.3)"
													: "rgba(255,255,255,0.3)",
												// darkTheme ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.2)",
												darkTheme
													? "rgba(0,0,0,0.4)"
													: "rgba(255,255,255,0.4)",
												darkTheme
													? "rgba(0,0,0,0.6)"
													: "rgba(255,255,255,0.6)",
												darkTheme
													? "rgba(0,0,0,1)"
													: "rgba(255,255,255,1)",
											]}
										></LinearGradient>
									</ImageBackground>

									{VendorDetailsLoaded ? (
										<View
											className={` ${
												image ? "p-4" : "p-4 "
											} gap-3 `}
											style={{}}
										>
											{/* <------------------------------<Brand logo if present>------------------------------>  */}
											<Image
												source={{
													uri: VendorDetails?.profile_pic,
												}}
												className={`h-[150px] w-[150px] self-center rounded-full ${
													darkTheme
														? ""
														: "bg-gray-50"
												} shadow-xl`}
												resizeMode="cover"
											/>
											{/* <--------------------------<SHOP NAME >------------------------------> */}
											<View className="flex-row justify-between items-start  gap-2 ">
												<View className="px-2">
													<Text
														className={`text-wrap text-2xl text-semibold ${
															darkTheme
																? "text-white"
																: "text-gray-800"
														}`}
													>
														{VendorDetails?.business_name
															.length > 50
															? VendorDetails?.business_name
																	.substring(
																		0,
																		50
																	)
																	.trim() +
																	"..."
															: VendorDetails?.business_name}
													</Text>
												</View>
											</View>
											{/* <---------------------------------<LINK TO MAPS>------------------------------------> */}
											<View className="flex-row  gap-2 px-2 items-start">
												<TouchableOpacity
													activeOpacity={0.7}
													onPress={() => {
														router.push(
															"/(screens)/Maps"
														);
													}}
												>
													<View className=" flex-row items-start gap-1 w-full">
														<Image
															source={require("../../../assets/icons/maps-black.png")}
															className="h-5 w-5 "
															tintColor={
																darkTheme
																	? "lightgray"
																	: "gray"
															}
														/>
														<ComicText
															text={`Find Us at ${
																VendorDetails?.location_address
																	.length > 50
																	? VendorDetails?.location_address
																			.substring(
																				0,
																				50
																			)
																			.trim() +
																			"..."
																	: VendorDetails?.location_address
															}`}
															style={`text-sm ${
																darkTheme
																	? "text-gray-300"
																	: "text-gray-600"
															} text-nowrap text-ellipsis`}
														/>
													</View>
												</TouchableOpacity>
											</View>
											{/* <---------------------------------<OPENING HOURS>-----------------------------------> */}
											<View className="px-2 flex-row items-center">
												<ComicText
													text={`Operating hours: `}
													style={`${
														darkTheme
															? "text-gray-400"
															: "text-gray-600"
													}`}
												/>
												<ComicText
													text={`Open from ${VendorDetails?.shift_start} to ${VendorDetails?.shift_end}`}
													style={`${
														darkTheme
															? "text-gray-200"
															: "text-gray-400"
													}`}
												/>
											</View>
											{/* <-------------------------------<EST DELIVERY TIME>---------------------------------> */}
											<View className="px-2 flex-row items-center">
												<ComicText
													text={`Estimated delivery time: 30-45 mins `}
													style={`${
														darkTheme
															? "text-gray-400"
															: "text-gray-600"
													}`}
												/>
											</View>
											{/* <-------------------------------------<RATINGS>-------------------------------------> */}
											<View
												className={`flex-row gap-2 items-center ${
													darkTheme
														? "bg-gray-100/10"
														: "bg-gray-100"
												} mb-[25px] p-1 pl-3 justify-between max-w-[99%] flex- rounded-full `}
											>
												<View className="flex-row gap-2 flex-1 items-center">
													<View className="justify-center">
														<ComicText
															text={`Rating: `}
															style={
																darkTheme
																	? "text-white"
																	: "text-black"
															}
														/>
													</View>

													{/* <--------------------------------<RATE STARS>--------------------------------> */}
													<View className="flex-row gap-1 items-center  h-7">
														{[...Array(Math.round(VendorDetails?.rating))].map((i, index) => {
															return (
																<Text
																	key={index}
																>
																	⭐
																</Text>
															);
														})}
														<View
															className={`h-full pt-2`}
														>
															<ComicText
																text={` ${VendorDetails?.rating}`}
																style={
																	darkTheme
																		? "text-white"
																		: "text-black"
																}
															/>
														</View>
													</View>
												</View>
												<View className="border-l px-7 flex-row items-center justify-end p-2 border-gray-600 h-full">
													<ComicText
														text={`from ${reviews} reviews`}
														style={
															darkTheme
																? "text-white text-sm"
																: "text-black text-sm"
														}
													/>
												</View>
											</View>
											{/* <--------------------------------<FEATURED PRODUCTS>--------------------------------> */}
										</View>
									) : (
										<View
											className={` ${
												image ? "p-4" : "p-4 "
											} gap-5 `}
											style={{}}
										>
											{/* <------------------------------<Brand logo if present>------------------------------>  */}
											<Animated.View
												className={`h-[150px] w-[150px] self-center rounded-full ${
													darkTheme
														? "bg-gray-200/20"
														: "bg-gray-50"
												} animate-pulse`}
											/>
											{/* <--------------------------<SHOPNAME AND LINK TO MAPS>------------------------------> */}
											<Animated.View
												className={`h-3 w-[90%] rounded-full animate-pulse ${
													darkTheme
														? "bg-gray-200/20"
														: "bg-gray-200"
												}`}
											/>
											{/* <---------------------------------<LINK TO MAPS>------------------------------------> */}
											<Animated.View
												className={`h-3 w-[40%] rounded-full animate-pulse ${
													darkTheme
														? "bg-gray-200/20"
														: "bg-gray-200"
												}`}
											/>
											{/* <---------------------------------<OPENING HOURS>-----------------------------------> */}
											<Animated.View
												className={`h-3 w-[60%] rounded-full animate-pulse ${
													darkTheme
														? "bg-gray-200/20"
														: "bg-gray-200"
												}`}
											/>
											{/* <-------------------------------<EST DELIVERY TIME>---------------------------------> */}
											<Animated.View
												className={`h-3 w-[65%] rounded-full animate-pulse ${
													darkTheme
														? "bg-gray-200/20"
														: "bg-gray-200"
												}`}
											/>
											{/* <-------------------------------------<RATINGS>-------------------------------------> */}
											<Animated.View
												className={`h-[35px] w-full rounded-full animate-pulse ${
													darkTheme
														? "bg-gray-200/20"
														: "bg-gray-200"
												}`}
											/>
											{/* <--------------------------------<FEATURED PRODUCTS>--------------------------------> */}
										</View>
									)}
									{/* <---------------------------------<HORIZONTAL LISTS>---------------------------------> */}
									<View className=" gap-4">
										{/* {offer && (
											<View className="pt-4">
												<HorizontalList
													title={
														"Our Deals and Offers"
													}
													type={"product"}
												/>
											</View>
										)} */}
										<HorizontalList
											title={"Our Products"}
											type={"product"}
											data={VendorDetails?.products}
											loaded={VendorDetailsLoaded}
										/>
									</View>
									{/* <-------------------------------------<REVIEWS>-------------------------------------> */}
									<View className="p-4">
										{/* <Reviews /> */}
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
