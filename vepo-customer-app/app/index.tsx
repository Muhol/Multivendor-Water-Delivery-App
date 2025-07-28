import { StatusBar } from "expo-status-bar";
// import Spinner from "react-native-loading-spinner-overlay";
import React, {
	useCallback,
	useContext,
	useEffect,
	useLayoutEffect,
	useState,
} from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
// import SystemNavigationBar from 'react-native-system-navigation-bar';
import Animated from "react-native-reanimated";
import icons from "@/constants/icons/icons";
import { Redirect, SplashScreen, useRouter } from "expo-router";
import { preloadImages } from "@/constants/images/images";
import { UIThemeContext } from "@/context/ThemeContext";
import * as Location from "expo-location";
import ApiRoutes from "@/API/routes/ApiRoutes";
import { useAuth } from "@clerk/clerk-expo";
import Modal from "react-native-modal";

// SplashScreen.preventAutoHideAsync();

export default function Index() {
	// <-----------------HOOKES----------------->
	const router = useRouter();
	const { currentTheme } = useContext(UIThemeContext);
	const darkTheme = currentTheme === "dark";
	const { getToken } = useAuth();
	const { isSignedIn } = useAuth();

	// <-----------------STATES----------------->
	const [IsReady, setIsReady] = useState(false);
	const [ImagesLoaded, setImagesLoaded] = useState(false);
	const [LocationUpdated, setLocationUpdated] = useState(false);
	// location
	const [ShowLocationPrompt, setShowLocationPrompt] = useState(false);
	const [errorMsg, setErrorMsg] = useState<string | null>(null);
	const [LocationFinal, setLocation] = useState<Location.LocationObject | null>(null);

	// <---------------FUNCTIONS---------------->

	// LOGIC B4 LOADING TO THE HOME OR AUTH SCREEN
	// INSTANCES THAT DETERMINE THE LOADING IS COMPLETE  [IMAGES BEING LOADED , THE LOCATION BEING UPDATED , IF THE USER IS SIGNED IN ]
	// POSSIBILITIES [ USER IS SIGNED IN , NOT SIGNED IN , LOCATION PERMISSION IS DENIED , LOCATION ACCESS IS GRANTED , IMAGES ARE LOADED OR NOT ]
	// ACTIONS TO BE TAKEN ACCORDING TO THE POSSIBILITIES
	// >> USER NO SIGNED IN [ ** LOAD THE IMAGES >---> REDIRECT TO THE AUTH SCREENS ** ]
	// >> USER SIGNED IN [ ** LOAD THE IMAGES >--> ACCESS CURRENT LOCATION >--> IF LOCATION IS NOT NULL [ UPDATE THE LOCATION IN THE DATABASE ] ELSE [ GIVE THE USER THE OPTION TO GRANT THE LOCATION ACCESS ] ** ]
	// >> IF LOCATION UPDATE IS SUCCESSFUL [ ** REDIRECT TO THE HOME PAGE  ** ]
	// >>
	// >>


	// API CALLS
	const updateUserLocation = async () => {
		const token = await getToken();
		const payload = {
			lat: LocationFinal?.coords.latitude,
			lng: LocationFinal?.coords.longitude,
		};
		try {
			const apiCall = await fetch(ApiRoutes.UpdateUserLocation.path, {
				method: ApiRoutes.UpdateUserLocation.method,
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "Application/json",
				},
				body: JSON.stringify(payload),
			});

			const response = await apiCall.json();
			setLocationUpdated(true);
		} catch (error) {
		}
	};

	// <--------------------------------<GET USER LOCATION FUNCTION>-------------------------------->
	async function getCurrentLocation() {
		setShowLocationPrompt(false);
		try {
			let { status } = await Location.requestForegroundPermissionsAsync();
			if (status !== "granted") {
				setErrorMsg("Permission to access Location was denied");
				// setShowLocationPrompt(true);
				return;
			}
			let location = await Location.getCurrentPositionAsync({});
			setLocation(location);
		} catch (error: any) {
			// Example error handling for GPS off
			setShowLocationPrompt(true)
		} finally{
			
		}
	}

	useEffect(() => {
		const StartUpLogic = async () => {
			try {
				getCurrentLocation()
			} catch (error) {
			}
		};

		if (isSignedIn){
			// console.log(isSignedIn)
			setIsReady(true) // for it to work on the simulator
			StartUpLogic()
		}
		if(isSignedIn === false){
			// console.log(isSignedIn)
			setIsReady(true)
		}
	}, [ isSignedIn ]);

	useEffect(() => {
		// setIsReady(true)  // no internet
		if(LocationFinal != null){
			updateUserLocation().then(() => {
				setIsReady(true)
			})
		}
	}, [LocationFinal])

	if (!IsReady) {
		return (
			<>
				<StatusBar
					style={darkTheme ? "light" : "dark"}
					backgroundColor={darkTheme ? "black" : "#f0f0f0"}
				/>
				<View
					className={`flex-1 ${
						darkTheme ? "bg-black" : "bg-[#f0f0f0]"
					} w-full items-center justify-center gap-[10px]`}
				>
					<Animated.View>
						<Animated.View
							className={
								"animate-spin transition-all duration-700"
							}
						>
							<Image
								source={icons.spinner}
								className="w-28 h-28"
								tintColor={"#d9a31b"}
							/>
						</Animated.View>
					</Animated.View>
					<Modal isVisible={ShowLocationPrompt}>
						<View className="items-center">
							<View
								className={`bg-white w-[80%]  gap-6 max-w-[300px] rounded-3xl p-6`}
							>
								<View className={`flex-row gap-3 `}>
									<Image
										source={icons.myLocation}
										tintColor={"#3b82f6"}
										className="w-7 h-7"
									/>
									<Text className="font-semibold text-2xl text-blue-500">
										Location Access
									</Text>
								</View>
								<View className="">
									<View className="">
										<Text>
											This app requires access to your
											current location for it to work
											properly.{" "}
										</Text>
										<Text>
											Please grant permission to access
											your location in order to proceed
										</Text>
										<Text>
											If you have allowed location
											permission and are still getting
											this prompt it might be a Network
											issue so Please check your Network
											settings{" "}
										</Text>
									</View>
								</View>
								<TouchableOpacity
									activeOpacity={0.8}
									onPress={() => {
										getCurrentLocation();
									}}
								>
									<View
										className={`bg-blue-500 p-3 px-6 rounded-xl items-center `}
									>
										<Text className={`text-white font-bold`} >
											Allow Location Access
										</Text>
									</View>
								</TouchableOpacity>
							</View>
						</View>
					</Modal>
				</View>
			</>
		);
	}

	if(isSignedIn){
		return <Redirect href={"/(screens)"} />;
	}else{
		return <Redirect href={"/(Auth)"}/>
		// return <Redirect href={"/(screens)"} />; // no internet
	}
}
