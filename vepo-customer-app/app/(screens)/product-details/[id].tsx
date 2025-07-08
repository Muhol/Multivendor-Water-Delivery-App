import {
	View,
	Text,
	StatusBar,
	TouchableOpacity,
	ScrollView,
	Dimensions,
	Image,
	Alert,
	Modal,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { usePathname, useRouter } from "expo-router";

import BackButton from "@/components/ui/BackButton";
import ComicText from "@/components/styled-components/custom-texts/ComicText";
import Button from "@/components/ui/Button";
import icons from "@/constants/icons/icons";
import Reviews from "@/components/common/Reviews";
import { UIThemeContext } from "@/context/ThemeContext";
import ApiRoutes from "@/API/routes/ApiRoutes";
import { useAuth } from "@clerk/clerk-expo";
import Animated from "react-native-reanimated";
import Context from "@/context/context";
import BackButtonMinimal from "@/components/ui/BackButtonMinimal";

const { width } = Dimensions.get("window");

const ProductDetails = () => {
	// <---------------HOOKES--------------->
	const router = useRouter();
	const { fetchCart } = useContext(Context);
	const { getToken } = useAuth();
	const { currentTheme } = useContext(UIThemeContext);
	const darkTheme = currentTheme === "dark";

	// <---------------STATES--------------->
	const [Product, setProduct] = useState<any>();
	const [ProductLoaded, setProductLoaded] = useState<boolean>(false);
	const [Quantity, setQuantity] = useState(1);
	const [cartChanged, setCartChanged] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);
	const [CartSuccess, setCartSuccess] = useState<boolean>(false);

	// <---------------VARAIBLES--------------->
	const statusBarHieght = StatusBar.currentHeight || 60;

	const path = usePathname();
	const id = path.split("/")[2];
	// <---------------FUNCTIONS--------------->
	// API CALLS
	const fetch_product_details = async () => {
		const token = await getToken();
		try {
			const apiCall = await fetch(ApiRoutes.ProductDetails.path, {
				method: ApiRoutes.ProductDetails.method,
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "Application/json",
				},
				body: JSON.stringify({ id: id }),
			});

			const response = await apiCall.json();
			setProduct(response);
			setProductLoaded(true);
		} catch (error) {
			Alert.alert("Error");
		} finally {
		}
	};

	const add_to_cart = async () => {
		setCartSuccess(false);
		setLoading(true);
		const token = await getToken();
		const payload = {
			id: id,
			quantity: Quantity,
		};
		try {
			const apiCall = await fetch(ApiRoutes.AddToCart.path, {
				method: ApiRoutes.AddToCart.method,
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "Application/json",
				},
				body: JSON.stringify(payload),
			});
			const response = await apiCall.json();
			fetchCart().then(() => {
				setLoading(false);
			})
		} catch (error: any) {
			setLoading(false);
		}
	};

	// Dummy Data
	const location =
		"Lorem ipsum dolor sit amet consectetur adipisicing elit. Suscipit alias illum nisi tenetur, earum autem consequatur nulla blanditiis porro adipisci";

	const product = {
		name: "20L Mineral Water Refill",
		description:
			"Clean, mineral-rich drinking water in a refillable 10L container.",
		price: 150,
		stockAvailable: true,
		quantity: 1,
	};

	useEffect(() => {
		fetch_product_details();
	}, []);

	useEffect(() => {
		if (CartSuccess == true) {
		}
	}, [CartSuccess]);

	return (
		<>
			<StatusBar
				backgroundColor="transparent"
				barStyle={darkTheme ? "light-content" : "dark-content"}
			/>
			<SafeAreaView
				className={`flex-1 ${darkTheme ? "bg-black" : "bg-white"}`}
			>
				{/* Back Button */}
				<TouchableOpacity
					className="p-5"
					style={{
						position: "absolute",
						top: statusBarHieght,
						left: 0,
						zIndex: 10,
					}}
					activeOpacity={0.7}
					onPress={() => router.back()}
				>
					<BackButtonMinimal />
				</TouchableOpacity>

				{/* Product Image and Name */}

				{/* Product Details */}
				{!ProductLoaded ? (
					<ScrollView
						className="flex-1 border-gray-50"
						contentContainerStyle={{
							paddingHorizontal: 20,
							paddingVertical: 60,
							paddingBottom: 50,
							gap: 15,
						}}
						scrollEnabled
						showsVerticalScrollIndicator={false}
						bounces={false}
						overScrollMode="never"
					>
						<View className="w-full items-center justify-center gap-4">
							<Animated.View
								className={`rounded-3xl ${
									darkTheme ? "bg-gray-200/20" : "bg-gray-100"
								} animate-pulse`}
								style={{
									width: width * 0.7,
									height: width * 0.6,
								}}
							/>

							<Animated.View
								className={`w-[40%] h-3 rounded-full ${
									darkTheme ? "bg-gray-200/20" : "bg-gray-100"
								} animate-pulse`}
							/>
						</View>

						{/* Description */}
						<Animated.View
							className={`w-[80%] h-3 rounded-full ${
								darkTheme ? "bg-gray-200/20" : "bg-gray-100"
							} animate-pulse`}
						/>

						<View className="gap-4">
							<Animated.View
								className={`w-[30%] h-3 rounded-full ${
									darkTheme ? "bg-gray-200/20" : "bg-gray-100"
								} animate-pulse`}
							/>
							<Animated.View
								className={`w-[40%] h-3 rounded-full ${
									darkTheme ? "bg-gray-200/20" : "bg-gray-100"
								} animate-pulse`}
							/>
							<Animated.View
								className={`w-[60%] h-3 rounded-full ${
									darkTheme ? "bg-gray-200/20" : "bg-gray-100"
								} animate-pulse`}
							/>
							<Animated.View
								className={`w-[50%] h-3 rounded-full ${
									darkTheme ? "bg-gray-200/20" : "bg-gray-100"
								} animate-pulse`}
							/>
						</View>

						{/* Quantity Selector */}
						<View className="flex-row items-center justify-between gap-4">
							<View className="flex-row items-center gap-4">
								{/* minus */}
								<Animated.View
									className={`h-[40px] w-[40px] rounded-2xl items-center justify-center ${
										darkTheme
											? "bg-gray-200/20"
											: "bg-gray-100"
									} animate-pulse`}
								/>
								<Animated.View
									className={`h-[10px] w-[10px] rounded-2xl items-center justify-center ${
										darkTheme
											? "bg-gray-200/20"
											: "bg-gray-100"
									} animate-pulse`}
								/>

								<Animated.View
									className={`h-[40px] w-[40px] rounded-2xl items-center justify-center ${
										darkTheme
											? "bg-gray-200/20"
											: "bg-gray-100"
									} animate-pulse`}
								/>
							</View>

							{/* Subtotal */}
							<Animated.View
								className={`w-[30%] h-3 rounded-full ${
									darkTheme ? "bg-gray-200/20" : "bg-gray-100"
								} animate-pulse`}
							/>
						</View>

						<View
							className="flex-row gap-2 self-center items-center"
							style={{
								width: width * 0.8,
							}}
						>
							{/* <----------------------add to cart----------------------> */}
							<Animated.View
								className={`h-[40px] flex-1 rounded-2xl items-center justify-center ${
									darkTheme ? "bg-gray-200/20" : "bg-gray-100"
								} animate-pulse`}
							/>

							{/* <------------------------buy now------------------------> */}
							<Animated.View
								className={`h-[40px] flex-1 rounded-2xl items-center justify-center ${
									darkTheme ? "bg-gray-200/20" : "bg-gray-100"
								} animate-pulse`}
							/>
							{/*  */}
						</View>

						{/* Vendor Info Snippet */}
						<Animated.View
							className={`h-[100px] p-4 ${
								darkTheme ? "bg-gray-200/20" : "bg-slate-200"
							} gap-2 rounded-2xl animate-pulse`}
						/>
						{/* scheduled delivery */}

						<View>
							<Animated.View
								style={{
									width: width * 0.8,
								}}
								className={`h-[40px] rounded-2xl items-center self-center justify-center ${
									darkTheme ? "bg-gray-200/20" : "bg-gray-100"
								} animate-pulse`}
							/>
						</View>

						{/* Future: Delivery options, estimated delivery time, delivery cost */}
					</ScrollView>
				) : (
					<ScrollView
						className="flex-1 border-gray-50"
						contentContainerStyle={{
							paddingHorizontal: 20,
							paddingVertical: 60,
							paddingBottom: 50,
							gap: 7,
						}}
						scrollEnabled
						showsVerticalScrollIndicator={false}
						bounces={false}
						overScrollMode="never"
					>
						<View className="w-full items-center justify-center">
							<View
								className="rounded-lg bg-gray-50 overflow-hidden"
								style={{
									width: width * 0.7,
									height: width * 0.7,
								}}
							>
								<Image
									source={{ uri: Product?.image_url }}
									className="w-full h-full rounded"
									resizeMode="cover"
								/>
							</View>

							<View className="py-3">
								<ComicText
									text={Product?.name}
									style={
										darkTheme
											? "text-lg text-white"
											: "text-lg text-black"
									}
								/>
							</View>
						</View>

						{/* Description */}
						<ComicText
							text={Product?.description}
							style={
								darkTheme
									? "text-lg text-white"
									: "text-lg text-black"
							}
						/>
						
						<View className="">
							{/* Price */}
							<View className="flex-row items-center gap-2">
								<Text
									className={`${
										darkTheme ? "text-white" : "text-black"
									}`}
								>
									Price:
								</Text>
								<ComicText
									text={`ksh ${
										Math.round((Product?.price - Product?.discount) * 100) / 100
									}`}
									style={
										darkTheme ? "text-white" : "text-black"
									}
								/>
							</View>

							{/* Availability */}
							<View className="flex-row items-center gap-2">
								<Text
									className={`${
										darkTheme ? "text-white" : "text-black"
									}`}
								>
									Availability:
								</Text>
								<ComicText
									text={
										product.stockAvailable
											? "In Stock"
											: "Out Of Stock"
									}
									style={`text-lg ${
										product.stockAvailable
											? "text-green-400"
											: "text-red-500"
									}`}
								/>
							</View>
							<View className="flex-row items-center gap-2">
								<Text
									className={`${
										darkTheme ? "text-white" : "text-black"
									}`}
								>
									Estimated Delivery Time:
								</Text>
								<ComicText
									text={`${"35 - 40 mins"}`}
									style={`${
										darkTheme ? "text-white" : "text-black"
									} `}
								/>
							</View>
							<View className="flex-row items-center gap-2">
								<Text
									className={`${
										darkTheme ? "text-white" : "text-black"
									} `}
								>
									Delivery fee:
								</Text>
								<ComicText
									text={`ksh ${"50"}`}
									style={`${
										darkTheme ? "text-white" : "text-black"
									} `}
								/>
							</View>
						</View>

						{/* Quantity Selector */}
						<View className="flex-row items-center justify-between gap-4">
							<View className="flex-row items-center gap-4">
								{/* minus */}
								<TouchableOpacity
									activeOpacity={0.7}
									onPress={() => {
										if(Quantity === 1){
											return
										}
										setQuantity(Quantity - 1);
									}}
									disabled={Quantity === 1}
								>
									<View className="h-[40px] w-[40px] rounded-2xl items-center justify-center ">
										<Image
											source={icons.minus}
											className="w-5 h-5"
											tintColor={
												darkTheme ? "white":"black"
											}
										/>
									</View>
								</TouchableOpacity>

								<ComicText
									text={`${Quantity}`}
									style={
										darkTheme ? "text-white" : "text-black"
									}
								/>

								{/* add */}
								<TouchableOpacity
									activeOpacity={0.7}
									onPress={() => {
										setQuantity(Quantity + 1);
									}}
								>
									<View className="h-[40px] w-[40px] rounded-2xl items-center justify-center ">
										<Image
											source={icons.add}
											className="w-5 h-5"
											tintColor={
												darkTheme ? "white":"black"
											}
										/>
									</View>
								</TouchableOpacity>
							</View>

							{/* Subtotal */}
							<View className="flex-row items-center gap-2">
								<Text
									className={`${
										darkTheme ? "text-white" : "text-black"
									}`}
								>
									Total:
								</Text>
								<ComicText
									text={`ksh ${
										Math.round(((Product?.price - Product?.discount) * Quantity) * 100) / 100
									}`}
									style={
										darkTheme ? "text-white" : "text-black"
									}
								/>
							</View>
						</View>

						<View
							className="flex-row gap-2 self-center items-center"
							style={{
								width: width * 0.8,
							}}
						>
							{/* <----------------------add to cart----------------------> */}
							<TouchableOpacity
								className="flex-1"
								activeOpacity={0.7}
								onPress={() => {
									add_to_cart();
								}}
							>
								<View className="p-2 rounded-2xl items-center justify-center border border-accentbg ">
									<ComicText
										text={"Add to Cart "}
										style={"text-lg text-accentbg"}
									/>
								</View>
							</TouchableOpacity>

							{/* <------------------------buy now------------------------> */}
							<TouchableOpacity
								className="flex-1"
								activeOpacity={0.7}
							>
								<View className="p-2 rounded-2xl items-center justify-center bg-accentbg border border-accentbg ">
									<ComicText
										text={"Buy Now"}
										style={
											darkTheme
												? "text-lg text-black"
												: "text-lg text-white"
										}
									/>
								</View>
							</TouchableOpacity>
						</View>

						{/* Vendor Info Snippet */}
						<View
							className={`h-[100px] p-4 ${
								darkTheme ? "bg-gray-100/20" : "bg-slate-200"
							} gap-2 rounded-2xl`}
						>
							<ComicText
								text="Vendor Info:"
								style={
									darkTheme ? "text-lg text-white" : "text-lg"
								}
							/>

							<View className="flex-1 gap-2">
								<View className="flex-row items-center gap-2">
									<Text
										className={`${
											darkTheme
												? " text-white"
												: "text-black"
										}`}
									>
										Name:
									</Text>
									<ComicText
										text="Vendor Name"
										style={
											darkTheme
												? " text-white"
												: "text-black"
										}
									/>
								</View>

								<TouchableOpacity
									activeOpacity={0.7}
									onPress={() => {}}
								>
									<View className="flex-row items-center gap-2">
										<Image
											source={icons.location}
											tintColor={
												darkTheme ? "white" : "black"
											}
											className="w-5 h-5"
										/>
										<ComicText
											text={
												location.length > 50
													? `${location
															.substring(0, 50)
															.trim()}...`
													: location
											}
											style={
												darkTheme
													? "text-lg text-white"
													: "text-lg"
											}
										/>
									</View>
								</TouchableOpacity>
							</View>
						</View>

						{/* scheduled delivery */}
						<View>
							<TouchableOpacity
								activeOpacity={0.7}
								onPress={() => {}}
							>
								{/* <Button style={""} label={"Schedule Delivery"} /> */}
								<View
									className={`p-2 self-center rounded-full items-center ${darkTheme?"bg-accentbg":"bg-black"}`}
									// <View className="p-2 border border-gray-400 self-center rounded-full items-center"
									style={{
										width: width * 0.8,
									}}
								>
									<ComicText
										text={"Schedule Delivery"}
										style={
											darkTheme
												? "text-lg text-black"
												: "text-lg text-white"
										}
									/>
								</View>
							</TouchableOpacity>
						</View>

						<View>{/* <Reviews /> */}</View>
						{/* Future: Delivery options, estimated delivery time, delivery cost */}
					</ScrollView>
				)}
			</SafeAreaView>
			<Modal visible={loading} backdropColor={"transparent"}>
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
		</>
	);
};

export default ProductDetails;
