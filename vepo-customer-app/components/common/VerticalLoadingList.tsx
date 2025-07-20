import { View, Text, FlatList, Dimensions, TouchableOpacity, Image } from 'react-native'
import React, { useContext } from 'react'
import { useRouter } from 'expo-router'
import { UIThemeContext } from '@/context/ThemeContext'
import icons from '@/constants/icons/icons'
import ComicText from '../styled-components/custom-texts/ComicText'

type Props = {
  data: any
  fetchData?: ()=> void
}

const {width} = Dimensions.get("window")
const router = useRouter()
const { currentTheme } = useContext(UIThemeContext);
const darkTheme = currentTheme === "dark";

const FlatlistRendorItem = ({ item }: { item: any }) => {
  const percentageOffer = Math.ceil(
    (item?.discount / item?.price) * 100
  );
  return(
    <View
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
          router.push(`/product-details/${item?.id}`);
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
          {item?.discount > 0 && (
            <View
              className={`absolute w-[60px]  bg-red-500 z-20 right-0 items-center justify-center rotate-45 translate-x-4 translate-y-2`}
            >
              <Text className={`text-white font-semibold`}>
                {percentageOffer}%
              </Text>
            </View>
          )}
          {/* image */}
          <View
            className={`w-full`}
            style={{
              height: width * 0.3,
            }}
          >
            <Image
              source={{ uri: item?.image_url }}
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
              {item?.name?.length > 20
                ? item?.name.substring(0, 20).trim() +
                  "..."
                : item?.name}
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
                    (item?.price - item?.discount) *
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
                  {item?.price}
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
  )
}
export default FlatlistRendorItem