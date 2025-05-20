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
} from "react-native";
import React, {
	useCallback,
	useEffect,
	useLayoutEffect,
	useState,
} from "react";
import ComicText from "@/components/styled-components/custom-texts/ComicText";
import InputFeild from "@/components/ui/InputFeild";
import { Link, useRouter } from "expo-router";
import Button from "@/components/ui/Button";
import images from "@/constants/images/images";
import { LinearGradient } from "expo-linear-gradient";
import { isClerkAPIResponseError, useSignIn } from "@clerk/clerk-expo";
import icons from "@/constants/icons/icons";
import Animated from "react-native-reanimated";
import { useWarmUpBrowser } from "../_layout";
import { useSSO } from "@clerk/clerk-expo";
import * as AuthSession from "expo-auth-session";
import { ClerkAPIError } from "@clerk/types";
import Modal from "react-native-modal";

const { width, height } = Dimensions.get("window");

export default function SignIn() {
	// <-----------------------<HOOKES>------------------------>
	const { signIn, setActive, isLoaded } = useSignIn();
	const router = useRouter();
	const { startSSOFlow } = useSSO();

	// <-----------------------<STATES>------------------------>
	const [emailAddress, setEmailAddress] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [OAuthLoading, setOAuthLoading] = useState(false);
	const [errors, setErrors] = React.useState<ClerkAPIError[]>();

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
	// SIGN IN ATTEMPT
	const onSignInPress = async () => {
		setLoading(true);
		setErrors(undefined);
		if (!isLoaded) return;

		try {
			const signInAttempt = await signIn.create({
				identifier: emailAddress,
				password,
			});

			if (signInAttempt.status === "complete") {
				await setActive({ session: signInAttempt.createdSessionId });
				router.replace("/(screens)");
			} else {
				// If the status isn't complete, check why. User might need to
				// complete further steps.
				console.error(JSON.stringify(signInAttempt, null, 2));
			}
		} catch (err) {
			if (isClerkAPIResponseError(err)) setErrors(err.errors);
		} finally {
			setLoading(false);
		}
	};

	// OAUTH
	const SignInWithGoogle = useCallback(async () => {
		setOAuthLoading(true)
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
				setActive!({ session: createdSessionId }).then(() => {
					router.replace("/(screens)");
				});
			} else {
				// If there is no `createdSessionId`,
				// there are missing requirements, such as MFA
				// Use the `signIn` or `signUp` returned from `startSSOFlow`
				// to handle next steps
				signIn?.authenticateWithPopup
				setActive!({ session: createdSessionId }).then(() => {
					router.replace("/(screens)");
				});
			}
		} catch (err) {
			// See https://clerk.com/docs/custom-flows/error-handling
			// for more info on error handling
			console.error(JSON.stringify(err, null, 2));
		}finally{
			setOAuthLoading(false)
		}
	}, []);

	return (
		<>
			<StatusBar
				backgroundColor={"#00000000"}
				barStyle={"dark-content"}
			/>

			<View
				className="bg-primarybg"
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
								marginBottom: -(height * 0.1),
							}}
						>
							<LinearGradient
								className="w-full h-full "
								colors={["transparent", "#f0f0f0"]}
							></LinearGradient>
						</ImageBackground>
						<View className="w-full gap-3 px-6">
							<View className=" w-[90%] self-center">
								<ComicText
									text={"Sign In to Your Account"}
									style={"text-[30px] text-black"}
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
											<Text className="text-white text-xl font-semibold">
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
									<View className="flex-row gap-4 w-[260px] h-[40px] rounded-[30px] shadow-xl bg-slate-50 items-center justify-center">
										<Image
											source={require("../../../assets/images/google.png")}
											className="w-[40px] h-[40px] rounded-full"
										/>
										<ComicText
											text={"Sign in with Google"}
										/>
									</View>
								</TouchableOpacity>
							</View>
						</View>
						<View className="flex-row gap-2 items-center justify-center">
							<ComicText text={"Don't Have an Account?"} />
							<Link
								href={"/(Auth)/sign-up/screen"}
								className="group"
							>
								<View className="w-[50px] h-7 items-center justify-center">
									<ComicText
										text={"Sign Up"}
										style={
											"text-accenttxt group-active:text-gray-400"
										}
									/>
								</View>
							</Link>
						</View>
					</ScrollView>
				</KeyboardAvoidingView>

				<Modal isVisible={OAuthLoading}>
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

			</View>
		</>
	);
}
