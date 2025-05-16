import {
	View,
	Text,
	StatusBar,
	TouchableOpacity,
	ScrollView,
	Image,
	TouchableWithoutFeedback,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import ComicText from "@/components/styled-components/custom-texts/ComicText";
import BackButton from "@/components/ui/BackButton";
import { useRouter } from "expo-router";
import icons from "@/constants/icons/icons";
import OrderCard from "@/components/common/OrderCard";

const filterOptions = ["All", "In Transit", "Pending", "Delivered"];

const Orders = () => {
	const router = useRouter();
	const [showFilter, setShowFilter] = useState(false);
	const [selectedFilter, setSelectedFilter] = useState("All");

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

	return (
		<>
			<StatusBar backgroundColor={"white"} barStyle={"dark-content"} />
			<TouchableWithoutFeedback onPress={() => setShowFilter(false)}>
				<View
					className="flex-1 mb-3"
					style={{
						marginTop: StatusBar.currentHeight,
					}}
				>
					{/* HEADER */}
					<View className="w-full bg-white flex-row items-center px-5 py-6 justify-between">
						<TouchableOpacity
							activeOpacity={0.7}
							onPress={() => router.back()}
						>
							{/* <BackButton /> */}
							<View className="w-12 h-12 items-center justify-center bg-white rounded-xl">
								<Image
									source={icons.leftArrow}
									className="w-8 h-8"
								/>
							</View>
						</TouchableOpacity>
						{/* <ComicText text={"Orders"} style={"text-accentbg text-3xl "} /> */}
						<View className=" absolute right-0 left-0 h-full justify-center items-center">
							<Text className="text-black text-3xl ">Orders</Text>
						</View>
					</View>

					{/* FILTER HEADER */}
					<View className="relative z-10">
						<View className="flex-row justify-between items-center m-4 px-3 py-2 rounded-xl bg-white ">
							<Text className="font-semibold text-lg capitalize">
								{selectedFilter}
							</Text>

							<TouchableOpacity
								activeOpacity={0.7}
								onPress={() => setShowFilter(!showFilter)}
							>
								<View className="flex-row items-center gap-2 p-2 px-4 bg-white rounded-xl">
									<Text className="font-semibold text-lg ">
										Sort by
									</Text>
									<Image
										source={icons.filter}
										className="w-6 h-6"
									/>
								</View>
							</TouchableOpacity>
						</View>

						{/* DROPDOWN */}
						{showFilter && (
							<View className="bg-white w-[140px] absolute right-5 top-[70px] rounded-xl shadow p-2 z-50">
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
											<Text className="text-base">
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
						<TouchableWithoutFeedback>
							<View className="gap-4">
								{orders.map((order, index) => {
									return (
										<OrderCard key={index} order={order} />
									);
								})}
							</View>
						</TouchableWithoutFeedback>
					</ScrollView>
				</View>
			</TouchableWithoutFeedback>
		</>
	);
};

export default Orders;
