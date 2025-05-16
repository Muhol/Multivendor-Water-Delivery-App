// export const unstable_settings = {
//   animation: "slide_from_right",
// };

import {
	View,
	Text,
	Image,
	ScrollView,
	Dimensions,
	TouchableOpacity,
	StatusBar,
	ImageBackground,
} from "react-native";
import React from "react";
//   import { StatusBar } from "expo-status-bar";
import BackButton from "@/components/ui/BackButton";
import ComicText from "@/components/styled-components/custom-texts/ComicText";
import GroupedCartItems from "@/components/common/GroupedCartItems";
import Button from "@/components/ui/Button";
import { useRouter } from "expo-router";
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import icons from "@/constants/icons/icons";

const { width, height } = Dimensions.get("screen");

export default function Cart() {
	const router = useRouter();

	// Reanimated blur value
	const blurOpacity = useSharedValue(0.0);

	// Animated style for darken the overlay
	const blurStyle = useAnimatedStyle(() => {
		return {
			opacity: blurOpacity.value,
		};
	});
	const handleScroll = (event: {
		nativeEvent: { contentOffset: { y: any } };
	}) => {
		const yOffset = event.nativeEvent.contentOffset.y;
		if (yOffset >= 30) {
			blurOpacity.value = withTiming(1, { duration: 300 });
		} else {
			blurOpacity.value = withTiming(0.0, { duration: 300 });
		}
	};

	return (
		<>
			<StatusBar
				translucent
				backgroundColor="transparent"
				barStyle="dark-content"
			/>

			{/* IMAGE BACKGROUND */}
			<View className="flex-1 w-full bg-white">
				<Animated.View className="flex-1 pb-2">
					<View className="w-full z-30  bg-white shadow-2xl bg-gray flex-row items-center px-5 ">
						<View
							className="flex-row items-center w-full h-[70px]"
							style={{
								marginTop: StatusBar.currentHeight,
							}}
						>
							<TouchableOpacity
								className=""
								onPress={() => router.back()}
								activeOpacity={0.6}
							>
								<View className="w-12 h-12 items-center justify-center bg-white rounded-xl">
									<Image
										source={icons.leftArrow}
										className="w-8 h-8"
									/>
								</View>
							</TouchableOpacity>
							<View className="w-[100%] absolute h-full justify-center items-center">
								<Text className="text-3xl">Cart</Text>
							</View>
						</View>
					</View>
					<View className="flex-1 gap-3">
						<ScrollView
							showsVerticalScrollIndicator={false}
							overScrollMode="never"
							snapToAlignment="start"
							onScroll={handleScroll}
							scrollEventThrottle={16} // required for smooth/fast updates
						>
							<View className="flex-1 p-4 gap-5 rounded-t-[20px]">
								{/* Cart Header */}

								{/* Cart Items */}
								<View className=" gap-3">
									<GroupedCartItems />
									<GroupedCartItems />
									<GroupedCartItems />
									<GroupedCartItems />
									<GroupedCartItems />
									{/* <GroupedCartItems /> */}
								</View>

								{/* Total */}
								<View className="h-[150px] w-full gap-2 py-3 ">
									<View className="flex-row justify-between px-3">
										<Text className="text-xl">
											Subtotal :{" "}
										</Text>
										<Text className="text-2xl font-semibold">
											{" "}
											{`${"230.55"}`}
										</Text>
									</View>
									<View className="flex-row  justify-between px-3 pb-3 border-b border-gray-200 ">
										<Text className="text-xl">
											Delivery Fee :{" "}
										</Text>
										<Text className="text-2xl font-semibold">
											{" "}
											{`${"50.00"}`}
										</Text>
									</View>
									<View className="flex-row px-3 justify-end">
										<Text className="text-2xl font-semibold">
											280.55
										</Text>
									</View>
								</View>
							</View>
						</ScrollView>
					</View>
					{/* Place Order Button */}
					<LinearGradient
						className=" py-1 items-center justify-end h-[100px] -mt-[100px] px-6"
						colors={[
							"transparent",
							"rgba(255, 255, 255, 0.7)",
							"white",
						]}
					>
						<View className="items-center w-full flex-row justify-between  ">
							<View className="flex-row items-end gap-2">
								<Text className="text-xl font-semibold">
									{" "}
									KSH 280.55{" "}
								</Text>
							</View>
							<TouchableOpacity activeOpacity={0.7}>
								<Button
									style={"w-[200px] rounded-xl py-2 "}
									label={"Checkout"}
									textStyle="text-gray-500 text-lg"
								/>
							</TouchableOpacity>
						</View>
					</LinearGradient>
				</Animated.View>
			</View>
		</>
	);
}
