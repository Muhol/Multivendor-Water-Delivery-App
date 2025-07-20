import {
	View,
	Text,
	StatusBar,
	TouchableOpacity,
	ScrollView,
	Image,
	TouchableWithoutFeedback,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import ComicText from "@/components/styled-components/custom-texts/ComicText";
import BackButton from "@/components/ui/BackButton";
import { useRouter } from "expo-router";
import icons from "@/constants/icons/icons";
import OrderCard from "@/components/common/OrderCard";
import { UIThemeContext } from "@/context/ThemeContext";
import BackButtonMinimal from "@/components/ui/BackButtonMinimal";
import { useAuth, useUser } from "@clerk/clerk-expo";
import ApiRoutes from "@/API/routes/ApiRoutes";

const filterOptions = ["All", "In Transit", "Pending", "Delivered"];

const Orders = () => {
	const router = useRouter();
	const [showFilter, setShowFilter] = useState(false);
	const [selectedFilter, setSelectedFilter] = useState("All");
	const { currentTheme } = useContext(UIThemeContext);
	const darkTheme = currentTheme === "dark";
	const { getToken } = useAuth()

	const [OrdersLoaded, setOrdersLoaded] = useState(false)
	const [Orders, setOrders] = useState<any>()

	const orders = [
		"pending",
		"completed",
		"out for delivery",
		"cancelled",
		"completed",
		"out for delivery",
		"cancelled",
		"pending",
		"completed",
		"out for delivery",
	];

	// <-------------FUNCTIONS------------->
	// API CALLS
	const fetchOrders = async () => {
		const token = await getToken()
		// console.log(token)
		try {
			const apiCall = await fetch(ApiRoutes.GetOrders.path, {
				method : ApiRoutes.GetOrders.method,
				headers: {
					"Authorization": `Bearer ${token}`,
					"Content-Type" : "application/json"
				}
			})
			const response = await apiCall.json()
			// console.log(response[0])
			setOrders(response)
		} catch (error) {
			// console.log(error)
		}
	}

	useEffect(() => {
		fetchOrders()
	}, [])
	return (
		<>
			<StatusBar
				backgroundColor={darkTheme ? "black" : "white"}
				barStyle={darkTheme ? "light-content" : "dark-content"}
			/>
			<TouchableWithoutFeedback onPress={() => setShowFilter(false)}>
				<View
					className={`flex-1 pb-3 ${darkTheme?"bg-black":""}`}
					style={{
						marginTop: StatusBar.currentHeight,
					}}
				>
					{/* HEADER */}
					<View
						className={`w-full ${
							darkTheme ? "bg-black" : "bg-white"
						} flex-row items-center px-5 py-6 justify-between`}
					>
						<TouchableOpacity
							activeOpacity={0.7}
							onPress={() => router.back()}
						>
							<BackButtonMinimal />
						</TouchableOpacity>
						<View className=" absolute right-0 left-0 h-full justify-center items-center">
							<Text
								className={`${
									darkTheme ? "text-white" : "text-black"
								} text-3xl `}
							>
								Orders
							</Text>
						</View>
					</View>

					{/* FILTER HEADER */}
					<View className="relative z-10">
						<View className={`flex-row justify-between items-center m-4 px-3 py-2 rounded-xl ${darkTheme?"bg-gray-200/15":"bg-white"} `}>
							<Text className={`font-semibold text-lg capitalize ${darkTheme?"text-white":"text-black"}`}>
								{selectedFilter}
							</Text>

							<TouchableOpacity
								activeOpacity={0.7}
								onPress={() => setShowFilter(!showFilter)}
							>
								<View className="flex-row items-center gap-2 p-2 px-4 rounded-xl">
									<Text className={`font-semibold text-lg ${darkTheme?"text-white":"text-black"}`}>
										Sort by
									</Text>
									<Image
										source={icons.filter}
										className="w-6 h-6"
										tintColor={darkTheme?"white":"black"}
									/>
								</View>
							</TouchableOpacity>
						</View>

						{/* DROPDOWN */}
						{showFilter && (
							<View className={`${darkTheme?"bg-slate-950":"bg-white"} w-[140px] absolute right-5 top-[70px] rounded-xl shadow p-2 z-50`}>
								{filterOptions.map((label, index) => (
									<TouchableOpacity
										key={index}
										onPress={() => {
											setSelectedFilter(label);
											setShowFilter(false);
										}}
										activeOpacity={0.7}
									>
										<View className="p-2 rounded-lg">
											<Text className={`text-base ${darkTheme?"text-white":"text-black"}`} >
												{label}
											</Text>
										</View>
									</TouchableOpacity>
								))}
							</View>
						)}
					</View>

					{/* ORDERS LIST */}
					<ScrollView
						className="flex-1 rounded-xl  mx-4"
						contentContainerStyle={{
							paddingVertical: 10,
							borderRadius: 20,
						}}
						showsVerticalScrollIndicator={false}
						overScrollMode="never"
					>
						{/* TODO: Render filtered orders */}
						{
							Orders != null && (
								<TouchableWithoutFeedback>
									<View className="gap-4">
										{Orders.map((order: any, index: any) => {
											return (
												<OrderCard key={index} order={order} />
											);
										})}
									</View>
								</TouchableWithoutFeedback>
							)
						}
					</ScrollView>
				</View>
			</TouchableWithoutFeedback>
		</>
	);
};

export default Orders;
