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
	useColorScheme,
	Alert,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import HorizontalList from "@/components/common/HorizontalList";
import ComicText from "@/components/styled-components/custom-texts/ComicText";
import Search from "@/components/common/Search";
import { useRouter } from "expo-router";
import icons from "@/constants/icons/icons";
import images from "@/constants/images/images";
import FullHorizontalList from "@/components/common/FullHorizontalList";
import CartegoriesList from "@/components/common/CartegoriesList";
import ApiRoutes from "@/API/routes/ApiRoutes";
import { useAuth } from "@clerk/clerk-expo";
import * as Location from "expo-location";
import { UIThemeContext } from "@/context/ThemeContext";
import CarouselComponent from "@/components/common/Carousel";

export default function Home() {
	// <----------------HOOKS---------------->
	const router = useRouter();
	const { getToken } = useAuth();
	const { currentTheme } = useContext(UIThemeContext);
	const darkTheme = currentTheme === "dark";

	// <----------------STATES--------------->
	// location
	const [errorMsg, setErrorMsg] = useState<string | null>(null);
	const [location, setLocation] = useState<Location.LocationObject | null>(
		null
	);
	// near by vendors for quick order
	const [NearByVendors, setNearByVendors] = useState<any>();
	const [NearbyVendorsLoaded, setNearbyVendorsLoaded] = useState(false);
	// top rated vendors near you
	const [TopRatedVendors, setTopRatedVendors] = useState<any>();
	const [TopRatedVendorsLoaded, setTopRatedVendorsLoaded] = useState(false);
	// refill vendors for near you
	const [RefillVendors, setRefillVendors] = useState<any>();
	const [RefillVendorsLoaded, setRefillVendorsLoaded] = useState(false);
	// refill vendors for near you
	const [WholeSellers, setWholeSellers] = useState<any>();
	const [WholeSellersLoaded, setWholeSellersLoaded] = useState(false);

	const [General, setGeneral] = useState<any>();
	const [GeneralLoaded, setGeneralLoaded] = useState(false);
	// top brands near you
	const [TopBrands, setTopBrands] = useState<any>()
	const [TopBrandsloaded, setTopBrandsloaded] = useState(false)

	// <---------------VARIABLES---------------->
	const statusBarHieght = StatusBar.currentHeight;

	// <---------------FUNCTIONS---------------->
	// API CALLS
	const fetchNearByVendors = async () => {
		const token = await getToken();
		try {
			const apiCall = await fetch(ApiRoutes.NearByVendors.path, {
				method: ApiRoutes.NearByVendors.method,
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "Application/json",
				},
			});

			const response = await apiCall.json();
			setNearByVendors(response);
		} catch (error: any) {
			console.log(error.message)
		} finally {
			setNearbyVendorsLoaded(true);
		}
	};

	const fetchTopRatedVendors = async () => {
		const token = await getToken();
		
		try {
			const apiCall = await fetch(ApiRoutes.TopRatedVendors.path, {
				method: ApiRoutes.TopRatedVendors.method,
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "Application/json",
				},
			});

			const response = await apiCall.json();
			setTopRatedVendors(response);
		} catch (error) {
			Alert.alert("Error", "Network Error");
		} finally {
			setTopRatedVendorsLoaded(true);
		}
	};

	const fetchVendorsByType = async (vendor_type: string) => {
		const token = await getToken();
		const payload = {
			vendor_type,
		};
		try {
			const apiCall = await fetch(ApiRoutes.VendorsByType.path, {
				method: ApiRoutes.VendorsByType.method,
				headers: {
					"Authorization": `Bearer ${token}`,
					"Content-Type": "Application/json",
				},
				body: JSON.stringify(payload),
			});
			const response = await apiCall.json();
			if(vendor_type == "refill"){
				setRefillVendors(response)
			}else if(vendor_type == "whole_seller"){
				setWholeSellers(response)
			}else{
				setGeneral(response)
			}
		} catch (error: any) {
			Alert.alert("Error", "Something went wrong");
			console.log(error.message)
		}finally{
			if(vendor_type == "refill"){
				setRefillVendorsLoaded(true)
			}else if(vendor_type == "whole_seller"){
				setWholeSellersLoaded(true)
			}else{
				setGeneralLoaded(true)
			}
		}
	};

	const fetchTopBrands = async () => {
		const token = await getToken();
		try {
			const apiCall = await fetch(ApiRoutes.TopBrandsVendors.path, {
				method: ApiRoutes.TopBrandsVendors.method,
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "Application/json",
				},
			});

			const response = await apiCall.json();
			setTopBrands(response)
		} catch (error: any) {
			console.log(error.message)
		}finally{
			setTopBrandsloaded(true)
		}
	};

	useEffect(() => {
		async function getCurrentLocation() {
			let { status } = await Location.requestForegroundPermissionsAsync();
			if (status !== "granted") {
				setErrorMsg("Permission to access location was denied");
				return;
			}
			let location = await Location.getCurrentPositionAsync({});
			setLocation(location);
		}
		// getCurrentLocation();
	}, []);

	useEffect(() => {
		const readyToExecute =() => {
			fetchNearByVendors();
			fetchTopRatedVendors();
			fetchTopBrands();
			fetchVendorsByType("refill");
			fetchVendorsByType("whole_seller");
			fetchVendorsByType("general");
		};

		readyToExecute();
	}, []);

	return (
		<>
			<StatusBar
				translucent
				backgroundColor={darkTheme ? "black" : "white"}
				barStyle={darkTheme ? "light-content" : "dark-content"}
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
					<View
						className={`${
							darkTheme ? "bg-black" : "bg-white"
						} shadow-2xl py-3 z-20 gap-3 rounded-b[20px] `}
					>
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
										<View
											className={`${
												darkTheme
													? "bg-accentbg/15"
													: ""
											} rounded-full self-center  w-12 h-12 items-center justify-center`}
										>
											<Image
												source={icons.search}
												className="w-6 h-6"
												tintColor={
													darkTheme
														? "white"
														: "black"
												}
											/>
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
										<View
											className={`${""
												// darkTheme
												// 	? "bg-accentbg/15"
												// 	: ""
											} rounded-full  w-12 h-12 items-center justify-center`}
										>
											<View className="absolute z-10 -right-2 -top-2 bg-accentbg  items-center justify-center w-7 h-7 rounded-full">
												<Text className="text-white font-bold">
													12
												</Text>
											</View>
											<Image
												source={icons.notifications}
												className="w-6 h-6"
												tintColor={
													darkTheme
														? "white"
														: "black"
												}
											/>
										</View>
									</TouchableOpacity>
									<TouchableOpacity
										activeOpacity={0.7}
										onPress={() => {
											router.push("/(screens)/Maps");
										}}
									>
										<View
											className={`${
												darkTheme
													? "bg-accentbg/70"
													: "bg-accentbg"
											} rounded-full w-12 h-12 items-center justify-center`}
										>
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
						className={`${darkTheme ? "bg-black" : "bg-gray-100"}`}
						contentContainerStyle={{ gap: 0, paddingBottom: 30 }}
						showsVerticalScrollIndicator={false}
						scrollEnabled={true}
					>
						{/* <View className=" relative w-screen flex-1  rounded-t-[0px] pt-[10px] -mt-[10px]"></View> */}
						<TouchableWithoutFeedback>
							<View className="gap-1">
								{/* spacial offers */}
								{/* quick order */}
								{/* <FullHorizontalList title="Special Offers" /> */}
								<CarouselComponent/>

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

								<FullHorizontalList
									title="Quick Orders"
									data={NearByVendors}
									loaded={NearbyVendorsLoaded}
								/>
								


								{/* Top Rated  */}
								<HorizontalList
									title={"Top Rated Vendors"}
									data={TopRatedVendors}
									loaded={TopRatedVendorsLoaded}
								/>
								
								{/* refills */}
								<HorizontalList
									title={"Refills"}
									data={RefillVendors}
									loaded={RefillVendorsLoaded}
								/>

								{/* top brands */}
								<HorizontalList
									title={"Popular Brands"}
									data={TopBrands}
									loaded={TopBrandsloaded}
								/>

								{/* wholesale */}
								<HorizontalList
									title={"Whole Sale Vendors "}
									data={WholeSellers}
									loaded={WholeSellersLoaded}
								/>

								{/* Refills  */}
								{/* <HorizontalList title={"Refills"} loaded={TopRatedVendorsLoaded}/> */}
								{/* Offers */}
								{/* <HorizontalList title={"Offers"} type="product" loaded={TopRatedVendorsLoaded} /> */}
								{/* <HorizontalList title={"Whole Sale Suppliers"} loaded={TopRatedVendorsLoaded}/> */}
							</View>
						</TouchableWithoutFeedback>
					</ScrollView>
				</View>
			</TouchableWithoutFeedback>
		</>
	);
}
