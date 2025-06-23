import {
	View,
	Text,
	StatusBar,
	ScrollView,
	Image,
	TouchableOpacity,
	TouchableWithoutFeedback,
	Dimensions,
} from "react-native";
import React, { useContext, useRef, useState } from "react";
import ComicText from "@/components/styled-components/custom-texts/ComicText";
import icons from "@/constants/icons/icons";
import images from "@/constants/images/images";
import Button from "@/components/ui/Button";
import { useRouter } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BottomSheet, {
	BottomSheetScrollView,
	BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useClerk, useUser } from "@clerk/clerk-expo";
import * as Linking from "expo-linking";
import { UIThemeContext } from "@/context/ThemeContext";
import BackButtonMinimal from "@/components/ui/BackButtonMinimal";
import * as ImagePicker from "expo-image-picker";
import CloudinaryUpload from "@/Helpers/imageUpload";

const { width, height } = Dimensions.get("window");

const Profile = () => {
	// <------------------------------HOOKES------------------------------>
	const router = useRouter();
	const { signOut } = useClerk();
	const user = useUser();
	const { setTheme } = useContext(UIThemeContext);

	// <------------------------------STATES------------------------------>
	const [bottomSheetData, setBottomSheetData] = useState(""); //[ favourites , privacy , settings, help ]
	const [displayTopBar, setDisplayTopBar] = useState(true); //[ favourites , privacy , settings, help ]
	const [image, setImage] = useState<string | undefined>();
	const { currentTheme } = useContext(UIThemeContext);
	const darkTheme = currentTheme === "dark";

	// <------------------------------VARIABLES------------------------------>

	// <------------------------------FUNSTIONS------------------------------>
	// BOTTOM SHEET
	const bottomSheetRef = useRef<BottomSheet>(null);
	const handleClosePress = () => {
		bottomSheetRef.current?.close();
		setDisplayTopBar(true);
	};
	const handleExpandPress = () => {
		setDisplayTopBar(false);
		bottomSheetRef.current?.expand();
	};

	// LOGOUT
	const handleSignOut = async () => {
		try {
			await signOut();
			// Redirect to your desired page
			Linking.openURL(Linking.createURL("/(Auth)"));
		} catch (err) {
			// See https://clerk.com/docs/custom-flows/error-handling
			// for more info on error handling
			console.error(JSON.stringify(err, null, 2));
		}
	};

	// picking file from device storage
	const pickFile = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ["images", "videos"],
			allowsEditing: true,
			// aspect: [4, 3],
			quality: 1,
		});
		if (result.canceled) {
			return;
		}
		const uploadedImageData = await CloudinaryUpload(
			result?.assets[0].uri,
			result?.assets[0].fileName
		);
		setImage(uploadedImageData.url);
		console.log(uploadedImageData.url)
	};

	return (
		<>
			<StatusBar
				backgroundColor={"transparent"}
				barStyle={darkTheme ? "light-content" : "dark-content"}
			/>
			<GestureHandlerRootView
				style={{
					flex: 1,
					backgroundColor: darkTheme ? "black" : "white",
				}}
			>
				<View
					className="flex-1 "
					style={{
						marginTop: StatusBar.currentHeight,
					}}
				>
					{/* <-------------TOP_BAR-------------> */}
					<View
						className=" absolute flex-row items-center w-full h-[70px] px-5 justify-between"
						style={[displayTopBar && { zIndex: 20 }]}
					>
						{/* BACK BUTTON */}
						<TouchableOpacity
							activeOpacity={0.7}
							onPress={() => {
								router.back();
							}}
						>
							<BackButtonMinimal />
						</TouchableOpacity>
						{/* THEME TOGGLE BUTTON */}
						<TouchableOpacity
							activeOpacity={0.7}
							onPress={() => {
								setTheme();
							}}
						>
							<View className="w-10 h-10 items-center justify-center">
								{!darkTheme ? (
									<Image
										source={icons.moon}
										className="w-7 h-7"
										tintColor={
											darkTheme ? "white" : "black"
										}
									/>
								) : (
									<Image
										source={icons.sun}
										className="w-7 h-7"
										tintColor={
											darkTheme ? "white" : "black"
										}
									/>
								)}
							</View>
						</TouchableOpacity>
					</View>

					<ScrollView
						className=" rounded-xl flex-1"
						contentContainerStyle={{
							alignItems: "center",
							gap: 20,
							paddingVertical: 70,
						}}
						showsVerticalScrollIndicator={false}
						overScrollMode="never"
					>
						{/* <-------PROFILE DETAILS: [ PROFILE_PIC , USERNAME , EMAIL , EDIT_PROFILE_BUTTON ]-------> */}
						<View className="w-full items-center pt-3 pb-5 gap-2">
							{/* PROFILE_PIC */}
							<View className="h-[150px] w-[150px]">
								<Image
									source={image || images.profile_placeholder}
									className={`w-full h-full rounded-full `}
									tintColor={darkTheme ? "dimgray" : "gray"}
								/>
							</View>
							{/* USERNAME , EMAIL */}
							<View className="w-full items-center py-2 ">
								<ComicText
									text={`${"Ian Mohol"}`}
									style={
										darkTheme
											? "text-xl text-white"
											: "text-xl"
									}
								/>
								<ComicText
									text={`${"ianmohol@gmail.com"}`}
									style={
										darkTheme
											? "text-gray-200"
											: "text-gray-400"
									}
								/>
							</View>
							{/* EDIT_PROFILE_BUTTON */}
							<TouchableOpacity
								activeOpacity={0.7}
								onPress={() => {
									setBottomSheetData("edit-profile");
									handleExpandPress();
								}}
							>
								<Button
									style={" px-5 py-2 rounded-xl"}
									textStyle={
										darkTheme ? "text-black" : "text-white"
									}
									label={"Edit profile"}
								/>
							</TouchableOpacity>
						</View>
						{/* <-------MENU BUTTONS: [FAVOURITES , PRIVACY , SETTINGS ,HELP & SUPPORT , LOGOUT ]-------> */}
						{/* FAVOURITES */}
						<TouchableOpacity
							activeOpacity={0.7}
							onPress={() => {
								setBottomSheetData("favourites");
								handleExpandPress();
							}}
						>
							<View
								className={`${
									darkTheme ? "bg-gray-200/15" : "bg-gray-100"
								} py-3 px-5 w-[90%] rounded-full flex-row items-center gap-3`}
							>
								<View className="w-9 h-9 items-center justify-center">
									<Image
										source={icons.like}
										className="w-7 h-7"
										tintColor={
											darkTheme ? "white" : "black"
										}
									/>
								</View>
								<View className="flex-1">
									<ComicText
										text={"Favourites"}
										style={
											darkTheme
												? "text-lg text-white"
												: " text-lg"
										}
									/>
								</View>
								<View className="w-9 h-9 items-center justify-center ">
									<Image
										source={icons.right}
										className="w-7 h-7"
										tintColor={
											darkTheme ? "white" : "black"
										}
									/>
								</View>
							</View>
						</TouchableOpacity>
						{/* NOTIFICATIONS */}
						<TouchableOpacity
							activeOpacity={0.7}
							onPress={() => {
								setBottomSheetData("");
								handleExpandPress();
							}}
						>
							<View
								className={`${
									darkTheme ? "bg-gray-200/15" : "bg-gray-100"
								} py-3 px-5 w-[90%] rounded-full flex-row items-center gap-3`}
							>
								<View className="w-9 h-9 items-center justify-center">
									<Image
										source={icons.notifications}
										className="w-7 h-7"
										tintColor={
											darkTheme ? "white" : "black"
										}
									/>
								</View>
								<View className="flex-1">
									<ComicText
										text={"Notifications"}
										style={
											darkTheme
												? "text-lg text-white"
												: " text-lg"
										}
									/>
								</View>
								<View className="w-9 h-9 items-center justify-center ">
									<Image
										source={icons.right}
										className="w-7 h-7"
										tintColor={
											darkTheme ? "white" : "black"
										}
									/>
								</View>
							</View>
						</TouchableOpacity>
						{/* PRIVACY */}
						<TouchableOpacity
							activeOpacity={0.7}
							onPress={() => {
								setBottomSheetData("privacy");
							}}
						>
							<View
								className={`${
									darkTheme ? "bg-gray-200/15" : "bg-gray-100"
								} py-3 px-5 w-[90%] rounded-full flex-row items-center gap-3`}
							>
								<View className="w-9 h-9 items-center justify-center">
									<Image
										source={icons.lock}
										className="w-7 h-7"
										tintColor={
											darkTheme ? "white" : "black"
										}
									/>
								</View>
								<View className="flex-1">
									<ComicText
										text={"Privacy"}
										style={
											darkTheme
												? "text-lg text-white"
												: " text-lg"
										}
									/>
								</View>
								<View className="w-9 h-9 items-center justify-center ">
									<Image
										source={icons.right}
										className="w-7 h-7"
										tintColor={
											darkTheme ? "white" : "black"
										}
									/>
								</View>
							</View>
						</TouchableOpacity>
						{/* SETTINGS */}
						<TouchableOpacity
							activeOpacity={0.7}
							onPress={() => {
								setBottomSheetData("settings");
							}}
						>
							<View
								className={`${
									darkTheme ? "bg-gray-200/15" : "bg-gray-100"
								} py-3 px-5 w-[90%] rounded-full flex-row items-center gap-3`}
							>
								<View className="w-9 h-9 items-center justify-center">
									<Image
										source={icons.settings}
										className="w-7 h-7"
										tintColor={
											darkTheme ? "white" : "black"
										}
									/>
								</View>
								<View className="flex-1">
									<ComicText
										text={"Settings"}
										style={
											darkTheme
												? "text-lg text-white"
												: " text-lg"
										}
									/>
								</View>
								<View className="w-9 h-9 items-center justify-center ">
									<Image
										source={icons.right}
										className="w-7 h-7"
										tintColor={
											darkTheme ? "white" : "black"
										}
									/>
								</View>
							</View>
						</TouchableOpacity>
						{/* HELP & SUPPORT */}
						<TouchableOpacity
							activeOpacity={0.7}
							onPress={() => {
								setBottomSheetData("help");
							}}
						>
							<View
								className={`${
									darkTheme ? "bg-gray-200/15" : "bg-gray-100"
								} py-3 px-5 w-[90%] rounded-full flex-row items-center gap-3`}
							>
								<View className="w-9 h-9 items-center justify-center">
									<Image
										source={icons.help}
										className="w-7 h-7"
										tintColor={
											darkTheme ? "white" : "black"
										}
									/>
								</View>
								<View className="flex-1">
									<ComicText
										text={"Help & Support"}
										style={
											darkTheme
												? "text-lg text-white"
												: " text-lg"
										}
									/>
								</View>
								<View className="w-9 h-9 items-center justify-center ">
									<Image
										source={icons.right}
										className="w-7 h-7"
										tintColor={
											darkTheme ? "white" : "black"
										}
									/>
								</View>
							</View>
						</TouchableOpacity>
						{/* LOGOUT */}
						<TouchableOpacity
							activeOpacity={0.7}
							onPress={handleSignOut}
						>
							<View
								className={`${
									darkTheme ? "bg-gray-200/15" : "bg-gray-100"
								} py-3 px-5 w-[90%] rounded-full flex-row items-center gap-3`}
							>
								<View className="w-9 h-9 items-center justify-center">
									<Image
										source={icons.logout}
										className="w-7 h-7"
										tintColor={
											darkTheme ? "white" : "black"
										}
									/>
								</View>
								<View className="flex-1">
									<ComicText
										text={"Logout"}
										style={
											darkTheme
												? "text-lg text-white"
												: "text-lg"
										}
									/>
								</View>
							</View>
						</TouchableOpacity>
					</ScrollView>
				</View>
				<BottomSheet
					ref={bottomSheetRef}
					index={-1}
					snapPoints={["100%"]}
					enableDynamicSizing={false}
					enableOverDrag={false}
					handleStyle={{
						display: "none",
					}}
				>
					<BottomSheetView
						style={{
							flexGrow: 1,
							zIndex: 30,
						}}
					>
						{/* <ImageBackground
								source={images.bg1light}
								style={{
									flex: 1,
								}}
							> */}
						<View
							className={`flex-1 w-full ${
								darkTheme ? "bg-black" : "bg-white"
							}`}
							style={{
								paddingTop: StatusBar.currentHeight,
							}}
						>
							{/* TOP_BAR */}
							<View className=" bg-blac py-6 flex-row justify-between items-center gap-[30px] px-5 ">
								{/* CLOSE BOTTOMSHEET */}
								<TouchableOpacity
									activeOpacity={0.7}
									onPress={() => {
										handleClosePress();
									}}
								>
									<View className="w-[42px] h-[40px] items-center justify-center rounded-2xl">
										<Image
											source={icons.downArrow}
											className="w-9 h-9"
											tintColor={
												darkTheme ? "white" : "black"
											}
										/>
									</View>
								</TouchableOpacity>

								{/* SAVE BUTTON */}
								<TouchableOpacity
									activeOpacity={0.6}
									onPress={() => {}}
								>
									<View className=" px-6 py-2 bg-accentbg rounded-2xl shadow-2xl shadow-black">
										<ComicText
											text={"Save"}
											style={
												darkTheme
													? "text-lg text-black"
													: "text-lg text-white"
											}
										/>
									</View>
								</TouchableOpacity>
							</View>
							{bottomSheetData === "edit-profile" && (
								<View className="w-full flex-1 items-center pt-3 pb-5 gap-2">
									{/* PROFILE_PIC */}
									<View className="h-[170px] w-[170px] ">
										<Image
											source={{uri: user.user?.hasImage? user.user.imageUrl : image }} 
											className="w-full h-full z-0 rounded-full"
										/>
										{/* <------EDIT BUTTON------> */}
										<TouchableOpacity
											className="absolute bottom-0 right-0 "
											activeOpacity={0.7}
											onPress={pickFile}
										>
											<View className="bg-accenttxt p-3 rounded-full">
												<Image
													source={icons.edit}
													className="w-6 h-6"
													tintColor={"black"}
												/>
											</View>
										</TouchableOpacity>
									</View>
									<View
										className={`w-full flex-1 mt-5 ${
											darkTheme
												? "bg-gray-200/20"
												: "bg-white"
										} `}
									>
										<BottomSheetScrollView
											contentContainerStyle={{
												flexGrow: 1,
												width: width,
												paddingHorizontal: 20,
												paddingVertical: 50,
											}}
											showsVerticalScrollIndicator={false}
											scrollEnabled={true}
										>
											<TouchableWithoutFeedback>
												<View>
													<ComicText
														text={
															"Personal Infomation:"
														}
														style={
															darkTheme
																? "text-xl text-white"
																: "text-xl"
														}
													/>
													{/* Name */}
													<TouchableOpacity
														activeOpacity={0.6}
													>
														<View
															className={`flex-row items-center justify-between border-b ${
																darkTheme
																	? "border-gray-300/20"
																	: "border-gray-200"
															} py-6`}
														>
															<View className="gap-2">
																<Text
																	className={`font-semibold text-xl ${
																		darkTheme
																			? "text-gray-200"
																			: "text-gray-700"
																	}`}
																>
																	Name
																</Text>
																<ComicText
																	text={
																		"Ian Mohol"
																	}
																	style={
																		" text-gray-500"
																	}
																/>
															</View>
															<View>
																<Image
																	source={
																		icons.right
																	}
																	tintColor={
																		"darkgray"
																	}
																	className="w-7 h-7"
																/>
															</View>
														</View>
													</TouchableOpacity>

													{/* Email */}
													<TouchableOpacity
														activeOpacity={0.6}
													>
														<View
															className={`flex-row items-center justify-between border-b ${
																darkTheme
																	? "border-gray-300/20"
																	: "border-gray-200"
															} py-6`}
														>
															<View className="gap-2">
																<Text
																	className={`font-semibold ${
																		darkTheme
																			? "text-gray-200"
																			: "text-gray-700"
																	}`}
																>
																	Email
																</Text>
																<ComicText
																	text={`${"ianmohol@gmail.com"}`}
																	style={
																		" text-gray-500"
																	}
																/>
															</View>
															<View>
																<Image
																	source={
																		icons.right
																	}
																	tintColor={
																		"darkgray"
																	}
																	className="w-7 h-7"
																/>
															</View>
														</View>
													</TouchableOpacity>

													{/* Phone No */}
													<TouchableOpacity
														activeOpacity={0.6}
													>
														<View
															className={`flex-row items-center justify-between border-b ${
																darkTheme
																	? "border-gray-300/20"
																	: "border-gray-200"
															} py-6`}
														>
															<View className="gap-2">
																<Text
																	className={`font-semibold ${
																		darkTheme
																			? "text-gray-200"
																			: "text-gray-700"
																	}`}
																>
																	Phone No
																</Text>
																<ComicText
																	text={`${"0727402842"}`}
																	style={
																		" text-gray-500"
																	}
																/>
															</View>
															<View>
																<Image
																	source={
																		icons.right
																	}
																	tintColor={
																		"darkgray"
																	}
																	className="w-7 h-7"
																/>
															</View>
														</View>
													</TouchableOpacity>

													{/* Address */}
													<TouchableOpacity
														activeOpacity={0.6}
													>
														<View
															className={`flex-row items-center justify-between border-b ${
																darkTheme
																	? "border-gray-300/20"
																	: "border-gray-200"
															} py-6`}
														>
															<View className="gap-2">
																<Text
																	className={`font-semibold ${
																		darkTheme
																			? "text-gray-200"
																			: "text-gray-700"
																	}`}
																>
																	Default
																	Delivery
																	Address
																</Text>
																<ComicText
																	text={`${"Ngong Memusi Navara Bungalows"}`}
																	style={
																		" text-gray-500"
																	}
																/>
															</View>
															<View>
																<Image
																	source={
																		icons.right
																	}
																	tintColor={
																		"darkgray"
																	}
																	className="w-7 h-7"
																/>
															</View>
														</View>
													</TouchableOpacity>

													{/* Password */}
													<TouchableOpacity
														activeOpacity={0.6}
													>
														<View
															className={`flex-row items-center justify-between border-b ${
																darkTheme
																	? "border-gray-300/20"
																	: "border-gray-200"
															} py-6`}
														>
															<View className="gap-2">
																<Text
																	className={`font-semibold ${
																		darkTheme
																			? "text-gray-200"
																			: "text-gray-700"
																	}`}
																>
																	Password
																</Text>
																<ComicText
																	text={`${"Change Password"}`}
																	style={
																		" text-gray-500"
																	}
																/>
															</View>
															<View>
																<Image
																	source={
																		icons.right
																	}
																	tintColor={
																		"darkgray"
																	}
																	className="w-7 h-7"
																/>
															</View>
														</View>
													</TouchableOpacity>

													{/* Payment Method */}
													<TouchableOpacity
														activeOpacity={0.6}
													>
														<View
															className={`flex-row items-center justify-between border-b ${
																darkTheme
																	? "border-gray-300/20"
																	: "border-gray-200"
															} py-6`}
														>
															<View className="gap-2">
																<Text
																	className={`font-semibold ${
																		darkTheme
																			? "text-gray-200"
																			: "text-gray-700"
																	}`}
																>
																	Payment
																	Method
																</Text>
																<ComicText
																	text={`${"Add payment method"}`}
																	style={
																		" text-gray-500"
																	}
																/>
															</View>
															<View>
																<Image
																	source={
																		icons.right
																	}
																	tintColor={
																		"darkgray"
																	}
																	className="w-7 h-7"
																/>
															</View>
														</View>
													</TouchableOpacity>
												</View>
											</TouchableWithoutFeedback>
										</BottomSheetScrollView>
									</View>
								</View>
							)}
						</View>
						{/* </ImageBackground> */}
					</BottomSheetView>
				</BottomSheet>
			</GestureHandlerRootView>
			{/* </ImageBackground> */}
		</>
	);
};

export default Profile;
