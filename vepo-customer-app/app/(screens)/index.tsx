import {
	View,
	Text,
	SafeAreaView,
	Image,
	TextInput,
	TouchableWithoutFeedback,
	Keyboard,
	ScrollView,
	TouchableOpacity,
	StatusBar,
	Platform,
	ImageBackground,
} from "react-native";
import React from "react";
import HorizontalList from "@/components/common/HorizontalList";
import ComicText from "@/components/styled-components/custom-texts/ComicText";
import Search from "@/components/common/Search";
import { useRouter } from "expo-router";
import icons from "@/constants/icons/icons";
import images from "@/constants/images/images";
import FullHorizontalList from "@/components/common/FullHorizontalList";
import CartegoriesList from "@/components/common/CartegoriesList";

export default function Home() {
	const router = useRouter();
	const statusBarHieght = StatusBar.currentHeight;

	const location =
		"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Id fugit voluptatum libero magni et! Unde optio aliquid perspiciatis repellat voluptatibus impedit possimus, soluta dolores praesentium ducimus pariatur at ratione distinctio.";

	return (
		<>
			<StatusBar
				translucent
				backgroundColor="white"
				barStyle="dark-content"
			/>
			<TouchableWithoutFeedback
				onPress={Keyboard.dismiss}
				accessible={false}
			>
				<View
					className=" flex-1 "
					style={{
						paddingTop: statusBarHieght,
					}}
				>
					{/* <--------------<<HEADER>-----------------> */}
					<View className=" bg-white shadow-2xl py-3 z-20 gap-3 rounded-b[20px] ">
						{/* SEARCH AND NOTIFICATION */}
						<View className="pr-[15px]">
							<View className=" flex-row items-center w-full h-[40px] gap-4 justify-between ">
								<View className="w-[100px] h-[45px] mx-4">
									<Image
										source={images.logo}
										className="w-full h-full"
										tintColor={""}
									/>
								</View>
								<View className=" flex-row items-center flex-1 h-full gap-2  justify-end ">
									<TouchableOpacity
										className=" flex-row h-full"
										activeOpacity={0.6}
										onPress={() => {
											router.push("/(screens)/Search");
										}}
									>
										<View className="bg-gray-100 flex-row rounded-full self-center gap-4 w-12 h-12 items-center justify-center">
											{/* <View className="bg-gray-100 flex-row items-center rounded-2xl self-center flex-1 h-full px-3 gap-4 "> */}
											<Image
												source={icons.search}
												className="w-6 h-6"
												tintColor={"black"}
											/>
											{/* <Text className="text-gray-500">
												Search for Vendor/Shop or location
											</Text> */}
										</View>
									</TouchableOpacity>
									<TouchableOpacity
										activeOpacity={0.6}
										onPress={() => {
											router.push(
												"/(screens)/Notifications"
											);
										}}
									>
										<View className=" bg-gray-100 rounded-full  w-12 h-12 items-center justify-center">
											<View className="absolute z-10 -right-2 -top-2 bg-accentbg  items-center justify-center w-7 h-7 rounded-full">
												<Text className="text-white font-bold">
													12
												</Text>
											</View>
											<Image
												source={icons.notifications}
												className="w-6 h-6"
												tintColor={"black"}
											/>
										</View>
									</TouchableOpacity>
									<TouchableOpacity
										activeOpacity={0.7}
										onPress={() => {
											router.push("/(screens)/Maps");
										}}
									>
										<View className="bg-accentbg  rounded-full w-12 h-12 items-center justify-center">
											<Image
												source={icons.myLocation}
												className="w-8 h-8"
												tintColor={"white"}
											/>
										</View>
									</TouchableOpacity>
								</View>
							</View>
						</View>
					</View>
					<ScrollView
						contentContainerStyle={{ gap: 0, paddingBottom: 30 }}
						showsVerticalScrollIndicator={false}
						scrollEnabled={true}
					>
						<View className=" relative w-screen flex-1  rounded-t-[0px] pt-[10px] -mt-[10px]"></View>
						<TouchableWithoutFeedback>
							<View className="gap-3">
								{/* spacial offers */}
								<FullHorizontalList title="Special Offers" />
								{/* cartegories */}
								<CartegoriesList
									data={[
										"All",
										"Bottled Water",
										"Dispenser Refills",
										"Mineral Water",
										"Sparkling Water",
										"Alkaline Water",
										"Spring Water",
										"Filtered Water",
										"Water Coolers",
										"Water Accessories",
										"Custom Orders",
										"Top Deals",
										"Popular Products",
										"New Arrivals",
										"Trending Now",
										"Best Sellers",
										"Recommended for You",
										"Limited Time Offers",
										"Staff Picks",
										"Seasonal Picks",
										"Customer Favorites",
									]}
								/>
								{/* Top Brands */}
								<HorizontalList title={"Top Brands"} />
								{/* Refills  */}
								<HorizontalList title={"Refills"} />
								{/* Offers */}
								<HorizontalList title={"Offers"} type="product" />
								{/* Suppliers */}
								<HorizontalList
									title={"Whole Sale Suppliers"}
								/>
							</View>
						</TouchableWithoutFeedback>
					</ScrollView>
				</View>
			</TouchableWithoutFeedback>
		</>
	);
}
