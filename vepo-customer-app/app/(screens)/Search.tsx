import {
	View,
	Text,
	StatusBar,
	TouchableOpacity,
	Image,
	ScrollView,
	StyleSheet,
} from "react-native";
import React, { useContext, useLayoutEffect, useState } from "react";
import BackButton from "@/components/ui/BackButton";
import { useRouter } from "expo-router";
import SearchBar from "@/components/common/Search";
import icons from "@/constants/icons/icons";
import ComicText from "@/components/styled-components/custom-texts/ComicText";
import { UIThemeContext } from "@/context/ThemeContext";
import BackButtonMinimal from "@/components/ui/BackButtonMinimal";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';


const Search = () => {
	// <--------------------<HOOKS>-------------------->
	const router = useRouter();
	const { currentTheme } = useContext(UIThemeContext);
	const darkTheme = currentTheme === "dark";

	// <--------------------<STATES>-------------------->
	const [search, setSearch] = useState("");
	// DUMMY DATA
	const vendors = [1, 2, 3, 4, 5, 6, 7];
	const location =
		"Lorem ipsum, dolor sit amet consectetur adipisicing elit. Magnam, voluptas nam. Tenetur, sapiente vero";

	// FUNCTIONS
	const handleSearch = () => {};

	useLayoutEffect(() => {}, []);
	return (
		<>
			<StatusBar
				translucent
				backgroundColor={darkTheme ? "black" : "white"}
				barStyle={darkTheme ? "light-content" : "dark-content"}
			/>
			<View
				className={`${darkTheme ? "bg-black" : "bg-white"} flex-1`}
				style={{
					paddingTop: StatusBar.currentHeight,
					flex: 1,
				}}
			>
				{/* <-----------------------------------<TOP SEARCH SECTION>-----------------------------------> */}
				<View className="flex-row justify-between  items-center w-full  h-[90px] gap-[10px] px-[15px] ">
					<TouchableOpacity
						className=""
						onPress={() => router.back()}
						activeOpacity={0.6}
					>
						<BackButtonMinimal />
					</TouchableOpacity>
					<SearchBar
						width={"w-[70%]"}
						height={"h-[40px]"}
						buttonStyle={""}
						setFunc={(value: string) => {
							setSearch(value);
						}}
					/>
					{/* <GooglePlacesAutocomplete
								placeholder='Search'
								onPress={(data, details = null) => {
									// 'details' is provided when fetchDetails = true
									console.log(data, details);
								}}
								query={{
									key: 'YOUR API KEY',
									language: 'en',
								}}
							/> */}
					<TouchableOpacity onPress={handleSearch}>
						<View
							className={`w-[40px] h-[40px] items-center justify-center ${
								darkTheme ? "bg-gray-200/20" : "bg-gray-200"
							} rounded-full`}
						>
							<Image
								source={icons.search}
								className="w-6 h-6"
								tintColor={darkTheme ? "white" : "black"}
							/>
						</View>
					</TouchableOpacity>
				</View>
				{/* <-----------------------<RESULTS SECTION>-----------------------> */}
				<View className="px-[10px] items-end py-3">
					<Text>
						<ComicText
							text={`Search Results  (${"25"})`}
							style={darkTheme ? "text-white" : "text-black"}
						/>
					</Text>
				</View>
				{/* <----------------------<SCROLLABLE SECTION>----------------------> */}
				<ScrollView
					className=""
					showsVerticalScrollIndicator={true}
					contentContainerStyle={{
						gap: 10,
						paddingHorizontal: 10,
					}}
				>
					<View className="py-3">
						{vendors.map((index) => {
							return (
								<TouchableOpacity
									activeOpacity={0.6}
									key={index}
									onPress={() => {
										router.push("/(screens)/vendor/[2]");
									}}
								>
									<View
										className={`flex-row w-full gap-[20px] border-b ${
											darkTheme
												? ""
												: "border-gray-100"
										} py-4`}
									>
										<Image
											source={require("../../assets/prop-images/dasani.png")}
											className="w-[40px] h-[40px] rounded-full "
										/>
										<View className="gap-1 ">
											<ComicText
												text={`${"dasani refill shop"}`}
												style={
													darkTheme
														? "text-gray-100"
														: "text-gray-700"
												}
											/>
											<View className="flex-row gap-2">
												<View className="pl-[0px]">
													<Image
														source={icons.location}
														className="w-5 h-5"
														tintColor={
															darkTheme
																? "white"
																: "black"
														}
													/>
												</View>
												<ComicText
													text={`Location: ${
														location.length > 40
															? location
																	.substring(
																		0,
																		40
																	)
																	.trim() +
															"..."
															: location
													}`}
													style={
														darkTheme
															? "text-gray-300"
															: "text-gray-500"
													}
												/>
											</View>
										</View>
									</View>
								</TouchableOpacity>
							);
						})}
						<View className="px-2 py-2">
							<Text>
								<ComicText text={"Areas on the map"} />
							</Text>
						</View>
						<View className="gap-4">
							{vendors.map((index) => {
								return (
									<View
										key={index}
										className="flex-row items-center px-5 justify-between"
									>
										<ComicText
											text={`Location: ${
												location.length > 45
													? location
															.substring(0, 45)
															.trim() + "..."
													: location
											}`}
											style={darkTheme? "text-gray-300":"text-gray-500"}
										/>
										<View className={`ml-2 p-2 ${darkTheme ? "bg-gray-200/20":"bg-gray-200"} rounded-full`}>
											<Image
												source={icons.location}
												className="w-6 h-6 "
												tintColor={darkTheme? "white":"black"}
											/>
										</View>
									</View>
								);
							})}
						</View>
					</View>
				</ScrollView>
			</View>
		</>
	);
};

export default Search;


const styles = StyleSheet.create({
  autocompleteContainer: {
    flex: 1,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 1
  }
});