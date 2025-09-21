// url : /(screens)/Maps/lat=lat%lng=lng%id=id


import React, { useCallback, useContext, useEffect, useState } from "react";
import MapView, { Callout, Marker, Region } from "react-native-maps";
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
	ActionSheetIOS,
} from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
import BackButton from "@/components/ui/BackButton";
import { Redirect, usePathname, useRouter } from "expo-router";
import {
	Directions,
	Gesture,
	GestureDetector,
	GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
	withTiming,
	withSequence,
	withSpring,
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
import { DarkTheme } from "@react-navigation/native";
import { UIThemeContext } from "@/context/ThemeContext";
import { transform } from "@babel/core";
import OngoingOrderCard from "@/components/common/OngoingOrderCard";
import MiniOrderCard from "@/components/common/MiniOrderCard";
import Context from "@/context/context";
import OrderListItem from "@/components/common/OrderListItem";

const { width, height } = Dimensions.get("window");
const MAP_DIMENSIONS = {
	width: width,
	height: (height + (StatusBar.currentHeight || 0) - 55) * 0.55,
};

const retroMapStyle = [
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#ebe3cd"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#523735"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#f5f1e6"
      }
    ]
  },
  {
    "featureType": "administrative",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#c9b2a6"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#dcd2be"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#ae9e90"
      }
    ]
  },
  {
    "featureType": "landscape.natural",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#dfd2ae"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#dfd2ae"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#93817c"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#a5b076"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#447530"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#f5f1e6"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#fdfcf8"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#f8c967"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#e9bc62"
      }
    ]
  },
  {
    "featureType": "road.highway.controlled_access",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#e98d58"
      }
    ]
  },
  {
    "featureType": "road.highway.controlled_access",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#db8555"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#806b63"
      }
    ]
  },
  {
    "featureType": "transit.line",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#dfd2ae"
      }
    ]
  },
  {
    "featureType": "transit.line",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#8f7d77"
      }
    ]
  },
  {
    "featureType": "transit.line",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#ebe3cd"
      }
    ]
  },
  {
    "featureType": "transit.station",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#dfd2ae"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#b9d3c2"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#92998d"
      }
    ]
  }
]

const darkMapStyle = [
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#212121"
      }
    ]
  },
  {
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#212121"
      }
    ]
  },
  {
    "featureType": "administrative",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "administrative.country",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "administrative.locality",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#bdbdbd"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#181818"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#1b1b1b"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#2c2c2c"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#8a8a8a"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#373737"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#3c3c3c"
      }
    ]
  },
  {
    "featureType": "road.highway.controlled_access",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#4e4e4e"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "featureType": "transit",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#000000"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#3d3d3d"
      }
    ]
  }
]

const standardMapStyle : any = []

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
	const { User, fetchUserDetails } = useContext(Context);
	const { currentTheme } = useContext(UIThemeContext);
	const darkTheme = currentTheme === "dark";
	const path = usePathname()
	
	const pathParts = path?.split("/") ?? [];
	const rawParams = pathParts[2] ?? ""; // fallback to empty string if not present
	const pathVariables = rawParams.split("%");


	const pathLat = Number(pathVariables?.[0]?.split("=")[1]) || 1;
	const pathlng = Number(pathVariables?.[1]?.split("=")[1]) || 1;
	const pathid = pathVariables?.[2]?.split("=")[1] || null;

	// console.log("pathLat", pathLat)
	// <------------------------STATES------------------------->
	const [dataShown, setDataShown] = useState("orders"); // either ['setLocation', 'vendorDetails', 'orders', 'all'] : View for a vendor picked on the map, View for ongoing orders/in transit or View for edit and set location
	const [Loading, setLoading] = useState(false);
	const [Vendors, setVendors] = useState<any[]>([]);
	const [Vendor, setVendor] = useState<any>();
	// console.log(Vendor)
	const [location, setLocation] = useState<Location.LocationObject | null>(
		null
	);
	const [ShowFloatingOrder, setShowFloatingOrder] = useState(false)
	const [ShowFloatingVendor, setShowFloatingVendor] = useState(false)
	const [errorMsg, setErrorMsg] = useState<string | null>(null);
	const [markers, setMarkers] = useState<any[]>([]);

	// if(User === undefined || User === null){
	// 	fetchUserDetails()
	// 	router.push("/(screens)")
	// }

	const initialRegion : Region = {
		latitude: pathLat, 
		longitude: pathlng,
		latitudeDelta: 0.5922,
		longitudeDelta: 0.5421,
	};

	const [region, setRegion] = useState(initialRegion);

	// <-----------------------VARIABLES----------------------->
	const StatusBarHeight = StatusBar.currentHeight || 0;
	const finalHeight = height + StatusBarHeight;
	// const mapHeight = useSharedValue(finalHeight);
	const mapHeight = useSharedValue(finalHeight);
	const viewHeight = useSharedValue(0);
	const viewOpacity = useSharedValue(0);
	const viewScale = useSharedValue(0);
	const viewTranslate = useSharedValue(finalHeight * 0.46 * 0.5);
	const floatOpacity = useSharedValue(1);
	const floatScale = useSharedValue(1);
	const floatOrderOpacity = useSharedValue(1);
	const floatOrderScale = useSharedValue(1);

	// <----------------------FUNCTIONS------------------------>
	// >---->> ANIMATIONS
	const animatedMapStyle = useAnimatedStyle(() => ({
		height: mapHeight.value,
	}));

	const animatedView = useAnimatedStyle(() => ({
		opacity: viewOpacity.value,
		transform: [
			{ scaleY: viewScale.value },
			{ translateY: viewTranslate.value },
		],
	}));

	const animatedFloatingVendorView = useAnimatedStyle(() => ({
		opacity: floatOpacity.value,
		transform: [{ scale: floatScale.value }],
	}));

	const animatedFloatingOrderView = useAnimatedStyle(() => ({
		opacity: floatOrderOpacity.value,
		transform: [{ scale: floatOrderScale.value }],
	}));


	const vendorMapView = () => {
		setShowFloatingVendor(true)
		mapHeight.value = withTiming(finalHeight, { duration: 200 });
		viewOpacity.value = withTiming(0, { duration: 200 });
		viewScale.value = withTiming(0, { duration: 200 });
		floatOpacity.value = withTiming(1, { duration: 300 });
		floatScale.value = withSpring(1);
		floatOrderOpacity.value = withTiming(0, { duration: 300 });
		floatOrderScale.value = withTiming(0, { duration: 50 });
		viewTranslate.value = withTiming(finalHeight * 0.46 * 0.5, {
			duration: 200,
		});
		viewHeight.value = withTiming(0, { duration: 200 });
	};
	const orderTrackingView = () => {
		setShowFloatingOrder(true)
		mapHeight.value = withTiming(finalHeight, { duration: 200 });
		viewOpacity.value = withTiming(0, { duration: 200 });
		viewScale.value = withTiming(0, { duration: 200 });
		floatOrderOpacity.value = withTiming(1, { duration: 300 });
		floatOrderScale.value = withSpring(1);
		floatOpacity.value = withTiming(0, { duration: 300 });
		floatScale.value = withTiming(0, { duration: 50 });
		viewTranslate.value = withTiming(finalHeight * 0.46 * 0.5, {
			duration: 200,
		});
		viewHeight.value = withTiming(0, { duration: 200 });
		setShowFloatingVendor(false)
	};

	const collapseFullscreenMap = () => {
		mapHeight.value = withTiming(finalHeight * 0.55, { duration: 200 });
		viewOpacity.value = withTiming(1, { duration: 200 });
		viewScale.value = withTiming(1, { duration: 200 });
		floatOpacity.value = withTiming(0, { duration: 300 });
		floatScale.value = withTiming(0, { duration: 50 });
		floatOrderOpacity.value = withTiming(0, { duration: 300 });
		floatOrderScale.value = withTiming(0, { duration: 50 });
		viewTranslate.value = withTiming(0, { duration: 200 });
		viewHeight.value = withTiming(finalHeight * 0.46, { duration: 200 });
		setShowFloatingOrder(false)
		setShowFloatingVendor(false)
	};

	// >---->> GESTURE HANDLER
	const flingUp = Gesture.Fling()
		.direction(Directions.UP)
		.onStart(() => {
			viewHeight.value = withTiming(finalHeight * 0.85, {
				duration: 500,
			});
		});
	const flingDown = Gesture.Fling()
		.direction(Directions.DOWN)
		.onStart(() => {
			viewHeight.value = withTiming(finalHeight * 0.46, {
				duration: 500,
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
			if(pathid != null && pathid != undefined){
				console.log("executing")
				for(const vendor of response){
					if (vendor.id === pathid){
						const vendorData = {
							id: vendor.id,
							title: vendor.business_name,
							owners_name: vendor.owners_name,
							rating: vendor.rating,
							image: vendor.profile_pic
						}
						setVendor(vendorData)
						vendorMapView()
					}
				}
			}
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
						image: vendor.profile_pic
					},
				}));
			};
			setMarkers(convertToClusterPoints(response));
		} catch (error) {
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
				// pinColor="lightblue"
			>
				<View
					className={`w-[45px] h-[45px] items-center justify-center rounded-full border-2 border-accentbg bg-black `}
				>
					<Text className="text-accentbg font-semibold">
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
				
				onPress={() => {
					setShowFloatingOrder(false)
					setVendor(item.properties);
					vendorMapView();
				}}
			>
				<Animated.View className={`items-center w-[50px] h-[50px]  justify-center`}>
					<Image source={icons.water_marker} className="w-full h-full" tintColor={darkTheme?"#d9a31b":"#d9a31b"} resizeMode="cover"/>
					{/* <Image source={icons.water_marker} className="w-full h-full" tintColor={darkTheme?"#d9a31b":"#2391f3"} resizeMode="cover"/> */}
					<View className={`p-1 ${darkTheme?"bg-black":"bg-white"} absolute top-2 min-w-[25px] min-h-[25px] rounded-full -z-10`}></View>
				</Animated.View>
			</Marker>
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

	if (!User) return null;

	return (
		<>
			<StatusBar
				backgroundColor={"transparent"}
				barStyle={darkTheme ? "light-content" : "dark-content"}
			/>
			<View
				className={`w-screen absolute ${darkTheme ? "bg-black" : ""}`}
				style={{
					height: finalHeight
				}}
			>

				<GestureHandlerRootView>
					<Animated.View
						
						style={[animatedMapStyle]}
					>
						<TouchableWithoutFeedback>
										<MapView
											style={StyleSheet.absoluteFill}
											onRegionChangeComplete={setRegion}
											initialRegion={initialRegion}
											customMapStyle={darkTheme ? darkMapStyle: standardMapStyle}
											userLocationUpdateInterval={3000}
											showsUserLocation={true}
											showsMyLocationButton ={ false }
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
					{/* <--------KEYBOARD AVOIDING VIEW-------> */}
					{/* <------ANIMATED MINI VENDOR CARD------> */}
					{ ShowFloatingVendor && Vendor != null && Vendor != undefined && (
						<Animated.View
							className="absolute bottom-[80px] w-full px-7"
							style={[animatedFloatingVendorView]}
						>
							<View className="relative self-center max-w-[400px] w-full ">
								<View className="absolute -top-14 right-0  items-center gap-3 flex-row">
									<TouchableOpacity
										onPress={()=>{
											setDataShown("orders")
											collapseFullscreenMap()
										}}
									>
										<View className={`px-6 py-3 ${darkTheme?"bg-black":"bg-white"} rounded-full`}>
											<Text className={`text-accentbg font-bold`}>Track Orders</Text>
										</View>
									</TouchableOpacity>
									<TouchableOpacity 
										activeOpacity={0.6}
										onPress={()=>{
											collapseFullscreenMap()
										}}
									>
										<View
											className={`w-12 h-12 ${
												darkTheme ? "bg-black" : "bg-white"
											} rounded-full items-center justify-center shadow-xl shadow-black `}
										>
											<View className={`pb-1`}>
												<Image
													source={icons.upArrow}
													className="w-7 h-7"
													tintColor={darkTheme?"white":"black"}
												/>
											</View>
										</View>
									</TouchableOpacity>
								</View>
								<MiniVendorCard FullMap={false} data={Vendor} />
							</View>
						</Animated.View>
					)}

					{ShowFloatingOrder && (
						<Animated.View 
							className="absolute bottom-[80px] w-full px-7"
							style={[
								animatedFloatingOrderView,
							]}
						>
							<View className="relative self-center max-w-[400px] ">
								<View className="absolute -top-14 right-0  items-center gap-3 flex-row">
									<TouchableOpacity 
										activeOpacity={0.6}
										onPress={()=>{ 
											collapseFullscreenMap()
											setShowFloatingOrder(false)
										}}
									>
										<View
											className={`w-12 h-12 ${
												darkTheme ? "bg-black" : "bg-white"
											} rounded-full items-center justify-center shadow-xl shadow-black `}
										>
											<View className={`pb-1`}>
												<Image
													source={icons.upArrow}
													className="w-7 h-7"
													tintColor={darkTheme?"white":"black"}
												/>
											</View>
										</View>
									</TouchableOpacity>
								</View>
								<MiniOrderCard/>
							</View>
						</Animated.View>
					)}

					<KeyboardAvoidingView
						behavior="position"
						className="absolute bottom-0 flex-1 justify-end"
					>
						<GestureDetector gesture={flingGesture}>
							<Animated.View
								className={`${
									darkTheme ? "bg-black" : "bg-white"
								}  ${""} rounded-t-[15px] shadow-black shadow-2xl items-center p-2  relative bottom-0 w-full`}
								style={[
									{
										shadowColor: "black",
										shadowOpacity: 1,
										height: viewHeight,
										width,
									},
									animatedView,
								]}
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
									onPress={() => {
									}}
									activeOpacity={0.7}
								>
									<Animated.View
										className={`  w-12 h-12 ${
											darkTheme ? "bg-black" : "bg-white"
										} rounded-full items-center justify-center shadow-xl shadow-black `}
										style={{}}
									>
										<Image
											source={icons.gps}
											className="w-9 h-9"
											tintColor={
												darkTheme ? "white" : "black"
											}
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
									
									{dataShown === "orders" && (
										<View className="gap-2 p-3">
											<Text className={`font-semibold text-xl ${darkTheme?"text-white":"text-black"}`}>Ongoing Orders</Text>
											<OngoingOrderCard TrackOrder={() => {
												orderTrackingView()
												}}/>
											<View className={`py-3 gap-2`}>
												<View className={`flex-row w-full justify-between items-center`}>
													<Text className={`font-semibold text-xl ${darkTheme?"text-white":"text-black"}`}>Order History</Text>
													<TouchableOpacity
														activeOpacity={0.7}
														onPress={()=>{
															router.push("/(screens)/Orders")
														}}
													>
														<View className={`px-3 py-2 flex-row gap-2 items-center rounded-full ${darkTheme?"bg-gray-200/10":"bg-gray-200"}`}> 
															<Text className={`font-semibold ${darkTheme?"text-gray-400":"text-gray-600"}`}>See all</Text>
															<Image source={icons.right} className={`w-5 h-5`} tintColor={darkTheme?"white":"black"}/>
														</View>
													</TouchableOpacity>
												</View>
											</View>
											<View className={`gap-3`}>
												<OrderListItem/>
												<OrderListItem/>
												<OrderListItem/>
												<OrderListItem/>
												<OrderListItem/>
											</View>
										</View>
									)}

									{/* <----------------DATA FOR TRACKING ONGOING ORDERS LIVE-----------------> */}
									{/* <----DATA: RIDER PROFILE[ NAME, PROFILE_PIC, PHONE_NUMBER WITH OPTION TO CALL;CALL_BUTTON,EST TIME REMAINING ]----> */}
								</Animated.ScrollView>

								{/* <-------------------TRACK ORDER & SET LOCATION BUTTONS-------------------> */}
								<Animated.View
									className={` min-h-[0px]  justify-center gap-4 items-center flex-row ${
										darkTheme ? "bg-black" : "bg-white"
									} w-full `}
								>
								</Animated.View>
							</Animated.View>
						</GestureDetector>
					</KeyboardAvoidingView>
				</GestureHandlerRootView>
			</View>
		</>
	);
}


