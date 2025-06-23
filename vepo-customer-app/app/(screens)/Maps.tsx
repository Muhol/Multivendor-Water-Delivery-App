import React, {
	useCallback,
	useEffect,
	useLayoutEffect,
	useState,
} from "react";
import MapView, { Callout, Marker } from "react-native-maps";
import {
	Dimensions,
	Keyboard,
	ScrollView,
	StatusBar,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	TouchableWithoutFeedback,
	View,
	SafeAreaView,
	KeyboardAvoidingView,
} from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
import BackButton from "@/components/ui/BackButton";
import { useRouter } from "expo-router";
import {
	Directions,
	Gesture,
	GestureDetector,
	GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
	withTiming,
	useSharedValue,
	useAnimatedStyle,
} from "react-native-reanimated";
import { Image } from "react-native";
import icons from "@/constants/icons/icons";
import MiniVendorCard from "@/components/common/MiniVendorCard";
import Button from "@/components/ui/Button";
import ComicText from "@/components/styled-components/custom-texts/ComicText";
import TrackOrderCard from "@/components/common/TrackOrderCard";
import ApiRoutes from "@/API/routes/ApiRoutes";
import { Clusterer } from "react-native-clusterer";
import * as Location from "expo-location";

const { width, height } = Dimensions.get("window");
const MAP_DIMENSIONS = {
	width: width,
	height: (height + (StatusBar.currentHeight || 0) - 55) * 0.55,
};

type Vendor = {
	id: string;
	owners_name: string;
	business_name: string;
	email: string;
	phone_number: string;
	profile_pic: string;
	location_address: string;
	lat: number;
	lng: number;
	delivery_radius: number;
	shift_start: string; // e.g. "07:00:00"
	shift_end: string; // e.g. "19:00:00"
	verification_status: "pending" | "verified" | "rejected"; // enum-like union
	rating: number;
	preferred_payment_method: ("cash" | "mpesa" | "card" | "bank_transfer")[];
};

export default function Maps() {
	// <------------------------HOOKS------------------------->
	const router = useRouter();

	// <------------------------STATES------------------------->
	const [dataShown, setDataShown] = useState("vendorDetails"); // either ['setLocation', 'vendorDetails', 'orders', 'all'] : View for a vendor picked on the map, View for ongoing orders/in transit or View for edit and set location
	const [Loading, setLoading] = useState(false);
	const [Vendors, setVendors] = useState<any[]>([]);
	const [Vendor, setVendor] = useState<any>();
	const [location, setLocation] = useState<Location.LocationObject | null>(
		null
	);
	const [errorMsg, setErrorMsg] = useState<string | null>(null);
	const [markers, setMarkers] = useState<any[]>([]);

	const initialRegion = {
		latitude: location?.coords.latitude || 1,
		longitude: location?.coords.longitude || 36,
		latitudeDelta: 0.5922,
		longitudeDelta: 0.5421,
	};
	const [region, setRegion] = useState(initialRegion);

	// <-----------------------VARIABLES----------------------->
	const StatusBarHeight = StatusBar.currentHeight || 0;
	const finalHeight = height + StatusBarHeight - 55;
	const mapHeight = useSharedValue(finalHeight * 0.55);
	const viewHeight = useSharedValue(finalHeight * 0.46);

	// <----------------------FUNCTIONS------------------------>
	// >---->> GESTURE HANDLER
	const flingUp = Gesture.Fling()
		.direction(Directions.UP)
		.onStart(() => {
			viewHeight.value = withTiming(finalHeight * 0.85, {
				duration: 300,
			});
		});
	const flingDown = Gesture.Fling()
		.direction(Directions.DOWN)
		.onStart(() => {
			viewHeight.value = withTiming(finalHeight * 0.46, {
				duration: 300,
			});
		});
	const flingGesture = Gesture.Simultaneous(flingUp, flingDown); // or .Simultaneous

	// >---->> FETCHING DATA FROM BACKEND
	const fetchVendor = async () => {
		setLoading(true);
		try {
			const callApi = await fetch(ApiRoutes.AllVendors.path, {
				method: ApiRoutes.AllVendors.method,
				headers: {
					Content_type: "application/json",
				},
			});
			const response = await callApi.json();
			// setVendors(response);
			const convertToClusterPoints = (vendors: Vendor[]) => {
				return vendors.map((vendor: Vendor) => ({
					type: "Feature",
					geometry: {
						type: "Point",
						coordinates: [vendor.lng, vendor.lat], // [lng, lat]
					},
					properties: {
						id: vendor.id,
						title: vendor.business_name,
						owners_name: vendor.owners_name,
						rating: vendor.rating,
					},
				}));
			};
			// console.log(convertToClusterPoints(response))
			setMarkers(convertToClusterPoints(response));
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};

	// MAP MARKERS CALLBACK
	const renderClusterMarker = useCallback((item: any) => {
		return (
			<Marker
				key={`cluster-${item.properties.cluster_id}`}
				coordinate={{
					latitude: item.geometry.coordinates[1],
					longitude: item.geometry.coordinates[0],
				}}
				pinColor="lightblue"
			>
				<View
					className={`w-[45px] h-[45px] items-center justify-center rounded-full border-2 border-white bg-sky-400`}
				>
					<Text className="text-white font-semibold">
						{item.properties.point_count}
					</Text>
				</View>
			</Marker>
		);
	}, []);

	const renderSingleMarker = useCallback((item: any) => {
		return (
			<Marker
				key={item.properties.id}
				coordinate={{
					latitude: item.geometry.coordinates[1],
					longitude: item.geometry.coordinates[0],
				}}
				title={item.properties.title}
				pinColor="lightblue"
				onPress={() => {
					setVendor(item.properties);
					setDataShown("vendorDetails");
				}}
			/>
		);
	}, []);

	// GET CURRENT USER LOCATION FUNCTION
	async function getCurrentLocation() {
		let { status } = await Location.requestForegroundPermissionsAsync();
		if (status !== "granted") {
			setErrorMsg("Permission to access location was denied");
			return;
		}
		let location = await Location.getCurrentPositionAsync({});
		setLocation(location);
	}
	useEffect(() => {
		getCurrentLocation();
		fetchVendor();
	}, []);

	return (
		<>
			<StatusBar
				backgroundColor={"transparent"}
				barStyle={"dark-content"}
			/>
			<GestureHandlerRootView>
				<Animated.View
					className={`w-screen absolute`}
					style={[
						{
							height: mapHeight,
						},
					]}
				>
					<TouchableWithoutFeedback>
						<MapView
							style={StyleSheet.absoluteFill}
							onRegionChangeComplete={setRegion}
							initialRegion={initialRegion}
							mapType="standard"
							userLocationUpdateInterval={3000}
							showsUserLocation={true}
							showsMyLocationButton
						>
							<Clusterer
								data={markers}
								region={region}
								options={{}}
								mapDimensions={MAP_DIMENSIONS}
								renderItem={(item) =>
									item.properties.cluster
										? renderClusterMarker(item)
										: renderSingleMarker(item)
								}
							/>
						</MapView>
					</TouchableWithoutFeedback>
				</Animated.View>
				{/* <-------------BACK_BUTTON-------------> */}
				<View
					className="absolute left-0 "
					style={{
						top: StatusBar.currentHeight,
					}}
				>
					<View className="w-full  flex-row items-center px-5 py-6 justify-between z-20">
						<TouchableOpacity
							activeOpacity={0.7}
							onPress={() => router.back()}
						>
							<BackButton />
						</TouchableOpacity>
					</View>
				</View>

				<KeyboardAvoidingView
					behavior="position"
					className="absolute bottom-0 flex-1 justify-end"
				>
					<GestureDetector gesture={flingGesture}>
						<Animated.View
							className={`bg-white  ${""} rounded-t-[15px] shadow-black shadow-2xl items-center p-2  relative bottom-0 w-full`}
							style={{
								shadowColor: "black",
								shadowOpacity: 1,
								height: viewHeight,
								width,
							}}
						>
							{/* <-------------------------GESTURE CONTROLLER---------------------------> */}
							<TouchableOpacity
								activeOpacity={0.7}
								style={{
									width: width,
								}}
							>
								<View className="pb-4 px-3 w-full items-center justify-center ">
									<View
										className={`w-14 h-2 rounded-full bg-accentbg/40`}
									></View>
								</View>
							</TouchableOpacity>

							{/* <---------------------CENTER USER LOCATION TOGGLE-----------------------> */}
							<TouchableOpacity
								className="absolute -top-14 right-4"
								// className="absolute -top-28 right-4"
								onPress={() => {}}
								activeOpacity={0.7}
							>
								<Animated.View
									className={`  w-12 h-12 bg-white rounded-full items-center justify-center shadow-xl shadow-black `}
									style={{}}
								>
									<Image
										source={icons.gps}
										className="w-10 h-10"
									/>
								</Animated.View>
							</TouchableOpacity>

							<Animated.ScrollView
								className="flex-1 w-full "
								contentContainerStyle={{
									gap: 20,
									paddingTop: 10,
								}}
								showsVerticalScrollIndicator={false}
								overScrollMode={"never"}
							>
								{/* <-----SETTING LOCATION MANUALLY: SEARCH INPUT WITH AUTOFILL CURRENT LOCATION BY DEFAULT, ABILITY TO SET THE SELECTED LOCATION AS YOUR DELIVERY ADDRESS----> */}
								{dataShown == "setLocation" && (
									<View className="flex-1 p-3">
										<View className="gap-2 w-full self-center ">
											{/* label: "ENTER LOCATION" */}
											<ComicText
												text={"Enter your Location:"}
												style={" text-xl"}
											/>
											{/* TEXT INPUT */}
											<View className="bg-gray-100 p-2 rounded-2xl flex-row items-center gap-3 px-4">
												{/* ICON */}
												<View className="w-7 h-7">
													<Image
														source={
															icons.myLocation
														}
														className="w-full h-full"
														tintColor={"gray"}
													/>
												</View>
												{/* INPUT */}
												<TextInput
													placeholder="Type Location Here"
													className=" p-3 text-lg"
												/>
											</View>

											{/* <-----------------BITTONS: [SET AS DELIVERY ADDRESS & SAVE]----------------> */}
											<View className="flex-row items-center gap-3 justify-center py-1">
												<TouchableOpacity
													activeOpacity={0.7}
													onPress={() => {}}
												>
													<Button
														style={
															" px-5 py-[9px] rounded "
														}
														label={
															"Set As Default Delivery Address"
														}
														type={"outline"}
														textStyle="text-gray-500"
													/>
												</TouchableOpacity>
												<TouchableOpacity
													activeOpacity={0.7}
													onPress={() => {}}
												>
													<Button
														style={" px-4 rounded"}
														label={
															"Save In Address Book"
														}
														type={""}
													/>
												</TouchableOpacity>
											</View>

											<View className=" items-center">
												<Text>Or</Text>
											</View>
											{/* <--------------OPTION TO USE DEVICE LOCATION: BUTTON--------------> */}
											<View className="items-center ">
												<TouchableOpacity
													activeOpacity={0.7}
													onPress={() => {}}
												>
													<Button
														style={
															"px-[60px] rounded"
														}
														textStyle={
															"text-gray-500"
														}
														label={
															"Use Current Device Location"
														}
														type="outline"
													/>
												</TouchableOpacity>
											</View>
										</View>

										{/* <-----------------------------LOCATION HISTORY----------------------------> */}
										<View className="flex-1 py-6 w-[90%]">
											<ComicText
												text={"Location History"}
												style={"text-xl text-gray-600"}
											/>
											{[...Array(5)].map((i, index) => {
												return (
													<TouchableOpacity
														key={index}
														activeOpacity={0.7}
														onPress={() => {}}
													>
														<View className=" p-2 gap-2">
															{/* <-----LOCATION ITEM-----> */}
															<View className="flex-row gap-3 items-center py-2">
																<View className="w-6 h-6 items-center justify-center">
																	<Image
																		source={
																			icons.location
																		}
																		className="w-full h-full"
																		tintColor={
																			"gray"
																		}
																	/>
																</View>
																{/* <Text className="text-nowrap text-gray-500">
																	{location.length >
																	70
																		? location
																				.substring(
																					0,
																					70
																				)
																				.trim() +
																				"..."
																		: location}
																</Text> */}
															</View>
														</View>
													</TouchableOpacity>
												);
											})}
										</View>
									</View>
								)}

								{dataShown === "vendorDetails" && (
									<MiniVendorCard
										FullMap={false}
										data={Vendor}
									/>
								)}

								{dataShown === "orders" && (
									<View className="gap-2 p-3">
										<View className="">
											<ComicText
												text={"Track Ongoing Orders"}
												style={"text-xl"}
											/>
										</View>

										<View>
											<TrackOrderCard data={""} />
										</View>
									</View>
								)}

								{/* <----------------DATA FOR TRACKING ONGOING ORDERS LIVE-----------------> */}
								{/* <----DATA: RIDER PROFILE[ NAME, PROFILE_PIC, PHONE_NUMBER WITH OPTION TO CALL;CALL_BUTTON,EST TIME REMAINING ]----> */}
							</Animated.ScrollView>

							{/* <-------------------TRACK ORDER & SET LOCATION BUTTONS-------------------> */}
							<Animated.View
								className={` min-h-[40px] py-1 justify-center gap-4 items-center flex-row bg-white w-full `}
							>
								{/* <--------------------------SET lOCATION BUTTON-------------------------> */}
								{dataShown != "setLocation" && (
									<TouchableOpacity
										activeOpacity={0.7}
										onPress={() => {
											setDataShown("setLocation");
										}}
									>
										<Button
											style={
												" px-[30px] py-[9px] rounded-lg "
											}
											label={"Edit My Location"}
											type={"outline"}
										/>
									</TouchableOpacity>
								)}

								{/* <-------------------------TRACK ORDERS BUTTON--------------------------> */}
								{dataShown != "orders" && (
									<TouchableOpacity
										activeOpacity={0.7}
										onPress={() => {
											setDataShown("orders");
										}}
									>
										<Button
											style={" px-[30px] rounded-lg"}
											label={"Track Ongoing Orders"}
										/>
									</TouchableOpacity>
								)}
							</Animated.View>
						</Animated.View>
					</GestureDetector>
				</KeyboardAvoidingView>
			</GestureHandlerRootView>
		</>
	);
}

// {Vendors?.map(( vendor: any, index: React.Key | null | undefined) => {
// 	return(
// 		<Marker
// 			key={index}
// 			coordinate={{
// 				latitude: vendor?.lat,
// 				longitude: vendor?.lng,
// 			}}
// 			title={vendor.business_name}
// 			pinColor={"blue"}
// 			onPress={()=>{
// 				setVendor(vendor)
// 				setDataShown("vendorDetails")
// 			}}
// 		/>
// 	)
// }
// )}
