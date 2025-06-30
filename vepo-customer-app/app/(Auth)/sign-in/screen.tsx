// export const unstable_settings = {
//   animation: "slide_from_right", // Applies slide animation when navigating to this screen
// };

import {
	View,
	Text,
	Dimensions,
	Image,
	SafeAreaView,
	TextInput,
	TouchableOpacity,
	ScrollView,
	KeyboardAvoidingView,
	StatusBar,
	ImageBackground,
	Modal,
} from "react-native";
import React, {
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";
import ComicText from "@/components/styled-components/custom-texts/ComicText";
import InputFeild from "@/components/ui/InputFeild";
import { Link, useRouter } from "expo-router";
import images from "@/constants/images/images";
import { LinearGradient } from "expo-linear-gradient";
import { isClerkAPIResponseError, useAuth, useSignIn } from "@clerk/clerk-expo";
import icons from "@/constants/icons/icons";
import Animated from "react-native-reanimated";
import { useWarmUpBrowser } from "../_layout";
import { useSSO } from "@clerk/clerk-expo";
import * as AuthSession from "expo-auth-session";
import { ClerkAPIError } from "@clerk/types";
import { UIThemeContext } from "@/context/ThemeContext";
import ApiRoutes from "@/API/routes/ApiRoutes";
import * as Location from "expo-location";


const { width, height } = Dimensions.get("window");

export default function SignIn() {
	// <-----------------------<HOOKES>------------------------>
	const { signIn, setActive, isLoaded } = useSignIn();
	const { getToken, isSignedIn } = useAuth()
	const router = useRouter();
	const { startSSOFlow } = useSSO();
	const { currentTheme } = useContext(UIThemeContext);

	const darkTheme = currentTheme === "dark";

	// <-----------------------<STATES>------------------------>
	const [emailAddress, setEmailAddress] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [AuthLoading, setAuthLoading] = useState(false);
	const [errors, setErrors] = React.useState<ClerkAPIError[]>();
	const [LocationFinal, setLocation] = useState<Location.LocationObject | null>(null);
	const [ShowLocationPrompt, setShowLocationPrompt] = useState(false);


	useEffect(() => {
		const resetError = () => {
			setErrors(undefined);
		};
		resetError();
	}, []);

	// <----------------------<VARIABLES>---------------------->
	const statusBarHeight = StatusBar.currentHeight || 0;
	useWarmUpBrowser();

	// <----------------------<FUNCTIONS>---------------------->

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
			// setLocationUpdated(true);
		} catch (error) {
		}
	};

	// SIGN IN ATTEMPT
	const onSignInPress = async () => {
		setLoading(true);
		setErrors(undefined);
		let success = false
		if (!isLoaded) return;

		try {
			const signInAttempt = await signIn.create({
				identifier: emailAddress,
				password,
			});

			if (signInAttempt.status === "complete") {
				await setActive({ session: signInAttempt.createdSessionId });
				success = true
			} else {
				// If the status isn't complete, check why. User might need to
				// complete further steps.
				// console.error(JSON.stringify(signInAttempt, null, 2));
				success = false
			}
		} catch (err) {
			if (isClerkAPIResponseError(err)) setErrors(err.errors);
			success = false
		} finally {
			setLoading(false);
			if (success){
				setAuthLoading(true)
			}
		}
	};

	// OAUTH
	const SignInWithGoogle = useCallback(async () => {
		setAuthLoading(true);
		let success = false
		try {
			// Start the authentication process by calling `startSSOFlow()`
			const { createdSessionId, setActive, signIn, signUp } =
				await startSSOFlow({
					strategy: "oauth_google",
					// For web, defaults to current path
					// For native, you must pass a scheme, like AuthSession.makeRedirectUri({ scheme, path })
					// For more info, see https://docs.expo.dev/versions/latest/sdk/auth-session/#authsessionmakeredirecturioptions
					redirectUrl: AuthSession.makeRedirectUri({
						scheme: "myapp",
						path: "(Auth)/sign-in/screen",
					}),
				});

			// If sign in was successful, set the active session
			if (createdSessionId) {
				setActive!({ session: createdSessionId })
				success = true
			} else {
				// If there is no `createdSessionId`,
				// there are missing requirements, such as MFA
				// Use the `signIn` or `signUp` returned from `startSSOFlow`
				// to handle next steps
				signIn?.authenticateWithPopup;
				setActive!({ session: createdSessionId })
				success = true
			}
		} catch (err) {
			// See https://clerk.com/docs/custom-flows/error-handling
			// for more info on error handling
			// console.error(JSON.stringify(err, null, 2));
			success = false
		} finally {
			if(success === false){
				setAuthLoading(false)
			}
		}
	}, []);

	return (
		<>
			<StatusBar
				backgroundColor={"#00000000"}
				barStyle={darkTheme ? "light-content" : "dark-content"}
			/>

			<View
				className={darkTheme ? "bg-black" : "bg-primarybg"}
				style={{
					flex: 1,
					height: height + statusBarHeight,
				}}
			>
				<KeyboardAvoidingView
					behavior="padding"
					style={{
						flex: 1,
						height: height + statusBarHeight,
					}}
				>
					<ScrollView
						className="flex-1 w-full "
						overScrollMode="never"
						showsVerticalScrollIndicator={false}
						contentContainerStyle={{
							paddingBottom: 100,
							flex: 1,
							height: height + statusBarHeight,
						}}
					>
						<ImageBackground
							source={images.authBgLight}
							style={{
								height: height * 0.35,
								marginBottom: -(height * 0.09),
							}}
						>
							<LinearGradient
								className="w-full h-full "
								colors={[
									darkTheme
										? "rgba(0, 0, 0, 0.2)"
										: "transparent",
									darkTheme
										? "rgba(0, 0, 0, 0.6)"
										: "rgba(240, 240, 240, 0.7)",
									darkTheme
										? "rgba(0, 0, 0, 1)"
										: "rgb(240, 240, 240)",
								]}
							></LinearGradient>
						</ImageBackground>
						<View className="w-full gap-3 px-6">
							<View className=" w-[90%] self-center">
								<ComicText
									text={"Sign In to Your Account"}
									style={
										darkTheme
											? "text-[30px] text-white"
											: "text-[30px] text-black"
									}
								/>
							</View>
							<View className="py-[50px] gap-[20px] items-center">
								<InputFeild
									label={"Email"}
									type={""}
									placeholder={"Enter Your Email"}
									set={(text: string) => {
										setEmailAddress(text);
									}}
								/>
								<InputFeild
									label={"Password"}
									type={"password"}
									placeholder={"Enter Your Password"}
									set={(text: string) => {
										setPassword(text);
									}}
								/>
								{errors && (
									<View className="w-[90%]">
										{errors.map((el, index) => (
											<View
												key={index}
												className="flex-row gap-2 items-center "
											>
												<Image
													source={icons.hint}
													className="w-5 h-5"
													tintColor={"red"}
												/>
												<Text className="text-red-500">
													{el.longMessage}
												</Text>
											</View>
										))}
									</View>
								)}
								<View className="flex-row items-center justify-end w-[90%]">
									<Link
										href={"/(Auth)/forgot-password/screen"}
										className="group"
									>
										<Text className="text-accenttxt group-active:text-gray-400">
											Forgot Password?
										</Text>
									</Link>
								</View>
								<TouchableOpacity
									className="w-full items-center"
									activeOpacity={0.7}
									disabled={loading}
									onPress={() => {
										onSignInPress();
									}}
								>
									<Animated.View
										className={`w-[90%] h-[50px] flex-row items-center justify-center gap-2  ${
											loading
												? "bg-accentbg/60"
												: "bg-accentbg"
										} rounded-[10px]`}
									>
										{/* <ComicText text={"Log In"} style="text-white text-2xl" /> */}
										{loading ? (
											<Animated.View
												className={"animate-spin"}
											>
												<Image
													source={icons.spinner}
													className="w-8 h-8"
													tintColor={"white"}
												/>
											</Animated.View>
										) : (
											<Text className={`${darkTheme?"text-black":"text-white"} text-xl font-semibold`}>
												Log In
											</Text>
										)}
									</Animated.View>
								</TouchableOpacity>
								<View className="flex flex-row items-center gap-4 my-0">
									<View
										className={
											"border-b border-gray-400 w-[20%]"
										}
									></View>
									<Text className="text-gray-400">Or </Text>
									<View
										className={
											"border-b border-gray-400 w-[20%]"
										}
									></View>
								</View>
								<TouchableOpacity
									activeOpacity={0.7}
									onPress={() => {
										SignInWithGoogle();
									}}
								>
									<View
										className={`flex-row gap-4 w-[260px] h-[40px] rounded-[30px]  ${
											darkTheme ? "bg-slate-50/15" : "bg-slate-100"
										} shadow-2xl bg-slate-50/15 items-center justify-center`}
										style={{
											width: width * 0.6,
										}}
									>
										<Image
											source={images.google_logo}
											className="w-[30px] h-[30px] rounded-full"
										/>
										<ComicText
											text={"Sign in with Google"}
											style={
												darkTheme
													? "text-lg text-gray-300"
													: "text-lg"
											}
										/>
									</View>
								</TouchableOpacity>
							</View>
						</View>
						<View className="flex-row gap-2 items-center justify-center">
							<ComicText text={"Don't Have an Account?"} style={darkTheme?"text-white":""} />
							<TouchableOpacity
								onPress={() => {
									router.push("/(Auth)/sign-up/screen");
								}}
							>
								<View className="w-[50px] h-7 items-center justify-center">
									<ComicText
										text={"Sign Up"}
										style={
											"text-accenttxt group-active:text-gray-400"
										}
									/>
								</View>
							</TouchableOpacity>
						</View>
					</ScrollView>
				</KeyboardAvoidingView>

				<Modal visible={AuthLoading} backdropColor={"transparent"}>
					<View className="flex-1 items-center justify-center">
						<Animated.View className={"animate-spin"}>
							<Image
								source={icons.spinner}
								className="w-28 h-28"
								tintColor={"#d9a31b"}
							/>
						</Animated.View>
					</View>
				</Modal>

				{/* <Modal isVisible={ShowLocationPrompt}>
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
										<Text
											className={`text-white font-bold`}
										>
											Allow Location Access
										</Text>
									</View>
								</TouchableOpacity>
							</View>
						</View>
				</Modal> */}
			</View>
		</>
	);
}
