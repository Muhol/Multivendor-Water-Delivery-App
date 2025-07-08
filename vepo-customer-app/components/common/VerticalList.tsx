import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useContext } from "react";
import { Dimensions } from "react-native";
import images from "@/constants/images/images";
import { UIThemeContext } from "@/context/ThemeContext";
import icons from "@/constants/icons/icons";
import ComicText from "../styled-components/custom-texts/ComicText";
import Animated from "react-native-reanimated";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

type Props = {
	data?: any;
	loaded: boolean;
  title?: string;
};

const VerticalList = ({ data, loaded , title}: Props) => {
	// <-------------------HOOKES--------------------->
	const { currentTheme } = useContext(UIThemeContext);
	const darkTheme = currentTheme === "dark";
  const router = useRouter()

	if (!loaded) {
		return (
			<View className={`gap-3`}>
        <Animated.View 
          className={`w-[150px] h-3 rounded-full ${darkTheme?"bg-gray-200/20":"bg-gray-200"} animate-pulse`} 
          style={{
            marginHorizontal: width * 0.05,
            marginTop: width * 0.05
          }}
        />
				<View className={`w-full flex-row flex-wrap`}>
					{[...Array(3)]?.map((item: any, index: any) => {
						return (
							<View
								key={index}
								className={`flex-1  items-center`}
								style={{
									minWidth: width * 0.5,
									maxWidth: width * 0.5,
									paddingHorizontal: width * 0.05,
									paddingVertical: width * 0.025,
								}}
							>
								<Animated.View
									className={`rounded overflow-hidden relative ${
										darkTheme
											? "bg-gray-200/10"
											: "bg-white"
									} animate-pulse`}
									style={{
										width: width * 0.39,
										height: width * 0.4,
									}}
								>
									{/* image */}
									<View
										className={`w-full`}
										style={{
											height: width * 0.3,
										}}
									></View>
									{/* Name, pricing and delivery time  */}
									<View
										className={`w-full flex-1 px-1 justify-around`}
									>
										<Animated.View
											className={`w-[60%] h-3 rounded-full ${
												darkTheme
													? "bg-gray-200/20"
													: "bg-gray-200"
											}`}
										/>
										<View
											className={`flex-row justify-between items-center`}
										>
											{/* price and discount */}
											<Animated.View
												className={`w-[40%] h-3 rounded-full ${
													darkTheme
														? "bg-gray-200/20"
														: "bg-gray-200"
												}`}
											/>
											<Animated.View
												className={`w-[30%] h-3 rounded-full ${
													darkTheme
														? "bg-gray-200/20"
														: "bg-gray-200"
												}`}
											/>
											{/* est delivery time */}
										</View>
									</View>
								</Animated.View>
							</View>
						);
					})}
				</View>
			</View>
		);
	}

  if(loaded && data?.length === 0){
		return
	}

	return (
    <View className={`gap-3`}>
      <View className={`flex-row justify-between items-center`}
        style={{
          marginHorizontal: width * 0.05,
          // marginTop: width * 0.05
        }}>
        {title ? (
          <Text className={`${darkTheme?"text-white":"text-black"} text-xl font-semibold`}>{title}</Text>
        ):(
          <Text>{""}</Text>
        )}

        <TouchableOpacity>
          <View className={`py-2 px-3`}>
            <Text className={`${darkTheme?"text-gray-500":"text-gray-400"}`}>See more</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View className={`w-full flex-row flex-wrap`}>
        {data?.map((item: any, index: any) => {
          const percentageOffer = Math.ceil(
            (item.discount / item.price) * 100
          );
          return (
            <View
              key={index}
              className={`flex-1  items-center`}
              style={{
                minWidth: width * 0.5,
                maxWidth: width * 0.5,
                paddingHorizontal: width * 0.05,
                paddingVertical: width * 0.025,
              }}
            >
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={()=>{
                  router.push(`/product-details/${item.id}`);
                }}
              >
                <View
                  className={`rounded overflow-hidden relative ${darkTheme?"bg-black":"bg-white "}`}
                  style={{
                    width: width * 0.39,
                    // height: width * 0.4,
                  }}
                >
                  {/* Offer Badge */}
                  <View
                    className={`absolute w-[60px]  bg-red-500 z-20 right-0 items-center justify-center rotate-45 translate-x-4 translate-y-2`}
                  >
                    <Text className={`text-white font-semibold`}>
                      {percentageOffer}%
                    </Text>
                  </View>
                  {/* image */}
                  <View
                    className={`w-full`}
                    style={{
                      height: width * 0.3,
                    }}
                  >
                    <Image
                      source={{ uri: item.image_url }}
                      className="w-full h-full rounded"
                    />
                  </View>
                  {/* Name, pricing and delivery time  */}
                  <View className={`w-full flex-1 px-1 py-2`}>
                    <Text
                      className={`${
                        darkTheme ? "text-white" : " text-black"
                      }`}
                    >
                      {item.name.length > 20
                        ? item.name.substring(0, 20).trim() +
                          "..."
                        : item.name}
                    </Text>
                    <View
                      className={`flex-row justify-between items-center`}
                    >
                      {/* price and discount */}
                      <View className={`flex-row gap-2`}>
                        <Text
                          className={`font-semibold ${
                            darkTheme
                              ? "text-white"
                              : " text-black"
                          }`}
                        >
                          KSH{" "}
                          {Math.round(
                            (item.price - item.discount) *
                              100
                          ) / 100}
                        </Text>
                        <Text
                          style={{
                            textDecorationLine:
                              "line-through",
                          }}
                          className={`${
                            darkTheme
                              ? "text-gray-500"
                              : "text-gray-400"
                          }`}
                        >
                          {item.price}
                        </Text>
                      </View>
                      {/* est delivery time */}
                      <View className="flex-row gap-1 items-center">
                        <Image
                          source={icons.bike}
                          className="w-5 h-5"
                          tintColor={
                            darkTheme ? "lightgray" : "gray"
                          }
                        />
                        <ComicText
                          text={"40 mins"}
                          style={
                            darkTheme
                              ? "text-gray-300 text-sm"
                              : "text-gray-700 text-sm"
                          }
                        />
                      </View>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    </View>
	);
};

export default VerticalList;
