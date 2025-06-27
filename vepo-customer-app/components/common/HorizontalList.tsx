import {
	View,
	Text,
	ScrollView,
	TouchableWithoutFeedback,
	TouchableOpacity,
	Dimensions,
	Image,
	useColorScheme,
	Modal,
} from "react-native";
import React, { useContext, useState } from "react";
import ComicText from "../styled-components/custom-texts/ComicText";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { UIThemeContext } from "@/context/ThemeContext";
import Animated from "react-native-reanimated";
import icons from "@/constants/icons/icons";
import ApiRoutes from "@/API/routes/ApiRoutes";
import { useAuth } from "@clerk/clerk-expo";
import Context from "@/context/context";

const { width, height } = Dimensions.get("screen");
const w = Math.ceil(width);
const h = Math.ceil(height);

type Props = {
	title: string;
	type?: string;
	data?: any[];
	loaded?: boolean;
};

const HorizontalList = ({ title, type, data, loaded }: Props) => {
	// <-----------------<HOOKS>----------------->
	const router = useRouter();
	const { currentTheme } = useContext(UIThemeContext);
	const { fetchCart } = useContext(Context)
	const darkTheme = currentTheme === "dark";
	const { getToken } = useAuth()

	const [AddToCartLoading, setAddToCartLoading] = useState(false)

	// <----------------FUNCTIONS----------------> 
	// API CALLS
	const AddToCart = async (id: string) =>{
		setAddToCartLoading(true)
		const token = await getToken()
		const payload = {
			id: id,
			quantity: 1
		}
		try {
			const apiCall = await fetch(ApiRoutes.AddToCart.path, {
				method : ApiRoutes.AddToCart.method,
				headers : {
					"Authorization": `Bearer ${token}`,
					"Content-Type": "Application/json"
				},
				body: JSON.stringify(payload)
			})

			const response = await apiCall.json()
			fetchCart().then(() => {
				setAddToCartLoading(false);
			})
		} catch (error: any) {
			setAddToCartLoading(false);
			// console.log(error.message)
		}
	}

	if (!loaded) {
		return (
			<View className={`  ${darkTheme ? "" : ""} shadow-2x`}>
				<View className="px-5  justify-between flex-row items-center">
					<Animated.View
						className={`${
							darkTheme ? "bg-gray-100/15" : "bg-gray-200"
						} w-[100px] h-3 rounded-full animate-pulse`}
					/>
				</View>
				<ScrollView
					horizontal={true}
					contentContainerStyle={{
						gap: 10,
						padding: 5,
						height: w * 0.4,
					}}
					scrollEnabled={true}
					showsHorizontalScrollIndicator={false}
					className="py-1 "
				>
					<View className="flex-row gap-3 px-3">
						{[...Array(3)].map((item, index) => {
							return (
								<TouchableOpacity
									key={index}
									activeOpacity={0.9}
								>
									<Animated.View
										className={`overflow-hidden justify-end animate-pulse ${
											darkTheme
												? "bg-gray-200/10 rounded"
												: "bg-white  rounded"
										}  h-full`}
										style={{
											width: w * 0.39,
										}}
									>
										<View
											className="justify-end h-[45%] px-1 pb-1"
											// colors={[
											// 	"transparent",
											// 	darkTheme ? "black" : "white",
											// ]} 
										>
											<View className="gap-2">
												{/* <-----------------<RENDER ACCORDING TO TYPE OF LIST>-----------------> */}
												{type === "product" ? (
													<Animated.View
														className={`h-3 w-[70%] ${
															darkTheme
																? "bg-gray-100/15"
																: "bg-gray-200"
														} rounded-full `}
													/>
												) : (
													<Animated.View
														className={`h-3 w-[70%] ${
															darkTheme
																? "bg-gray-100/15"
																: " bg-gray-200"
														} rounded-full `}
													/>
												)}

												{/* <-----------------<RENDER ACCORDING TO TYPE OF LIST>-----------------> */}
												{type === "product" ? (
													// <---------------------<PRODUCT PRICE>--------------------->
													<Animated.View
														className={`h-3 w-[60%] ${
															darkTheme
																? "bg-gray-100/15"
																: " bg-gray-200"
														} rounded-full `}
													/>
												) : (
													// <------------------------<RATING>------------------------->
													<View className="flex-row gap-3 justify-between items-center  h-7">
														<Animated.View
															className={`h-3 w-[60%] ${
																darkTheme
																	? "bg-gray-100/15"
																	: " bg-gray-200"
															} rounded-full `}
														/>
														<View className="flex-row gap-1 items-center">
															<Text></Text>
															<Animated.View
																className={`h-3 w-5 ${
																	darkTheme
																		? "bg-gray-100/15"
																		: " bg-gray-200"
																} rounded-full `}
															/>
														</View>
													</View>
												)}

												{/* <--------------------<ADD TO CART BUTTON>--------------------> */}
												{type === "product" ? (
													<>
														<TouchableOpacity
															activeOpacity={0.6}
															style={{
																position:
																	"absolute",
																bottom: 1,
																right: 2,
															}}
														>
															<Animated.View
																className={`h-[30px] w-[30px] ${
																	darkTheme
																		? "bg-gray-100/15"
																		: " bg-gray-200"
																} rounded `}
															/>
														</TouchableOpacity>
													</>
												) : (
													<></>
												)}
											</View>
										</View>
									</Animated.View>
								</TouchableOpacity>
							);
						})}
					</View>
				</ScrollView>
			</View>
		);
	}

	return (
		<View className={`  ${darkTheme ? "" : ""} shadow-2x`}>
			<View className="px-5  justify-between flex-row items-center">
				{/* <ComicText
					text={title}
					style={
						darkTheme ? "text-lg text-white" : "text-lg text-black"
					}
				/> */}
				<Text className={`${darkTheme ? "text-lg text-white" : "text-lg text-black"}`}>{title}</Text>
			</View>
			<ScrollView
				horizontal={true}
				contentContainerStyle={{
					gap: 10,
					padding: 5,
					height: w * 0.4,
				}}
				scrollEnabled={true}
				className="pb-1 "
			>
				<View className="flex-row gap-2 px-3">
					{data?.map((item, index) => {
						return (
							<TouchableOpacity
								key={index}
								onPress={() => {
									if (type === "product") {
										router.push(`/product-details/${item.id}`);
									} else {
										router.push(`/vendor/${item.id}`);
									}
								}}
								activeOpacity={0.9}
							>
								<View
									className={`overflow-hidden  rounded shadow justify-end ${
										darkTheme
											? "bg-black "
											: "bg-white border border-gray-100"
									}  h-full`}
									style={{
										width: w * 0.39,
									}}
								>
									{/* IMAGE */}
									<View className=" absolute w-full h-full ">
										{
											type == "product" ? (
												<Image
													source={{uri : item.image_url}}
													className="w-full h-full rounded"
													resizeMode="cover"
												/>
											):(
												<Image
													source={{uri : item.profile_pic}}
													className="w-full h-full rounded"
													resizeMode="cover"
												/>
											)
										}
									</View>
									<LinearGradient
										className="justify-end h-[45%] px-1 pb-1"
										colors={[
											"transparent",
											darkTheme ? "black" : "white",
										]}
									>
										<View>
											{/* <-----------------<RENDER ACCORDING TO TYPE OF LIST>-----------------> */}
											{type === "product" ? (
												<Text
													className={
														darkTheme
															? "text-white text-wrap"
															: "text-black text-wrap"
													}
												>
													{item.name.length > 20
														? item.name
																.substring(
																	0,
																	21
																)
																.trim() + "..."
														: item.name}
												</Text>
											) : (
												<Text
													className={
														darkTheme
															? "text-white text-wrap"
															: "text-black text-wrap"
													}
												>
													{item.business_name.length > 23
														? item.business_name
																.substring(
																	0,
																	23
																)
																.trim() + "..."
														: item.business_name}
												</Text>
											)}

											{/* <-----------------<RENDER ACCORDING TO TYPE OF LIST>-----------------> */}
											{type === "product" ? (
												// <---------------------<PRODUCT PRICE>--------------------->
												<View>
													<Text className="text-accentbg">
														{item.price - item.discount}
													</Text>
												</View>
											) : (
												// <------------------------<RATING>------------------------->
												<View className="flex-row gap-3 justify-between items-center  h-7">
													<View className="flex-row gap-1 items-center">
														<Image
															source={icons.bike}
															className="w-5 h-5"
															tintColor={
																darkTheme
																	? "lightgray"
																	: "gray"
															}
														/>
														<ComicText
															text={"Est 40 mins"}
															style={
																darkTheme
																	? "text-gray-300"
																	: "text-gray-700"
															}
														/>
													</View>
													<Text
														className={`${
															darkTheme
																? "text-gray-400"
																: "text-black"
														}`}
													>
														⭐ {item.rating}
													</Text>
												</View>
											)}

											{/* <--------------------<ADD TO CART BUTTON>--------------------> */}
											{type === "product" ? (
												<>
													<TouchableOpacity
														activeOpacity={0.6}
														style={{
															position:
																"absolute",
															bottom: 1,
															right: 2,
														}}
														onPress={()=> {
															AddToCart(item.id)
														}}
													>
														<View className="bg-accentbg p-2 rounded">
															<Image
																source={require("../../assets/icons/addtocart-black.png")}
																className="w-5 h-5"
																tintColor={
																	"white"
																}
															/>
														</View>
													</TouchableOpacity>
												</>
											) : (
												<></>
											)}
										</View>
									</LinearGradient>
								</View>
							</TouchableOpacity>
						);
					})}
				</View>
			</ScrollView>
			<Modal visible={AddToCartLoading} backdropColor={"transparent"}>
				<View className={`items-center justify-end w-full h-full`}>
					<View
						className={`w-full h-[100px] ${darkTheme?"bg-black":"bg-white"} rounded items-center justify-center `}
					>
							<View className={`flex-row items-center gap-3`}>
								<Animated.View className={`animate-spin`}>
									<Image
										source={icons.spinner}
										className={`w-10 h-10`}
									/>
								</Animated.View>
								<Text className={`${darkTheme?"text-white":"text-black"}`}>Adding Item To Cart</Text>
							</View>
					</View>
				</View>
			</Modal>
		</View>
	);
};

export default HorizontalList;
