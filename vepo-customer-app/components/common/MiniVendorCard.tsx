import { View, Text, Dimensions, TouchableOpacity } from "react-native";
import React from "react";
import ComicText from "../styled-components/custom-texts/ComicText";
import PercentageBar from "../ui/PercentageBar";
import Button from "../ui/Button";
import { useRouter } from "expo-router";
import Animated from "react-native-reanimated";

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

const { width } = Dimensions.get("window");

type Props = {
	data: any;
	FullMap: boolean;
};

const MiniVendorCard = ({ data, FullMap }: Props) => {
	// <--------------------HOOKS-------------------->
	const router = useRouter();
	// DUMMY DATA
	const rating = 5;

	// console.log(data)

  if(data === undefined){
    return
  }
	return (
		<View
			className={`bg-white gap-2 p-4 mx-3 rounded-3xl  ${
				!FullMap
					? "shadow-xl border border-gray-50 shadow-black/40"
					: ""
			}`}
		>
			{/* <------------------NAME-------------------> */}
			<View className="gap-1 flex-row items-end">
				<Text className="font-bold">Vendor Name: </Text>
				<ComicText text={` ${data?.owners_name}`} style="" />
			</View>

			{/* <-----------------RATING------------------> */}
			<View className="flex-row items-center gap-3">
				<Text className="font-bold">Rating:</Text>
				<View className="flex-row gap-1">
					{data != undefined &&
						[...Array(Math.round(data?.rating))].map((i, index) => {
							return <Text key={index}>⭐</Text>;
						})}
				</View>
				<View className="pl-3 flex-row gap-3 text-gray-500 items-end">
					<Text>/</Text>
					<ComicText text={`${data?.rating}`} style="text-gray-500" />
				</View>
			</View>

			{/* <------------FULL RATING STATS------------> */}
			{!FullMap && (
				<View>
					{/* one star */}
					<View
						className="flex-row gap-3 items-center "
						style={{
							maxWidth: width * 0.8,
						}}
					>
						<View className=" py-1">
							<Text className=" text-lg font-bold">
								1 star :{"  "}
							</Text>
						</View>
						<View className="flex-1 h-3 justify-end ">
							<PercentageBar
								percentage={3}
								width={width * 0.65}
							/>
						</View>
					</View>
					{/* two star */}

					<View
						className="flex-row gap-3 items-center "
						style={{
							maxWidth: width * 0.8,
						}}
					>
						<View className=" py-1">
							<Text className=" text-lg font-bold">
								2 stars :
							</Text>
						</View>
						<View className="flex-1 h-3 justify-end ">
							<PercentageBar
								percentage={20}
								width={width * 0.65}
							/>
						</View>
					</View>
					{/* three star */}

					<View
						className="flex-row gap-3 items-center "
						style={{
							maxWidth: width * 0.8,
						}}
					>
						<View className=" py-1">
							<Text className=" text-lg font-bold">
								3 stars :
							</Text>
						</View>
						<View className="flex-1 h-3 justify-end ">
							<PercentageBar
								percentage={14}
								width={width * 0.65}
							/>
						</View>
					</View>
					{/* four star */}

					<View
						className="flex-row gap-3 items-center "
						style={{
							maxWidth: width * 0.8,
						}}
					>
						<View className=" py-1">
							<Text className=" text-lg font-bold">
								4 stars :
							</Text>
						</View>
						<View className="flex-1 h-3 justify-end ">
							<PercentageBar
								percentage={31}
								width={width * 0.65}
							/>
						</View>
					</View>
					{/* five star */}

					<View
						className="flex-row gap-3 items-center "
						style={{
							maxWidth: width * 0.8,
						}}
					>
						<View className=" py-1">
							<Text className=" text-lg font-bold">
								5 stars :
							</Text>
						</View>
						<View className="flex-1 h-3 justify-end ">
							<PercentageBar
								percentage={48}
								width={width * 0.65}
							/>
						</View>
					</View>
				</View>
			)}
			{/* <--------------EST DISTANCE---------------> */}
			<View className=" flex-row gap-2 items-end">
				<Text className="font-bold">Delivery Time:</Text>
				<ComicText text={`${"45min"}`} />
			</View>

			{/* <--------------EST DELIVERY---------------> */}

			{/* <-----------VIEW VENDOR BUTTON------------> */}
			<TouchableOpacity
				activeOpacity={0.7}
				onPress={() => {
					router.push(`/(screens)/vendor/[id:1]`);
				}}
			>
				<Button
					style={"w-[200px] self-end rounded"}
					label={"View Vendor Shop"}
					textStyle={""}
				/>
			</TouchableOpacity>
		</View>
	);
};

export default MiniVendorCard;





















    // return (
    // 	<View
    // 		className={`bg-white gap-5 p-4 mx-3 rounded-3xl  ${
    // 			!FullMap
    // 				? "shadow-xl border border-gray-50 shadow-black/40"
    // 				: ""
    // 		}`}
    // 	>
    //     <View className="gap-3">
    //       {/* <------------------NAME-------------------> */}
    //       <View className="gap-3 flex-row items-end">
    //         {/* <Text className="font-bold">Vendor Name: </Text> */}
    //         <Animated.View className="bg-gray-200 h-3 w-[100px] rounded-full animate-pulse" />
    //         <Animated.View className="bg-gray-200 h-3 w-[70px] rounded-full animate-pulse" />
    //       </View>
  
    //       {/* <-----------------RATING------------------> */}
    //       <View className="flex-row items-center gap-3">
    //         <Animated.View className="bg-gray-200 h-3 w-[70px] rounded-full animate-pulse" />
    //         <Animated.View className="bg-gray-200 h-3 w-[150px] rounded-full animate-pulse" />
  
    //         <View className="pl-3 flex-row gap-3 text-gray-500 items-end">
    //         </View>
    //       </View>
    //     </View>
  
    // 		{/* <------------FULL RATING STATS------------> */}
    // 		{!FullMap && (
    // 			<View className="gap-2">
    // 				{/* one star */}
    // 				<View
    // 					className="flex-row gap-4 items-center "
    // 					style={{
    // 						maxWidth: width * 0.8,
    // 					}}
    // 				>
    // 					<View className=" py-1">
    // 						<Animated.View className="bg-gray-200 h-3 w-[60px] rounded-full animate-pulse" />
    // 					</View>
    // 					<View className="flex-1 h-3 justify-end ">
    // 						<Animated.View className="bg-gray-200 h-3 w-[90%] rounded-full animate-pulse" />
    // 					</View>
    // 				</View>
  
    // 				{/* two star */}
    // 				<View
    // 					className="flex-row gap-4 items-center "
    // 					style={{
    // 						maxWidth: width * 0.8,
    // 					}}
    // 				>
    // 					<View className=" py-1">
    // 						<Animated.View className="bg-gray-200 h-3 w-[60px] rounded-full animate-pulse" />
    // 					</View>
    // 					<View className="flex-1 h-3 justify-end ">
    // 						<Animated.View className="bg-gray-200 h-3 w-[90%] rounded-full animate-pulse" />
    // 					</View>
    // 				</View>
  
    // 				{/* three star */}
    // 				<View
    // 					className="flex-row gap-4 items-center "
    // 					style={{
    // 						maxWidth: width * 0.8,
    // 					}}
    // 				>
    // 					<View className=" py-1">
    // 						<Animated.View className="bg-gray-200 h-3 w-[60px] rounded-full animate-pulse" />
    // 					</View>
    // 					<View className="flex-1 h-3 justify-end ">
    // 						<Animated.View className="bg-gray-200 h-3 w-[90%] rounded-full animate-pulse" />
    // 					</View>
    // 				</View>
  
    // 				{/* four star */}
    // 				<View
    // 					className="flex-row gap-4 items-center "
    // 					style={{
    // 						maxWidth: width * 0.8,
    // 					}}
    // 				>
    // 					<View className=" py-1">
    // 						<Animated.View className="bg-gray-200 h-3 w-[60px] rounded-full animate-pulse" />
    // 					</View>
    // 					<View className="flex-1 h-3 justify-end ">
    // 						<Animated.View className="bg-gray-200 h-3 w-[90%] rounded-full animate-pulse" />
    // 					</View>
    // 				</View>
  
    // 				{/* five star */}
    // 				<View
    // 					className="flex-row gap-4 items-center "
    // 					style={{
    // 						maxWidth: width * 0.8,
    // 					}}
    // 				>
    // 					<View className=" py-1">
    // 						<Animated.View className="bg-gray-200 h-3 w-[60px] rounded-full animate-pulse" />
    // 					</View>
    // 					<View className="flex-1 h-3 justify-end ">
    // 						<Animated.View className="bg-gray-200 h-3 w-[90%] rounded-full animate-pulse" />
    // 					</View>
    // 				</View>
    // 			</View>
    // 		)}
    // 		{/* <--------------EST DISTANCE---------------> */}
    // 		<View className=" flex-row gap-2 items-end">
    // 			{/* <Text className="font-bold">Delivery Time:</Text> */}
    // 						<Animated.View className="bg-gray-200 h-3 w-[60px] rounded-full animate-pulse" />
    // 						<Animated.View className="bg-gray-200 h-3 w-[60px] rounded-full animate-pulse" />
  
    // 			{/* <ComicText text={`${"45min"}`} /> */}
    // 		</View>
  
    // 		{/* <--------------EST DELIVERY---------------> */}
  
    // 		{/* <-----------VIEW VENDOR BUTTON------------> */}
    // 		<TouchableOpacity
    // 			activeOpacity={0.7}
    // 			onPress={() => {
    // 				router.push(`/(screens)/vendor/[id:1]`);
    // 			}}
    // 		>
    // 			{/* <Button
    // 				style={"w-[200px] self-end rounded"}
    // 				label={"View Vendor Shop"}
    // 				textStyle={""}
    // 			/> */}
    // 						<Animated.View className="bg-gray-200 h-[0px] w-[200px] self-end rounded animate-pulse" />
  
    // 		</TouchableOpacity>
    // 	</View>
    // );