import {
	View,
	Text,
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
	Dimensions,
	FlatList,
	ListRenderItem,
} from "react-native";
import React, { useCallback, useContext, useEffect, useState } from "react";
import HorizontalList from "@/components/common/HorizontalList";
import ComicText from "@/components/styled-components/custom-texts/ComicText";
import Search from "@/components/common/Search";
import { useRouter } from "expo-router";
import icons from "@/constants/icons/icons";
import images from "@/constants/images/images";
import FullHorizontalList from "@/components/common/FullHorizontalList";
import CartegoriesList from "@/components/common/CartegoriesList";
import ApiRoutes from "@/API/routes/ApiRoutes";
import { useAuth, useUser } from "@clerk/clerk-expo";
import * as Location from "expo-location";
import { UIThemeContext } from "@/context/ThemeContext";
import CarouselComponent from "@/components/common/Carousel";
import Animated from "react-native-reanimated";
import VerticalList from "@/components/common/VerticalList";
import Context from "@/context/context";
import VerticalLoadingList from "@/components/common/VerticalLoadingList";
import { set } from "date-fns";
import { SafeAreaView } from "react-native-safe-area-context";

const width = Dimensions.get("window").width;

export default function Home() {
	// <----------------HOOKS---------------->
	const router = useRouter();
	const { getToken } = useAuth();
	const { user } = useUser()
	const { currentTheme } = useContext(UIThemeContext);
	const { User, fetchUserDetails, fetchCart } = useContext(Context);
	const darkTheme = currentTheme === "dark";

	// <----------------STATES--------------->
	// location
	const [errorMsg, setErrorMsg] = useState<string | null>(null);
	const [location, setLocation] = useState<Location.LocationObject | null>(
		null
	); 
	// near by vendors for quick order
	const [NearByVendors, setNearByVendors] = useState<any[]>([]);
	const [NearbyVendorsLoaded, setNearbyVendorsLoaded] = useState(false);
	// top rated vendors near you
	const [TopRatedVendors, setTopRatedVendors] = useState<any[]>([]);
	const [TopRatedVendorsLoaded, setTopRatedVendorsLoaded] = useState(false);
	// refill vendors for near you
	const [RefillVendors, setRefillVendors] = useState<any[]>([]);
	const [RefillVendorsLoaded, setRefillVendorsLoaded] = useState(false);
	// refill vendors for near you
	const [WholeSellers, setWholeSellers] = useState<any[]>([]);
	const [WholeSellersLoaded, setWholeSellersLoaded] = useState(false);

	const [General, setGeneral] = useState<any[]>([]);
	const [GeneralLoaded, setGeneralLoaded] = useState(false);
	// top brands near you
	const [TopBrands, setTopBrands] = useState<any[]>([]);
	const [TopBrandsloaded, setTopBrandsloaded] = useState(false);

	// offers
	const [Offers, setOffers] = useState<any[]>([]);
	const [OffersLoaded, setOffersLoaded] = useState(false);

	// random products 
	const [page, setPage ] = useState(1)
	const [paginatedProducts, setPaginatedProducts] = useState<any[]>()
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
			// Alert.alert("Error", "Network Error");
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
					Authorization: `Bearer ${token}`,
					"Content-Type": "Application/json",
				},
				body: JSON.stringify(payload),
			});
			const response = await apiCall.json();
			if (vendor_type == "refill") {
				setRefillVendors(response);
			} else if (vendor_type == "whole_seller") {
				setWholeSellers(response);
			} else {
				setGeneral(response);
			}
		} catch (error: any) {
			// Alert.alert("Error", "Something went wrong");
		} finally {
			if (vendor_type == "refill") {
				setRefillVendorsLoaded(true);
			} else if (vendor_type == "whole_seller") {
				setWholeSellersLoaded(true);
			} else {
				setGeneralLoaded(true);
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
			setTopBrands(response);
		} catch (error: any) {
		} finally {
			setTopBrandsloaded(true);
		}
	};

	const fetchProductsWithOffer = async () => {
		// setOffersLoaded(false)
		const token = await getToken();
		try {
			const apiCall = await fetch(ApiRoutes.ProductsWithOffer.path, {
				method: ApiRoutes.ProductsWithOffer.method,
				headers: {
					"Authorization" : `Bearer ${token}`,
					"Content-Type" : "application/json"
				}
			})

			const response = await apiCall.json()
			setOffers(response)
		} catch (error) {
		}finally{
			setOffersLoaded(true)
		}
	}

	const fetchRandomProducts = async () => {
		const token = await getToken()
		const payload = {
			page
		}
		try {
			const apiCall = await fetch(ApiRoutes.RandomPaginatedProducts.path, {
				method: ApiRoutes.RandomPaginatedProducts.method,
				headers: {
					"Authorization": `Bearer ${token}`,
					"Content-Type": "application/json"
				},
				body: JSON.stringify(payload)
			})

			const response = await apiCall.json()
			if(paginatedProducts === undefined){
				setPaginatedProducts([...response])
			}else{
				setPaginatedProducts([...paginatedProducts, ...response])
			}
			setPage(page+1)
		} catch (error) {
			
		}
	}

	const FlatlistRendorItem =React.memo(({ item }: { item: any }) => {
		return (
			<TouchableWithoutFeedback>
				<View
					className={`flex-1 items-center`}
					style={{
						minWidth: width * 0.5,
						maxWidth: width * 0.5,
						paddingHorizontal: width * 0.05,
						paddingVertical: width * 0.025,
					}}
				>
					<TouchableOpacity
						activeOpacity={0.7}
						onPress={() => {
							router.push(`/product-details/${item?.id}`);
						}}
					>
						<View
							className={`rounded overflow-hidden relative ${darkTheme ? "bg-black" : "bg-white"}`}
							style={{
								width: width * 0.39,
							}}
						>
							{/* Offer Badge */}
							{item?.discount > 0 && (
								<View className="absolute w-[60px] bg-red-500 z-20 right-0 items-center justify-center rotate-45 translate-x-4 translate-y-2">
									<Text className="text-white font-semibold">
										{Math.ceil((item?.discount / item?.price) * 100)}%
									</Text>
								</View>
							)}
							{/* image */}
							<View
								className="w-full"
								style={{
									height: width * 0.3,
								}}
							>
								<Image
									source={{ uri: item?.image_url }}
									className="w-full h-full rounded"
								/>
							</View>
							{/* Name, pricing and delivery time  */}
							<View className="w-full h-[50px] px-1 py-2">
								<Text className={darkTheme ? "text-white" : "text-black"}>
									{item?.name?.length > 20
										? item?.name.substring(0, 20).trim() + "..."
										: item?.name}
								</Text>
								<View className="flex-row justify-between items-center">
									{/* price and discount */}
									<View className="flex-row gap-2">
										<Text className={`font-semibold ${darkTheme ? "text-white" : "text-black"}`}>
											KSH {Math.round((item?.price - item?.discount) * 100) / 100}
										</Text>
										{item?.discount > 0 && (
											<Text
												style={{ textDecorationLine: "line-through" }}
												className={darkTheme ? "text-gray-500" : "text-gray-400"}
											>
												{item?.price}
											</Text>
										)}
									</View>
									{/* est delivery time */}
									{/* <View className="flex-row gap-1 items-center">
										<Image
											source={icons.bike}
											className="w-5 h-5"
											tintColor={darkTheme ? "lightgray" : "gray"}
										/>
										<ComicText
											text={"40 mins"}
											style={darkTheme ? "text-gray-300 text-sm" : "text-gray-700 text-sm"}
										/>
									</View> */}
								</View>
							</View>
						</View>
					</TouchableOpacity>
				</View>
			</TouchableWithoutFeedback>
		);
	});
	
	const renderProductItem: ListRenderItem<any> = useCallback(
		({ item }) => <FlatlistRendorItem item={item} />,
		[]
		);

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
		const readyToExecute = async () => {
			fetchNearByVendors();
			fetchTopRatedVendors();
			fetchTopBrands();
			fetchRandomProducts();
			fetchProductsWithOffer();
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
				<SafeAreaView
					className={`flex-1 h-full ${darkTheme?"bg-black":""}`}
					style={{
						// paddingTop: statusBarHieght,
					}}
				>
					{/* <--------------<<HEADER>-----------------> */}
					<View
						className={`${
							darkTheme ? "bg-black" : "bg-white"
						} shadow-2xl py-3 z-20 gap-3 rounded-b[20px] `}
					>
						{/* PROFILE AND NOTIFICATION */}
						<View className="px-5">
							<View className=" flex-row items-center w-full h-[40px] gap-4 justify-between ">
								<View className={`flex-row gap-2 items-center`}>
									<TouchableOpacity 
										activeOpacity={0.6}
										onPress={()=>{
											router.push("/(screens)/Profile")
										}}
									>
										<View className={`w-12 h-12 rounded-full overflow-hidden relative items-center justify-center`}>
											<Image source={icons.profile2} className="w-[42px] h-[42px]" tintColor={darkTheme ? "gray" : "dimgray"}/>
											<Image source={{uri: User?.profile_pic}} className="w-full h-full rounded-full absolute"/>
										</View>
									</TouchableOpacity>
									{user?.emailAddresses != undefined &&
										(<Text className={` font-semibold text-lg ${darkTheme?"text-white":"text-black"}`}>{String(user?.emailAddresses).length > 25 ? String(user?.emailAddresses).substring(0,24).trim()+ "...": String(user?.emailAddresses)}</Text>) 
									}
									{/* <ComicText text={String(user?.emailAddresses).length > 25 ? String(user?.emailAddresses).substring(0,24).trim()+ "...": String(user?.emailAddresses)} style={` font-semibold text-lg ${darkTheme?"text-white":"text-black"}`}/> */}
								</View>
								<View className=" flex-row items-center flex-1 h-full gap-2 justify-end ">
									{User != null && User != undefined && (
										<TouchableOpacity
											activeOpacity={0.7}
											onPress={() => {
												const id = `lat=${User.lat}%lng=${User.lng}`
												router.push({
													pathname: "/(screens)/Map/[id]",
													params: {id}
												});
											}}
										>
											<View
												className={`rounded-full  w-12 h-12 items-center justify-center bg-accentbg/20`}
											>
												<Image
													source={icons.location}
													className="w-7 h-7"
													tintColor={
														darkTheme
															? "white"
															: "black"
													}
												/>
											</View>
										</TouchableOpacity>
									)}
									<TouchableOpacity
										activeOpacity={0.6}
										onPress={() => {
											// router.push(
											// 	"/(screens)/Notifications"
											// );
										}}
									>
										<View
											className={`rounded-full   w-12 h-12 items-center justify-center bg-accentbg/20`}
										>
											{/* UNREAD BADGE */}
											{/* <View className="absolute z-10 -right-2 -top-2 bg-red-500  items-center justify-center w-7 h-7 rounded-full">
												<Text className="text-white font-bold">
													12
												</Text>
											</View> */}
											<Image
												source={icons.notifications}
												className="w-7 h-7"
												tintColor={
													darkTheme
														? "white"
														: "black"
												}
											/>
										</View>
									</TouchableOpacity>
									
								</View>
							</View>
						</View>
					</View>

					<FlatList
						data={paginatedProducts} 
						renderItem={renderProductItem}
						keyExtractor={(item) => item.id.toString()}
						numColumns={2}
						onEndReached={fetchRandomProducts}
						onEndReachedThreshold={0.7}
						extraData={darkTheme}
						ListHeaderComponent={
							<TouchableWithoutFeedback>
								<View className="gap-1 pb-4">
									{/* spacial offers */}
									{/* quick order */}
									{/* <FullHorizontalList title="Special Offers" /> */}

									{
										NearbyVendorsLoaded || TopBrandsloaded || RefillVendorsLoaded || TopRatedVendorsLoaded || WholeSellersLoaded ? (
											<>
											<View style={{ height: (width * 0.4) + 10 }}>
												<CarouselComponent />
											</View>
											</>
										):(
											<View className={`w-full items-center justify-center py-2`}>
												<Animated.View style={{ height: (width * 0.4) + 10 }} className={`items-center justify-center ${darkTheme?"bg-slate-100/10":"bg-white"} rounded w-[97%] animate-pulse`}>
													<Image source={ images.logo} className={`w-[150] h-[50px]`} tintColor={darkTheme?"gray":"lightgray"}/>
												</Animated.View>
											</View>
										)
									}

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

									{/* offers */}
									<VerticalList data={Offers} loaded={OffersLoaded} title="Offers and deals"/>

									{/* top brands */}
									<HorizontalList
										title={"Popular Brands"}
										data={TopBrands}
										loaded={TopBrandsloaded}
									/>

									{/* refills */}
									<HorizontalList
										title={"Refills"}
										data={RefillVendors}
										loaded={RefillVendorsLoaded}
									/>

									{/* wholesale */}
									<HorizontalList
										title={"Whole Sale Vendors "}
										data={WholeSellers}
										loaded={WholeSellersLoaded}
									/>

								</View>
							</TouchableWithoutFeedback>
						}
						ListFooterComponent={
							<View className={`gap-3`}>
								<View className={`w-full flex-row flex-wrap`}>
									{[...Array(2)]?.map((item: any, index: any) => {
										return (
											<View
												key={index}
												className={`flex-1  items-center`}
												style={{
													minWidth: width * 0.5,
													maxWidth: width * 0.5,
													paddingHorizontal: width * 0.05,
													paddingVertical: width * 0.025,
												}}
											>
												<Animated.View
													className={`rounded overflow-hidden relative ${
														darkTheme
															? "bg-gray-200/10"
															: "bg-white"
													} animate-pulse`}
													style={{
														width: width * 0.39,
														height: width * 0.4,
													}}
												>
													{/* image */}
													<View
														className={`w-full`}
														style={{
															height: width * 0.3,
														}}
													></View>
													{/* Name, pricing and delivery time  */}
													<View
														className={`w-full flex-1 px-1 justify-around`}
													>
														<Animated.View
															className={`w-[60%] h-3 rounded-full ${
																darkTheme
																	? "bg-gray-200/20"
																	: "bg-gray-200"
															}`}
														/>
														<View
															className={`flex-row justify-between items-center`}
														>
															{/* price and discount */}
															<Animated.View
																className={`w-[40%] h-3 rounded-full ${
																	darkTheme
																		? "bg-gray-200/20"
																		: "bg-gray-200"
																}`}
															/>
															<Animated.View
																className={`w-[30%] h-3 rounded-full ${
																	darkTheme
																		? "bg-gray-200/20"
																		: "bg-gray-200"
																}`}
															/>
															{/* est delivery time */}
														</View>
													</View>
												</Animated.View>
											</View>
										);
									})}
								</View>
							</View>
						}
					/>
				</SafeAreaView>
			</TouchableWithoutFeedback>
		</>
	);
}
