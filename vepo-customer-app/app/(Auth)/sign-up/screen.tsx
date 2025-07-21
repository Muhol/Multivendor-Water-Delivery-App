import {
	View,
	Text,
	Image,
	ScrollView,
	TouchableOpacity,
	KeyboardAvoidingView,
	ImageBackground,
	Dimensions,
	StatusBar,
	Modal,
} from "react-native";
import React, { useCallback, useContext, useEffect, useState } from "react";
import ComicText from "@/components/styled-components/custom-texts/ComicText";
import InputFeild from "@/components/ui/InputFeild";
import { Link, useRouter } from "expo-router";
import images from "@/constants/images/images";
import { LinearGradient } from "expo-linear-gradient";
import { isClerkAPIResponseError, useSSO, useSignUp, useUser } from "@clerk/clerk-expo";
// import Modal from "react-native-modal";
import icons from "@/constants/icons/icons";
import { OtpInput } from "react-native-otp-entry";
import Button from "@/components/ui/Button";
import * as AuthSession from "expo-auth-session";
import Animated from "react-native-reanimated";
import { ClerkAPIError } from "@clerk/types";
import { UIThemeContext } from "@/context/ThemeContext";
import ApiRoutes from "@/API/routes/ApiRoutes";

const { height } = Dimensions.get("window");

export default function SignUp() {
	// <--------------------------<HOOKES>---------------------------->
	const router = useRouter();
	const { isLoaded, signUp, setActive } = useSignUp();
	const { startSSOFlow } = useSSO();
	const { currentTheme } = useContext(UIThemeContext);
	const darkTheme = currentTheme === "dark";

	// <--------------------------<STATES>---------------------------->
	const [emailAddress, setEmail] = React.useState("");
	const [fullname, setFullname] = React.useState("");
	const [phoneNumber, setPhoneNumber] = React.useState("");
	const [profilePic, setProfilePic] = React.useState("");
	const [password, setPassword] = React.useState("");
	const [confirmPassword, setConfirmPassword] = React.useState("");
	const [verification, setVerification] = useState("default"); // pending , success
	const [code, setCode] = React.useState("");
	const [errors, setErrors] = React.useState<ClerkAPIError[]>();
	const [loading, setLoading] = useState(false);
	const [OAuthLoading, setOAuthLoading] = useState(false);

	useEffect(() => {
		const resetError = () => {
			setErrors(undefined);
		};
		resetError();
	}, []);

	// <-------------------------<VARIABLES>-------------------------->
	const statusBarHeight = StatusBar.currentHeight || 0;

	// <-------------------------<FUNCTIONS>-------------------------->
	// Confirm if password and confirm password are the same
	const checkPassword = () => {
		if (password === confirmPassword) {
			return true;
		} else {
			return false;
		}
	};

	// API CALLS
	// const create_new_database_user = async ( clerk_id: string, full_name?:string, email?: string, phone_number?: string, profile_pic?: string) => {
	// 	const payload = {
	// 		clerk_id,
	// 		full_name: fullname,
	// 		email: emailAddress,
	// 		phone_number: phoneNumber,
	// 		profile_pic: profilePic
	// 	}
	// 	try {
	// 		const apiCall = await fetch(ApiRoutes.CreateNewUser.path, {
	// 			method: ApiRoutes.CreateNewUser.method,
	// 			headers: {
	// 				"Content-Type" : "Application/json"
	// 			},
	// 			body: JSON.stringify(payload)
	// 		})
	// 		const response = await apiCall.json()
	// 	} catch (error) {
	// 	}
	// }

	const onSignUpPress = async () => {
		setLoading(true);
		setErrors(undefined);

		if (!isLoaded) return;
		checkPassword();
		if (!checkPassword()) {
			return;
		}

		// Start sign-up process using email and password provided
		try {
			await signUp.create({
				emailAddress,
				password,
			});
			// <-----------------CREATE USER ON THE DATABASE----------------->

			// Send user an email with verification code
			await signUp.prepareEmailAddressVerification({
				strategy: "email_code",
			});

			// Set 'pendingVerification' to true to display second form
			// and capture OTP code
			setVerification("pending");
		} catch (err) {
			// See https://clerk.com/docs/custom-flows/error-handling
			// for more info on error handling
			if (isClerkAPIResponseError(err)) setErrors(err.errors);
		} finally {
			setLoading(false);
		}
	};

	const onVerifyPress = async () => {
		let success = false
		if (!isLoaded) return;

		try {
			// Use the code the user provided to attempt verification
			const signUpAttempt = await signUp.attemptEmailAddressVerification({
				code,
			});

			// If verification was completed, set the session to active
			// and redirect the user
			if (signUpAttempt.status === "complete") {
				setVerification("success");
				const clerkId = signUpAttempt?.createdUserId
				if(clerkId === null) {
					return
				}
				// create_new_database_user(clerkId)
				await setActive({ session: signUpAttempt.createdSessionId });
				success = true
				// router.replace("/(screens)");
			} else {
				// If the status is not complete, check why. User may need to
				// complete further steps.
				success = false
			}
		} catch (err) {
			// See https://clerk.com/docs/custom-flows/error-handling
			// for more info on error handling
			// console.error(JSON.stringify(err, null, 2));
			success = false
		}finally{
			if (success){
				setOAuthLoading(true)
			}
		}
	};

	// OAuth
	const SignInWithGoogle = useCallback(async () => {
		let success = false
		setOAuthLoading(true);
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
						path: "(Auth)/sign-up/screen",
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
				signUp?.authenticateWithPopup;
				setActive!({ session: createdSessionId })
				success = true
			}
		} catch (err) {
			// See https://clerk.com/docs/custom-flows/error-handling
			// for more info on error handling
			// console.error(JSON.stringify(err, null, 2));
			success = false
			// setError()
		} finally {
			if(success === false){
				setOAuthLoading(false);
			}
		}
	}, []);

	return (
		<>
			<StatusBar
				backgroundColor={"#00000000"}
				barStyle={darkTheme?"light-content":"dark-content"}
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
						className="flex-1 w-full"
						overScrollMode="never"
						showsVerticalScrollIndicator={false}
						contentContainerStyle={{
							paddingBottom: 100,
						}}
					>
						<ImageBackground
							source={images.authBgLight}
							style={{
								height: height * 0.32,
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
									text={"Create An Account "}
									style={darkTheme?"text-[30px] text-white":"text-[30px] text-black"}
								/>
							</View>
							<View className="py-[50px] gap-[20px] items-center">
								{/* <InputFeild
									label={"Full Name"}
									type={"text"}
									placeholder={"Enter your full name"}
									set={(text: string) => {
										setName(text);
									}}
								/> */}
								<InputFeild
									label={"Email"}
									type={"email"}
									placeholder={"Enter your Email Address"}
									iconleft={icons.mail}
									set={(text: string) => {
										setEmail(text);
									}}
								/>
								<InputFeild
									label={"Password"}
									type={"password"}
									placeholder={"Enter your Password"}
									iconleft={icons.password}
									set={(text: string) => {
										setPassword(text);
									}}
								/>
								<InputFeild
									label={"Confirm Password"}
									type={"password"}
									placeholder={"Confirm your Password"}
									iconleft={icons.password}
									set={(text: string) => {
										setConfirmPassword(text);
									}}
								/>
								{errors && (
									<View className="w-[90%] gap-2">
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
								{/* <View className="flex-row items-center justify-end w-[90%]">
									<Link
										href={"/(Auth)/forgot-password/screen"}
										className="group"
									>
										<Text className="text-accenttxt group-active:text-gray-400">
											Forgot Password?
										</Text>
									</Link>
								</View> */}
								<TouchableOpacity
									className="w-full items-center mt-4"
									activeOpacity={0.7}
									disabled={loading}
									onPress={() => {
										onSignUpPress();
									}}
								>
									<Animated.View
										className={`w-[90%] max-w-[320px] h-[45px] flex-row items-center justify-center gap-2 ${
											loading
												? "bg-accentbg/60"
												: "bg-accentbg"
										} rounded-full`}
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
												Sign Up
											</Text>
										)}
									</Animated.View>
								</TouchableOpacity>
								<View className="flex flex-row items-center gap-4 my-0">
									<View
										className={
											"border-b border-gray-400 w-[20%]"
										}
									/>
									<Text className="text-gray-400">Or </Text>
									<View
										className={
											"border-b border-gray-400 w-[20%]"
										}
									/>
								</View>
								<TouchableOpacity
									activeOpacity={0.7}
									onPress={() => {
										SignInWithGoogle();
									}}
								>
									{/* <View className="flex-row gap-4 w-[260px] h-[40px] rounded-[30px] shadow-xl bg-slate-50 items-center justify-center">
										<Image
											source={require("../../../assets/images/google.png")}
											className="w-[40px] h-[40px] rounded-full"
										/>
										<ComicText
											text={"Sign in with Google"}
										/>
									</View> */}
									<View
										className={`flex-row gap-4 w-[260px] h-[40px] rounded-[30px]  ${
											darkTheme ? "bg-slate-50/15" : "bg-white"
										} shadow-2xl bg-slate-50/15 items-center justify-center`}
										
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
							<ComicText text={"Already Have an Account?"} style={darkTheme?"text-white":""}/>
							<TouchableOpacity
								// href={"/(Auth)/sign-in/screen"}
								onPress={() => {
									router.push("/(Auth)/sign-in/screen");
								}}
							>
								<View className="w-[40px] h-7 items-center justify-center">
									<ComicText
										text={"Login"}
										style={
											"text-accenttxt group-active:text-gray-400"
										}
									/>
								</View>
							</TouchableOpacity>
						</View>
					</ScrollView>
				</KeyboardAvoidingView>

				<Modal backdropColor={"transparent"} visible={OAuthLoading}>
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

				<Modal backdropColor={"transparent"} visible={verification === "pending"}>
					<View className={`flex-1 items-center justify-center`}>
						<View className="bg-white p-[15px] rounded-3xl items-center gap-3 ">
							<View className="h-[160px] w-[160px] items-center justify-center bg-accentbg rounded-full shadow-xl ">
								<Image
									source={icons.verify_email}
									className="w-[100px] h-[100px]"
									tintColor={"white"}
								/>
							</View>

							<View className="w-full items-center gap-2">
								<Text className="font-bold text-2xl ">
									Verify Your Email Address
								</Text>
								<ComicText
									text={
										"Your Verification Code is sent via your email"
									}
								/>
							</View>

							<View className="w-full items-center flex-row gap-1 justify-center">
								{/* <Text className="font-bold text-2xl ">Verify Your Email Address</Text> */}
								<ComicText text={"Didn't get the code?"} />
								<TouchableOpacity
									activeOpacity={0.7}
									onPress={() => {}}
								>
									<View className=" h-[30px] px-2 items-center justify-center ">
										<ComicText
											text={"Resend"}
											style={"text-accentbg"}
										/>
									</View>
								</TouchableOpacity>
							</View>

							<View className=" py-3 px-4  flex-row gap-3  rounded-2xl items-center">
								<OtpInput
									numberOfDigits={6}
									focusColor="#d9a31b"
									autoFocus={false}
									hideStick={true}
									placeholder="******"
									blurOnFilled={true}
									disabled={false}
									type="numeric"
									secureTextEntry={false}
									focusStickBlinkingDuration={500}
									onFocus={() => {}}
									onBlur={() => {}}
									onTextChange={(text) => setCode(text)}
									onFilled={() =>
										// onVerifyPress()
										{}
									}
									textInputProps={{
										accessibilityLabel: "One-Time Password",
									}}
									textProps={{
										accessibilityRole: "text",
										accessibilityLabel: "OTP digit",
										allowFontScaling: false,
									}}
								/>
							</View>

							<TouchableOpacity
								activeOpacity={0.7}
								onPress={() => {
									onVerifyPress();
								}}
							>
								<View>
									<Button
										style={"rounded-xl px-[30px]"}
										label={"Verify"}
										textStyle="text-xl"
									/>
								</View>
							</TouchableOpacity>
						</View>
					</View>
				</Modal>

				<Modal backdropColor={"transparent"} visible={verification === "success"}>
					<View className={`flex-1 items-center justify-center`}>
						<View className="bg-white p-[15px] rounded-3xl items-center gap-3 ">
							<View className="h-[160px] w-[160px] items-center justify-center bg-green-500 rounded-full shadow-xl ">
								<Image
									source={icons.verified}
									className="w-[100px] h-[100px]"
									tintColor={"white"}
								/>
							</View>

							<View className="w-full items-center gap-2">
								<Text className="font-bold text-2xl ">
									Verified
								</Text>
								<Text className="text-gray-500 ">
									Your email address has been verified
									successfully
								</Text>
							</View>
						</View>
					</View>
				</Modal>
			</View>
		</>
	);
}
