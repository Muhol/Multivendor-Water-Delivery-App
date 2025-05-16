import { View, Text, Dimensions, TouchableOpacity } from "react-native";
import React from "react";
import ComicText from "../styled-components/custom-texts/ComicText";
import PercentageBar from "../ui/PercentageBar";
import Button from "../ui/Button";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

type Props = {
  data?: any;
  FullMap: boolean;
};

const MiniVendorCard = ({ data, FullMap }: Props) => {
  // <--------------------HOOKES-------------------->
  const router = useRouter();
  // DUMMY DATA
  const rating = 5;

  return (
    <>
      <View
        className={`bg-white gap-2 p-4 mx-3 rounded-3xl  ${
          !FullMap ? "shadow-xl border border-gray-50 shadow-black/40" : ""
        }`}
      >
        {/* <------------------NAME-------------------> */}
        <View className="gap-1 flex-row items-end">
          <Text className="font-bold">Vendor Name: </Text>
          <ComicText text={` ${"Amos Rapasi"}`} style="" />
        </View>
        {/* <-----------------RATING------------------> */}
        <View className="flex-row items-center gap-3">
          <Text className="font-bold">Rating:</Text>
          <View className="flex-row gap-1">
            {[...Array(rating)].map((star, index) => {
              return <Text key={index}>⭐</Text>;
            })}
          </View>
          <View className="pl-3 flex-row gap-3 text-gray-500 items-end">
            <Text>/</Text>
            <ComicText text={`${"4.3"}`} style="text-gray-500" />
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
                <Text className=" text-lg font-bold">1 star :{"  "}</Text>
              </View>
              <View className="flex-1 h-3 justify-end ">
                <PercentageBar percentage={3} width={width * 0.65} />
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
                <Text className=" text-lg font-bold">2 stars :</Text>
              </View>
              <View className="flex-1 h-3 justify-end ">
                <PercentageBar percentage={20} width={width * 0.65} />
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
                <Text className=" text-lg font-bold">3 stars :</Text>
              </View>
              <View className="flex-1 h-3 justify-end ">
                <PercentageBar percentage={14} width={width * 0.65} />
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
                <Text className=" text-lg font-bold">4 stars :</Text>
              </View>
              <View className="flex-1 h-3 justify-end ">
                <PercentageBar percentage={31} width={width * 0.65} />
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
                <Text className=" text-lg font-bold">5 stars :</Text>
              </View>
              <View className="flex-1 h-3 justify-end ">
                <PercentageBar percentage={48} width={width * 0.65} />
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
    </>
  );
};

export default MiniVendorCard;
