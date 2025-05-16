import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import ComicText from "../styled-components/custom-texts/ComicText";
import images from "@/constants/images/images";
import icons from "@/constants/icons/icons";
import Button from "../ui/Button";

type Props = {
  data?: any;
};

const TrackOrderCard = ({ data }: Props) => {
  return (
    <View className="bg-gray-100 rounded-xl gap-2 px-4 py-3">
        
      
      {/* <------RIDER PROFILE DETAILES: [ Profile-pic, Plate-No, Rating, Delivery-fee, Phone-number ]-------> */}
      <View className="items-center flex-row gap-4">
        <View className="items-center">
            <View className="w-[70px] h-[70px]">
            <Image
                className="w-full h-full rounded-full border border-gray-200"
                resizeMode="cover"
                source={images.profile_placeholder}
            />
            </View>
            <ComicText text={`${"John Doe"}`} style={"text-lg"} />
        </View>
        <View className=" w-full gap-1 ">
          {/* <---------RATING----------> */}
          <View className="gap-1">
            <View className="flex-row gap-3 items-end">
              <Text className="font-semibold">Rating:</Text>
              <View className="flex-row gap-1">
                {[...Array(5)].map((star, index) => {
                  return <Text key={index}>⭐</Text>;
                })}
              </View>
              <ComicText text={`${4.7}`} style={"text-gray-500"} />
            </View>
          </View>
          {/* <---------PLATE_NO----------> */}
          <View className="gap-1">
            <View className="flex-row gap-3 items-end">
              <Text className="font-semibold">Plate No:</Text>
              <ComicText text={`${"KMDC 2485Q"}`} style={"text-gray-500"} />
            </View>
          </View>
          {/* <---------DELIVERY_FEE----------> */}
          <View className="gap-1">
            <View className="flex-row gap-3 items-end">
              <Text className="font-semibold">Delivery Fee:</Text>
              <ComicText text={`KSH ${120}`} style={"text-gray-500"} />
            </View>
          </View>
          {/* <---------PHONE_NO----------> */}
          <View className="gap-1">
            <View className="flex-row gap-3 items-center">
              {/* <Text className="font-semibold">Contact:</Text> */}
              <TouchableOpacity 
                activeOpacity={0.7}
                className="flex-row gap-3 items-center"
              >
                <View className="w-10 h-10 shadow-lg shadow-black bg-green-500 rounded-2xl items-center justify-center">
                    <Image source={icons.call} className="w-7 h-7" tintColor={"white"}/>
                </View>
                <ComicText text={`${"0742380802"}`} style={"text-gray-500"} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      <View className="gap-1">
            <View className="gap-1 flex-row items-end">
                <Text className="font-bold text-gray-800">Placed At:  </Text>
                <ComicText text={`${"2:00pm "} ${"today"}`} style={'text-gray-700'} />
            </View>
            <View className="gap-1 flex-row items-end">
                <Text className="font-bold text-gray-800">Delivery Time:  </Text>
                <ComicText text={`${"10min"}`} style={'text-gray-700'} />
            </View>
            <View className="gap-1 flex-row items-end">
                <Text className="font-bold text-gray-800">Items:  </Text>
                <ComicText text={`${"3 items"}`} style={'text-gray-700'} />
            </View>
            <View className="gap-1 flex-row items-end">
                <Text className="font-bold text-gray-800">Amount:  </Text>
                <ComicText text={`KSH ${300}`} style={'text-gray-700'} />
            </View>
        </View>

        <View className="flex-row">
            <Button style={"px-[50px] rounded-lg"} label={"View Items"} type={"outlin"} textStyle={"text-gray-500"}/>
        </View>

      {/* <------TIME ORDER PLACED-------> */}
      <View className="flex-row absolute self-end bottom-2 right-2">
        <ComicText text={`${"5min ago"} `} style={" text-gray-500"} />
      </View>
    </View>
  );
};

export default TrackOrderCard;
