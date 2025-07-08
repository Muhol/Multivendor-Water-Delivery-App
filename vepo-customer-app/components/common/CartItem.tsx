import { View, Text, TouchableOpacity, Modal } from "react-native";
import React, { useContext, useState } from "react";
import { Image } from "react-native";
import ComicText from "../styled-components/custom-texts/ComicText";
import { UIThemeContext } from "@/context/ThemeContext";
import ApiRoutes from "@/API/routes/ApiRoutes";
import { useAuth } from "@clerk/clerk-expo";
import Context from "@/context/context";
import Animated from "react-native-reanimated";
import icons from "@/constants/icons/icons";

type Props = {
	data?: any;
	func: () =>  void;
};

const CartItem = ({ data, func }: Props) => {
	// <--------------------HOOKS--------------------->
	const { currentTheme } = useContext(UIThemeContext);
	const darkTheme = currentTheme === "dark";
	const { getToken } = useAuth();
	const { fetchCart } = useContext(Context);

	// <-------------------STATES--------------------->
	const [changeQuantity, setChangeQuantity] = useState(false);
	const [NewQuantity, setNewQuantity] = useState(data?.quantity);
  const [QuantityLoading, setQuantityLoading] = useState(false)
  const [DeleteLoading, setDeleteLoading] = useState(false)

	// <-------------------VARIABLES--------------------->

	// <-------------------FUNCTIONS--------------------->
	// API CALLS
	// change quantity of cart item
	const ChangeQuantity = async (id: string) => {
    setQuantityLoading(true)
		const token = await getToken();
		const payload = {
			quantity: NewQuantity,
			id: data?.id,
		};
		try {
			const apiCall = await fetch(ApiRoutes.ChangeCartItemQuantity.path, {
				method: ApiRoutes.ChangeCartItemQuantity.method,
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "Application/json",
				},
				body: JSON.stringify(payload),
			});
			const response = await apiCall.json();
			fetchCart().then(()=> {
				setChangeQuantity(false)
				func()
			}).then(()=>{
				setQuantityLoading(false)
			})
		} catch (error: any) {
      setQuantityLoading(false)
      setChangeQuantity(false)
		}
	};

	// remove item from cart
	const DeleteItem = async () => {
    setDeleteLoading(true)
		const token = await getToken();
		const payload = {
			id: data?.id,
		};
		try {
			const apiCall = await fetch(ApiRoutes.DeleteCartItem.path, {
				method: ApiRoutes.DeleteCartItem.method,
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "Application/json",
				},
				body: JSON.stringify(payload),
			});
			const response = await apiCall.json();
			func()
			fetchCart().then(()=> {
				setDeleteLoading(false)
			})
		} catch (error: any) {
      setDeleteLoading(false)
		}
	};

	return (
		<View className={` p-2 rounded-xl `}>
			{/* <-------------------------------<CART ITEM>-------------------------------> */}
			<View className="flex-row gap-2 py-2 items-center justify-between">
				<View className="flex-row gap-2 items-center">
					{/* <--------------------<left>--------------------> */}
					<View>
						<Image
							source={{ uri: data?.product.image_url }}
							className="w-[90px] h-[90px] rounded-lg"
							resizeMode="contain"
						/>
					</View>
					{/* <--------------------<middle>--------------------> */}
					<View className=" gap-1 ">
						<Text
							className={`${
								darkTheme ? "text-white" : "text-black"
							}`}
						>{`${
							data?.product.name.length > 25
								? data?.product.name.substring(0, 25).trim() + "..."
								: data?.product.name
						}`}</Text>
						<ComicText
							text={`Ksh ${
								data?.product.price - data?.product.discount
							}`}
							style={
								darkTheme
									? "text-lg text-white"
									: "text-lg text-black"
							}
						/>

						{/* <--------<QUANTITY SECTION>--------> */}
						<View className="flex-row gap-3 items-center">
							{/* DECREASE */}
							<TouchableOpacity
								activeOpacity={0.6}
								onPress={() => {
                  if(NewQuantity > 1){
                    setNewQuantity(NewQuantity - 1);
                    setChangeQuantity(true);
                  }
								}}
							>
								<View className="p-2 rounded-xl ">
									<Image
										source={require("../../assets/icons/minus-black.png")}
										className="w-5  h-5 rounded-full"
										tintColor={
											darkTheme ? "white" : "black"
										}
									/>
								</View>
							</TouchableOpacity>

							<ComicText
								text={`${NewQuantity}`}
								style={darkTheme ? "text-white" : "text-black"}
							/>

							{/* INCREASE */}
							<TouchableOpacity
								activeOpacity={0.6}
								onPress={() => {
									setNewQuantity(NewQuantity + 1);
									setChangeQuantity(true);
								}}
							>
								<View className="p-2 rounded-xl ">
									<Image
										source={require("../../assets/icons/add-black.png")}
										className="w-5  h-5 rounded-full"
										tintColor={
											darkTheme ? "white" : "black"
										}
									/>
								</View>
							</TouchableOpacity>

							{/* COMMIT BUTTON */}
							{changeQuantity && (
								<TouchableOpacity
									onPress={() => {
										ChangeQuantity(data?.id);
									}}
								>
									<View
										className={`${
											darkTheme ? "bg-white" : "bg-black"
										} py-2 px-4 rounded-full`}
									>
										<Text
											className={`${
												darkTheme
													? "text-black"
													: "text-white"
											}`}
										>
											Change Quantity
										</Text>
									</View>
								</TouchableOpacity>
							)}
						</View>
					</View>
				</View>

				{/* <--------------------<right>--------------------> */}
				<View className=" gap-6 items-end ">
					{/* subtotal */}
					<ComicText
						text={`Ksh ${Math.round((data?.price * data?.quantity) * 100) / 100}`}
						style={
							darkTheme
								? "text-lg text-white"
								: "text-lg text-black"
						}
					/>
					{/* <--------<REMOVE BUTTON>--------> */}
					<TouchableOpacity
						activeOpacity={0.6}
						onPress={() => {
							DeleteItem();
						}}
					>
						<View className="flex-row gap-1 h-7 items-center">
							<Image
								source={require("../../assets/icons/delete-black.png")}
								className="w-6 h-6 rounded-full"
								tintColor={darkTheme ? "white" : "black"}
							/>
						</View>
					</TouchableOpacity>
				</View>
			</View>
			<Modal backdropColor={"transparent"} visible={QuantityLoading}>
				<View className={`items-center justify-end w-full h-full`}>
					<View
						className={`w-full h-[100px] ${darkTheme?"bg-black":"bg-white"} rounded items-center justify-center `}
					>
						<View className={`flex-row items-center gap-3`}>
							<Animated.View className={`animate-spin`}>
								<Image
									source={icons.spinner}
									className={`w-10 h-10`}
								/>
							</Animated.View>
							<Text className={`${darkTheme?"text-white":"text-black"}`}>Changing Item Quantity</Text>
						</View>
					</View>
				</View>
			</Modal>
			<Modal backdropColor={"transparent"} visible={DeleteLoading}>
				<View className={`items-center justify-end w-full h-full`}>
					<View
						className={`w-full h-[100px] ${darkTheme?"bg-black":"bg-white"} rounded items-center justify-center `}
					>
						<View className={`flex-row items-center gap-3`}>
							<Animated.View className={`animate-spin`}>
								<Image
									source={icons.spinner}
									className={`w-10 h-10`}
								/>
							</Animated.View>
							<Text className={`${darkTheme?"text-white":"text-black"}`}>Removing Item from cart</Text>
						</View>
					</View>
				</View>
			</Modal>
		</View>
	);
};

export default CartItem;
