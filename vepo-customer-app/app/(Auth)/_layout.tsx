// import { useAuth } from "@clerk/clek-expo";
import { Redirect, Stack, useRouter } from "expo-router";
import {
  Dimensions,
  Image,
  Modal,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  ReanimatedLogLevel,
  configureReanimatedLogger,
} from "react-native-reanimated";
import { useAuth, useUser } from '@clerk/clerk-expo'
import { useContext, useEffect, useState } from "react";
import * as WebBrowser from 'expo-web-browser'
import { UIThemeContext } from "@/context/ThemeContext";
import * as Location from "expo-location";
import ApiRoutes from "@/API/routes/ApiRoutes";
import icons from "@/constants/icons/icons";
// import Modal from "react-native-modal";


configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false, // Reanimated runs in strict mode by default
});

const { width, height } = Dimensions.get("window");


export const useWarmUpBrowser = () => {
  useEffect(() => {
    // Preloads the browser for Android devices to reduce authentication load time
    // See: https://docs.expo.dev/guides/authentication/#improving-user-experience
    void WebBrowser.warmUpAsync()
    return () => {
      // Cleanup: closes browser when component unmounts
      void WebBrowser.coolDownAsync()
    }
  }, [])
}

// Handle any pending authentication sessions
WebBrowser.maybeCompleteAuthSession()




const Layout = () => {
  // <------------------------HOOKES------------------------->
  const { isSignedIn , getToken } = useAuth()
  const router = useRouter();
  const { currentTheme } = useContext(UIThemeContext);
	const { user } = useUser()


  // <------------------------STATES------------------------->
	const [LocationFinal, setLocation] = useState<Location.LocationObject | null>(null);
	const [ShowLocationPrompt, setShowLocationPrompt] = useState(false);
	const [AuthLoading, setAuthLoading] = useState(false);


	const darkTheme = currentTheme === "dark";

  // <-----------------------VARIABLES----------------------->
  const statusbarHieght = StatusBar.currentHeight || 50;

  // <-----------------------FUNCTIONS----------------------->
  useWarmUpBrowser()

  // GET CURRENT LOCATION
	async function getCurrentLocation() {
		setShowLocationPrompt(false);
		try {
			let { status } = await Location.requestForegroundPermissionsAsync();
			if (status !== "granted") {
				// setErrorMsg("Permission to access Location was denied");
				setShowLocationPrompt(true);
				return;
			}
			let location = await Location.getCurrentPositionAsync({});
			setLocation(location);
		} catch (error: any) {
			setShowLocationPrompt(true)
		} 
	}

	const create_new_database_user = async ( clerk_id: string, full_name?:string, email?: string, phone_number?: string, profile_pic?: string) => {
		const payload = {
			clerk_id,
			full_name,
			email,
			phone_number,
			profile_pic
		}
		try {
			const apiCall = await fetch(ApiRoutes.CreateNewUser.path, {
				method: ApiRoutes.CreateNewUser.method,
				headers: {
					"Content-Type" : "Application/json"
				},
				body: JSON.stringify(payload)
			})
			const response = await apiCall.json()
		} catch (error) {
		}
	}

  // UPDATE USER LOCATION
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
		} catch (error) {
		}
	};

  useEffect(()=>{
    getCurrentLocation()
  },[])

  if (isSignedIn) {
			if (user) {
				create_new_database_user(
					user.id,
					user.fullName || "",
					user.emailAddresses[0]?.emailAddress || "",
					user.phoneNumbers[0]?.phoneNumber || "",
					user.imageUrl || ""
				)
				.then(()=>{
					if(location != null) {
						updateUserLocation()
						.then(()=>{
							router.replace("/(screens)")
						})
					}
				})
			}
  }

  return (
    <>
      <StatusBar
        translucent={true}
        backgroundColor="transparent"
        barStyle="dark-content" // or "dark-content" depending on your UI
        animated={true}
      />

      <View
        className={`absolute ${darkTheme? 'bg-black' : 'bg-white'}`}
        style={{
          minHeight: height+statusbarHieght,
          minWidth: width,
        }}
      >
        <Stack
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right', // Options: 'fade', 'slide_from_right', 'slide_from_left', 'none'
        }}
        />
        {/* loading modal */}
        <Modal visible={AuthLoading}>
					<View className="items-center">
						<Animated.View className={"animate-spin"}>
							<Image
								source={icons.spinner}
								className="w-28 h-28"
								tintColor={"#d9a31b"}
							/>
						</Animated.View>
					</View>
				</Modal>

        {/* location access prompt modal */}
        <Modal visible={ShowLocationPrompt} backdropColor={"transparent"}>
						<View className="items-center flex-1 justify-center">
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
										<Text
											className={`text-white font-bold`}
										>
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
};

export default Layout;
