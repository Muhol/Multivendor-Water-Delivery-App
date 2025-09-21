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
	Modal,
	StyleSheet,
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
import Context from "@/context/context";
import { TextInput } from "react-native";


const { width, height } = Dimensions.get("screen");

export default function Cart() {
	// <--------------HOOKS---------------->
	const router = useRouter();
	const { User, fetchCart } = useContext(Context)
	const {currentTheme} = useContext(UIThemeContext);
	const darkTheme = currentTheme === "dark"
	const { getToken } = useAuth()
	
	// <--------------STATES--------------->
	const [Cart, setCart] = useState<any>()
	const [ modalPage , setModalPage ]= useState(1)
	// console.log(Cart)
	const [CartLoaded, setCartLoaded] = useState(false)
	const [CheckoutVisible, setCheckoutVisible] = useState(false)
	const [CheckoutRequestID, setCheckoutRequestID] = useState(null)
	const [PhoneNumber, setPhoneNumber] = useState<string | null>(null)
	const [PaymentLoading, setPaymentLoading] = useState(false)
	const [ConfirmPaymentLoading, setConfirmPaymentLoading] = useState(false)
	const [SuccessModal, setSuccessModal] =useState(false)
	const [ErrorMessage, setErrorMessage] =useState("")
	const [ErrorModal, setErrorModal] =useState(false)
	const [PaymentMethod, setPaymentMethod ] = useState<string | null>(null) // mpesa or card/stripe 
	// const CartLoaded = false
	// <-------------VARIABLES------------->

	// <-------------FUNCTIONS------------->
	// API CALLS
	const fetch_cart = async () => {
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
			// console.log(response)
			if(response?.cart_item?.length > 0){
				setCart(response)
			}
		} catch (error: any) {
		}finally{
			setCartLoaded(true)
		}
	}
// console.log(Cart)
	const Checkout = async () => {
		setPaymentLoading(true)
		const token = await getToken()
		const payload = {
			phone : PhoneNumber,
			amount : Math.ceil(Cart?.total_amount),
			id : Cart?.id,
			user_id: User?.id,
			lat: User?.lat,
			lng: User?.lng
		}
		// console.log(payload)
		try {
			const apiCall = await fetch(ApiRoutes.Checkout.path, {
				method : ApiRoutes.Checkout.method,
				headers: {
					"Authorization" : `Bearer ${token}`,
					"Content-Type" : "application/json"
				},
				body : JSON.stringify(payload)
			})
			const response = await apiCall.json()
			// console.log(response)
			setCheckoutRequestID(response.CheckoutRequestID)
			fetch_cart()
			fetchCart()
			setPaymentLoading(false)
			nextPage()
			setModalPage(3)
		} catch (error: any) {
			// console.log(error.message)
			setPaymentLoading(false)
		}
	}

	const confirmTransaction = async () => {
		setConfirmPaymentLoading(true)
		const token = await getToken()
		const payload = {
			CheckoutRequestID
		}
		try {
			const apiCall = await fetch( ApiRoutes.ConfirmPayment.path, {
				method : ApiRoutes.ConfirmPayment.method,
				headers : {
					"Authorization" : `Bearer ${token}`,
					"Content-Type" : "application/json"
				},
				body : JSON.stringify(payload)
			})
			const response = await apiCall.json()
			// console.log(response)
			setCheckoutVisible(false)
			if(response.code == "0"){
				setSuccessModal(true)
			}else{
				setErrorMessage(response.message)
				setErrorModal(true)
			}
		} catch (error: any) {
			// console.log(error.message)
		}finally{
			setConfirmPaymentLoading(false)
		}
	}

	// ANIMATIONS 
	const translateX = useSharedValue(0)

	const animatedTranslateX = useAnimatedStyle(()=>({
		transform: [{translateX: translateX.value}]
	}))

	const nextPage = ()=>{
		if (translateX.value != -width*2){
			translateX.value = withTiming(translateX.value - width, {duration: 500} )
		}
	}

	const prevPage = ()=>{
		if (translateX.value != 0){
			translateX.value = withTiming(translateX.value + width, {duration: 500} )
		}
	}

	const initialPage = ()=>{
		if (translateX.value != 0){
			translateX.value = withTiming(0, {duration: 500} )
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

			<SafeAreaView className={`flex-1 w-full ${darkTheme?"bg-black":"bg-white"}`}>
				<Animated.View 
					className="flex-1 pb-2"
					style={{
								marginBottom: 50,
							}}
				>
					<View className={`w-full z-30  ${darkTheme?"bg-black":"bg-white"} shadow-2xl bg-gray flex-row items-center px-5 `}>
						<View
							className="flex-row items-center w-full h-[70px]"
						
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
							
							{CartLoaded && Cart === undefined ? (
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
												Cart?.cart_item?.map((item: any) => {
													return(
														<CartItem  data={item} key={item.id} func={ async () => {fetch_cart()}}  />
													)
												})
											)}
									</View>

									{/* Total */}
									{
										CartLoaded && Cart?.cart_item?.length > 0 && (
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
							CartLoaded && Cart?.cart_item?.length > 0 && (
								<View className="items-center w-full flex-row">
									<View className="flex-row flex-1 items-end gap-2">
										<Text className={`text-2xl font-semibold ${darkTheme? 'text-white' : 'text-black'}`}>
											KSH {Cart?.total_amount}{" "}
										</Text>
									</View>
									<TouchableOpacity className="" activeOpacity={0.7}
										onPress={()=>{
											setCheckoutVisible(true)
										}}
									>
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
			</SafeAreaView>
			{/* Modals */}
			{/* <------------------------------CHECKOUT MODAL------------------------------> */}
			<Modal visible={CheckoutVisible} backdropColor={"transparent"}>
				<View className={`flex-1  w full justify-end `}>
					<View className={`min-w-full ${darkTheme?"bg-black":"bg-white"} rounded-t-2xl`}>
						<View className={`w-full items-center h-[70px] justify-center`}>
							<TouchableOpacity
								className={`absolute left-5`}
								onPress={()=>{
									setCheckoutVisible(false)
									setModalPage(1)
									initialPage()
								}}
							>
								<BackButtonMinimal/>
							</TouchableOpacity>
							<Text className={`text-3xl font-semibold ${darkTheme?"text-white":"text-black"}`}>Checkout</Text>
						</View>
						<View className=" py-7 items-center flex-row justify-evenly w-[90%] self-center">
							<Animated.View className={`w-full flex-row absolute self-center rounded-full gap-2 h-1  m-2`}>
								{/* progress bar */}
								<Animated.View className={`rounded-full flex-1 h-full bg-green-500 `}
									style={{
									}}
								/>
								<Animated.View className={`rounded-full flex-1 h-full ${modalPage >= 2 ? "bg-green-500": darkTheme?"bg-gray-200/20":"bg-gray-200"} `}
									style={{
									}}
								/>
								<Animated.View className={`rounded-full flex-1 h-full ${modalPage >= 3 ? "bg-green-500": darkTheme?"bg-gray-200/20":"bg-gray-200"} `}
									style={{
									}}
								/>
							</Animated.View>
						</View>
						{/* pager View  PAGES [ REVIEW ITEMS, DELIVERY ADDRESS, PAYMENT METHOD, PAYMENT]*/}
							<ScrollView>
								<View className={`w-full pb-[50px] flex-row overflow-scroll flex-nowrap`}>
											<Animated.View className="flex-row max-h-[300px]"
												style={[
													animatedTranslateX
												]}
											>
												<View
													className="gap-3"
													style={{
														minWidth: width,
													}}
												>
													<Text className={`font-semibold text-2xl self-center ${darkTheme?"text-white":""}`}>
														Payment method
													</Text>
													<View className={`px-4 py-3 items-center`}>
														<Text className={`text-xl  ${darkTheme?"text-white":""}`}>
															Choose your preferred payment method
														</Text>
													</View>
													<View className={`flex-row justify-center gap-3 px-2`}>
														<TouchableOpacity
															activeOpacity={0.6}

															className="flex-1 h-[50px] justify-center items-center max-w-[160px]"
															onPress={()=> {
																setPaymentMethod("mpesa")
																nextPage()
																setModalPage(2)
															}}
														>
															<View className={` w-full h-full justify-center items-center max-w-[200px] rounded-2xl bg-green-700`}>
																<Image source={images.mpesa_logo} className="h-[40px] w-[100px]"/>
															</View>
														</TouchableOpacity>
														<TouchableOpacity
															activeOpacity={0.6}
															className="flex-1 h-[50px] justify-center items-center max-w-[200px]"

															onPress={()=> {
																setPaymentMethod("card")
																setModalPage(2)
															}}
														>
															<View className={` w-full h-full justify-center items-center max-w-[200px] rounded-2xl border-2 border-gray-400 bg-white`}>
																<Image source={images.card_payment} className="h-[40px] w-[150px]"/>
															</View>
														</TouchableOpacity>
													</View>
												</View>
												<View
													className=" py-3"
													style={{
														minWidth: width,
													}}
												>
													{
														PaymentMethod == "mpesa" && (
															<View className={`w-full  items-center gap-4`}>
																<Image source={images.mpesa_logo} className="h-[40px] w-[100px]"/>
																<Text className={`text-lg font-semibold ${darkTheme?"text-white":""}`}>
																	Enter your PhoneNumber:
																</Text>

																<View className={` px-5 flex-row h-[50px] min-w-[250px] gap-2 items-center rounded-full ${darkTheme?"bg-gray-200/20":"bg-gray-200"}`}>
																	<Image source={icons.call} className={`w-5 h-5`} tintColor={darkTheme?"lightgray":"dimgray"}/>
																	<Text className={`text-lg font-semibold ${darkTheme?"text-white":""}`}>+254</Text>
																	<TextInput placeholder="* * * * * * * * *" keyboardType='numeric' onChangeText={(text) => setPhoneNumber(`254${text}`)}/>
																</View>
																<View 
																	className="px-5 items-center"
																	style={{
																		maxWidth: width,
																		width
																	}}
																>
																	<Text className={`text-lg text-center ${darkTheme?"text-white":""}`}>
																		When you press continue below a prompt will be sent to your phone to complete the transaction
																	</Text>
																</View>
																<View className={` flex-row justify-center gap-3`}>
																	<TouchableOpacity
																		// disabled={PhoneNumber === null || PaymentLoading}
																		activeOpacity={0.6}
																		onPress={()=>{
																			prevPage()
																			setModalPage(1)
																		}}
																	>
																		<View className={`h-[40px] items-center justify-center px-3 rounded-full bg-blue-500`}>
																				<View className={`w-9 h-9`}>
																					<Image source={icons.leftArrow} className="w-full h-full" tintColor={darkTheme?"black":"white"} />
																				</View>
																		</View>
																	</TouchableOpacity>
																	<TouchableOpacity
																		disabled={PhoneNumber === null || PaymentLoading}
																		activeOpacity={0.6}
																		onPress={()=>{
																			Checkout()
																			
																		}}
																	>
																		<View className={`h-[40px] min-w-[200px] items-center justify-center px-6 rounded-full bg-green-500`}>
																			{PaymentLoading ? (
																				<Animated.View className={`w-9 h-9 animate-spin`}>
																					<Image source={icons.spinner} className="w-full h-full" tintColor={darkTheme?"black":"white"} />
																				</Animated.View>
																			) : (
																				<Text className={`font-bold text-xl ${darkTheme?"":"text-white"}`}>Continue</Text>
																			)}
																		</View>
																	</TouchableOpacity>
																</View>
															</View>
														)
													}
												</View>
												<View
													className=""
													style={{
														minWidth: width,
													}}
												>
													<View className={`w-full items-center gap-5 py-3`}>
														<Text className={`text-2xl font-semibold ${darkTheme?"text-white":""}`}>Confirmation</Text>
														<Text className={`text-lg font-semibold ${darkTheme?"text-white":""}`}>Please press Confirm if you have completed the transaction</Text>
														<TouchableOpacity
															disabled={CheckoutRequestID === null || PaymentLoading || ConfirmPaymentLoading}
															activeOpacity={0.6}
															onPress={()=>{
																// Checkout()
																// nextPage()
																confirmTransaction()
															}}
														>
															<View className={`h-[40px] min-w-[200px] items-center justify-center px-6 rounded-full bg-green-500`}>
																{PaymentLoading || ConfirmPaymentLoading ? (
																	<Animated.View className={`w-9 h-9 animate-spin`}>
																		<Image source={icons.spinner} className="w-full h-full" tintColor={darkTheme?"black":"white"} />
																	</Animated.View>
																) : (
																	<Text className={`font-bold text-xl ${darkTheme?"":"text-white"}`}>Confirm</Text>
																)}
															</View>
														</TouchableOpacity>
													</View>
												</View>
											</Animated.View>
								</View>
								<View className="w-full flex-row items-center justify-center">
									{/* buttons */}
									{/* <TouchableOpacity
										activeOpacity={0.6}
										onPress={()=> {
											nextPage()
										}}
									>
										<View className={`rounded-full px-6 py-2 bg-blue-500`}>
											<Text className={`font-bold text-xl ${darkTheme?"text-black":"text-white"}`}>Next</Text>
										</View>
									</TouchableOpacity> */}
								</View>
							</ScrollView>
					</View>
				</View>

			</Modal>

			{/* <------------------------------SUCCESS MODAL------------------------------> */}
			<Modal visible={SuccessModal} backdropColor={"transparent"}>
				<View className="w-full flex-1 items-center justify-center">
					<View className={`min-w-[200px] min-h-[250px] ${darkTheme?"bg-black":"bg-white"} p-7 rounded-xl items-center gap-5`}>
						<View className="h-[160px] w-[160px] items-center justify-center bg-green-500 rounded-full shadow-xl ">
							<Image
								source={icons.verified}
								className="w-[100px] h-[100px]"
								tintColor={"white"}
							/>
						</View>
						<Text className={`text-xl font-semibold ${darkTheme?"text-white":""}`}>Transaction was completed successfully.</Text>
						<View className={`gap-4 flex-row `}>
							<TouchableOpacity
								activeOpacity={0.6}
								onPress={()=>{
									router.push("/(screens)")
								}}
							>
								<Button style={`rounded-full ${darkTheme?"bg-gray-200/20":"bg-white"}`} label={"Continue Shopping "} textStyle={`font-semibold text-lg ${darkTheme?"text-white":""}`}/>
							</TouchableOpacity>
							<TouchableOpacity
								activeOpacity={0.6}
								onPress={()=>{
									router.push("/(screens)/Orders")
								}}
							>
								<Button style={"bg- rounded-full"} label={"See Order "} textStyle={`font-semibold text-lg ${darkTheme?"":"text-white"}`}/>
							</TouchableOpacity>
							
						</View>
					</View>
				</View>
			</Modal>

			{/* <------------------------------SUCCESS MODAL------------------------------> */}
			<Modal visible={ErrorModal} backdropColor={"transparent"}>
			<View className="w-full flex-1 items-center justify-center">
					<View className={`min-w-[200px] min-h-[250px] ${darkTheme?"bg-black":"bg-white"} p-7 rounded-xl items-center gap-5`}>
						<View className="h-[100px] w-[100px] items-center justify-center bg-red-500 rounded-full shadow-xl ">
							<Image
								source={icons.close}
								className="w-[50px] h-[50px]"
								tintColor={"white"}
							/>
						</View>
						<Text className={`text-xl font-semibold ${darkTheme?"text-white":""}`}>{ErrorMessage}</Text>
						<Text className={`text-xl font-semibold ${darkTheme?"text-white":""}`}></Text>
						<View className={`gap-4 flex-row `}>
							<TouchableOpacity
								activeOpacity={0.6}
								onPress={()=>{
									// router.push("/(screens)")
									setErrorModal(false)
								}}
							>
								<Button style={`rounded-full px-5 ${darkTheme?"bg-gray-200/20":"bg-white"}`} label={"Cancel"} textStyle={`font-semibold text-lg ${darkTheme?"text-white":""}`}/>
							</TouchableOpacity>
							<TouchableOpacity
								activeOpacity={0.6}
								onPress={()=>{
									router.push("/(screens)/Orders")
								}}
							>
								<Button style={"bg- rounded-full px-5"} label={"Re-try"} textStyle={`font-semibold text-lg ${darkTheme?"":"text-white"}`}/>
							</TouchableOpacity>
							
						</View>
					</View>
				</View>		
			</Modal>
		</>
	);
}

