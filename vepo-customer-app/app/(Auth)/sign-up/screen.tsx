// export const unstable_settings = {
//   animation: "slide_from_right", // Applies slide animation when navigating to this screen
// };

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
} from "react-native";
import React, { useState } from "react";
import ComicText from "@/components/styled-components/custom-texts/ComicText";
import InputFeild from "@/components/ui/InputFeild";
import { Link, useNavigation, useRouter } from "expo-router";
import images from "@/constants/images/images";
import { LinearGradient } from "expo-linear-gradient";

const {height } = Dimensions.get("window");

export default function SignUp() {
	// <--------------<hooks>---------------->
	const router = useRouter();
	// <--------------<STATES>---------------->
	const [name, setName] = React.useState("");
	const [emailAddress, setEmail] = React.useState("");
	const [password, setPassword] = React.useState("");
	const [confirmPassword, setConfirmPassword] = React.useState("");
	

		const statusBarHeight = StatusBar.currentHeight || 0;

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
									text={"Create An Account "}
									style={"text-[30px] text-black"}
								/>
							</View>
							<View className="py-[50px] gap-[20px] items-center">
								<InputFeild
									label={"Full Name"}
									type={"text"}
									placeholder={"Enter your full name"}
									set={(text: string) => {
										setName(text);
									}}
								/>
								<InputFeild
									label={"Email"}
									type={"email"}
									placeholder={"Enter your Email Address"}
									set={(text: string) => {
										setEmail(text);
									}}
								/>
								<InputFeild
									label={"Password"}
									type={"password"}
									placeholder={"Enter your Password"}
									set={(text: string) => {
										setPassword(text);
									}}
								/>
								<InputFeild
									label={"Confirm Password"}
									type={"password"}
									placeholder={"Confirm your Password"}
									set={(text: string) => {
										setConfirmPassword(text);
									}}
								/>
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
									onPress={() => {
										router.push("/(screens)");
									}}
								>
									<View className="w-[90%] h-[50px] items-center justify-center bg-accentbg rounded-[10px]">
										{/* <ComicText
											text={"Sign Up"}
											style="text-white text-2xl"
										/> */}
										<Text className="text-white text-2xl">
											Sign Up
										</Text>
									</View>
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
								<TouchableOpacity activeOpacity={0.7}>
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
							<ComicText text={"Already Have an Account?"} />
							<Link
								href={"/(Auth)/sign-in/screen"}
								className="group"
							>
								<View className="w-[40px] h-7 items-center justify-center">
									<ComicText
										text={"Login"}
										style={
											"text-accenttxt group-active:text-gray-400"
										}
									/>
								</View>
							</Link>
						</View>
					</ScrollView>
				</KeyboardAvoidingView>
			</View>
		</>
	);
}
