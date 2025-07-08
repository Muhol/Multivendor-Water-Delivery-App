// export const unstable_settings = {
//   animation: "slide_from_right",
// };

import {
	View,
	Text,
	Image,
	ScrollView,
	Dimensions,
	TouchableOpacity,
	StatusBar,
	ImageBackground,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
//   import { StatusBar } from "expo-status-bar";
import BackButton from "@/components/ui/BackButton";
import ComicText from "@/components/styled-components/custom-texts/ComicText";
import CartItem from "@/components/common/CartItem";
import Button from "@/components/ui/Button";
import { useRouter } from "expo-router";
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import icons from "@/constants/icons/icons";
import { UIThemeContext } from "@/context/ThemeContext";
import BackButtonMinimal from "@/components/ui/BackButtonMinimal";
import { useAuth } from "@clerk/clerk-expo";
import ApiRoutes from "@/API/routes/ApiRoutes";
import images from "@/constants/images/images";

const { width, height } = Dimensions.get("screen");

export default function Cart() {
	// <--------------HOOKS---------------->
	const router = useRouter();
	const {currentTheme} = useContext(UIThemeContext);
	const darkTheme = currentTheme === "dark"
	const { getToken } = useAuth()
	
	// <--------------STATES--------------->
	const [Cart, setCart] = useState<any>()
	const [CartLoaded, setCartLoaded] = useState(false)
	// const CartLoaded = false
	// <-------------VARIABLES------------->

	// <-------------FUNCTIONS------------->
	// API CALLS
	const fetch_cart = async () => {
		// setCartLoaded(false)
		const token = await getToken()
		try {
			const apiCall = await fetch(ApiRoutes.GetDetailedCart.path, {
				method: ApiRoutes.GetDetailedCart.method,
				headers: {
					"Authorization" : `Bearer ${token}`,
					"Content-Type" : "Application/json"
				}
			})

			const response = await apiCall.json()
			setCart(response)
		} catch (error: any) {
		}finally{
			setCartLoaded(true)
		}
	}

	useEffect(()=>{
		fetch_cart()
	},[])

	return (
		<>
			<StatusBar
				translucent
				backgroundColor={darkTheme?"black":"white"}
				barStyle={darkTheme?"light-content":"dark-content"}
			/>

			<View className={`flex-1 w-full ${darkTheme?"bg-black":"bg-white"}`}>
				<Animated.View className="flex-1 pb-2">
					<View className={`w-full z-30  ${darkTheme?"bg-black":"bg-white"} shadow-2xl bg-gray flex-row items-center px-5 `}>
						<View
							className="flex-row items-center w-full h-[70px]"
							style={{
								marginTop: StatusBar.currentHeight,
							}}
						>
							<TouchableOpacity
								className=""
								onPress={() => router.back()}
								activeOpacity={0.6}
							>
								<BackButtonMinimal/>
							</TouchableOpacity>
							<View className="w-[100%] absolute h-full justify-center items-center">
								<Text className={`text-3xl ${darkTheme?"text-white":"text-black"}`}>Cart</Text>
							</View>
						</View>
					</View>
					<View className="flex-1 gap-3">
						<ScrollView
							className="flex-1"
							showsVerticalScrollIndicator={false}
							overScrollMode="never"
							snapToAlignment="start"
							scrollEventThrottle={16} // required for smooth/fast updates
						>
							{CartLoaded && Cart?.cart_item.length === 0 ? (
								<View className="min-h-full w-full justify-center items-center">
									<Image source={images.empty_cart} className={`max-w-[300px] max-h-[300px]`}/>
									<View className={`flex-col gap-1 items-center`}>
										<Text className={`${darkTheme?"text-white":"text-black"}`}>
											You've not yet added anything to your cart 
										</Text>
										<TouchableOpacity
											activeOpacity={0.5}
											onPress={()=>{
												router.push("/(screens)")
											}}
										>
											<View className={`py-1`}>
												<Text
													style={{
														textDecorationLine: "underline"
													}}
													className={`text-accentbg`}
												>
													Continue Shopping 
												</Text>
											</View>
										</TouchableOpacity>
									</View>
								</View>
							):(
								<View className="min-h-full  p-4 gap-5 ">
									{/* Cart Header */}

									{/* Cart Items */}
									<View className=" gap-3">
										{!CartLoaded ? (
											[...Array(3)].map((i , index)=>{
												return(
													<Animated.View key={index} className={`flex-row gap-2 py-2  justify-between animate-pulse`}>
														{/* LEFT */}
														<Animated.View className={`flex-row gap-2 items-center`}>
															<Animated.View className={`w-[90px] h-[90px] rounded-lg ${darkTheme?"bg-gray-100/20":"bg-gray-200"}`}/>
														</Animated.View>
														{/* MIDDLE */}
														<Animated.View className={`gap-1 `}>
															<Animated.View className={`w-[150px] h-3 rounded-full ${darkTheme?"bg-gray-100/20":"bg-gray-200"}`}/>
															<Animated.View className={`w-[50px] h-3 rounded-full ${darkTheme?"bg-gray-100/20":"bg-gray-200"}`}/>
															<Animated.View className={`flex-row gap-3 items-center`}>
																<Animated.View className={`w-3 h-3 rounded-full ${darkTheme?"bg-gray-100/20":"bg-gray-200"}`}/>
																<Animated.View className={`w-3 h-3 rounded-full ${darkTheme?"bg-gray-100/20":"bg-gray-200"}`}/>
																<Animated.View className={`w-3 h-3 rounded-full ${darkTheme?"bg-gray-100/20":"bg-gray-200"}`}/>
															</Animated.View>
														</Animated.View>
														{/* RIGHT */}
														<Animated.View className={` gap-6 items-end `}>
															<Animated.View className={`w-[50px] h-3 rounded-full ${darkTheme?"bg-gray-100/20":"bg-gray-200"}`}/>
															<Animated.View className={`w-[40px] h-[40px] rounded-lg ${darkTheme?"bg-gray-100/20":"bg-gray-200"}`}/>
														</Animated.View>
													</Animated.View>
												)
											})
											): (
												Cart?.cart_item.map((item: any) => {
													return(
														<CartItem  data={item} key={item.id} func={ async () => {fetch_cart()}}  />
													)
												})
											)}
									</View>

									{/* Total */}
									{
										CartLoaded && Cart?.cart_item.length > 0 && (
											<View className="h-[150px] w-full gap-2 py-3 ">
												<View className="flex-row justify-between px-3">
													<Text className={`text-xl ${darkTheme? 'text-white' : 'text-black'}`}>
														Subtotal :{" "}
													</Text>
													<Text className={`text-2xl font-semibold ${darkTheme? 'text-white' : 'text-black'}`}>
														{" "}
														{`${Cart?.total_amount}`}
													</Text>
												</View>
												<View className={`flex-row  justify-between px-3 pb-3 border-b ${darkTheme?'border-gray-700':'border-gray-200'} `}>
													<Text className={`text-xl ${darkTheme? 'text-white' : 'text-black'}`}>
														Delivery Fee :{" "}
													</Text>
													<Text className={`text-2xl font-semibold ${darkTheme? 'text-white' : 'text-black'}`}>
														{" "}
														{`${"50.00"}`}
													</Text>
												</View>
												<View className="flex-row px-3 justify-end">
													<Text className={`text-2xl font-semibold ${darkTheme? 'text-white' : 'text-black'}`}>
														{Cart?.total_amount}
													</Text>
												</View>
											</View>
										)
									}
								</View>
							)}
						</ScrollView>
					</View>
					{/* Place Order Button */}
					<LinearGradient
						className=" py-1 items-center justify-end h-[100px] -mt-[100px] px-6"
						colors={[
							"transparent",
							darkTheme?"rgba(0, 0, 0, 0.7)":"rgba(255, 255, 255, 0.7)",
							darkTheme?"black":"white" ,
						]}
					>
						{
							CartLoaded && Cart?.cart_item.length > 0 && (
								<View className="items-center w-full flex-row">
									<View className="flex-row flex-1 items-end gap-2">
										<Text className={`text-2xl font-semibold ${darkTheme? 'text-white' : 'text-black'}`}>
											KSH {Cart?.total_amount}{" "}
										</Text>
									</View>
									<TouchableOpacity className="" activeOpacity={0.7}>
										<Button
											style={"rounded-xl py-2 px-5"}
											label={"Checkout"}
											textStyle={`text-lg ${darkTheme?"text-black":"text-gray-200"}`}
										/>
									</TouchableOpacity>
								</View>
							)
						}
					</LinearGradient>
				</Animated.View>
			</View>
		</>
	);
}
