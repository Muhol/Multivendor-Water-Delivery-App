import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import ComicText from "../styled-components/custom-texts/ComicText";

type Props = {};

const Reviews = (props: Props) => {
  // DUMMY DATA
  const reviews = [1, 2, 3, 4, 5, 6, 7];
  const rating = [1, 2, 3, 4];
  const likes = 3;
  const comment =
    "Lorem, ipsum dolor sit amet consectetur adipisicing elit. In natus, cupiditate repellendus neque soluta nemo unde deserunt suscipit ea";
  return (
    <View className="pt-8 p-1 gap-2 ">
      <View className="flex-row justify-between items-center">
        <ComicText text={"Reviews"} style={"text-xl"} />
        <ComicText
          text={`Avg Rating:  ⭐${"4.6"}`}
          style={"text-lg text-gray-500"}
        />
      </View>
      <View className="p-1 pb-4 bg-accentbg/5 flex-1 rounded-3xl ">
        <View className="flex-row items-center gap-2 flex-1 p-3 border-b border-accentbg/20 justify-end">
          <ComicText text={`Sort by`} style="text-gray-500" />
          <Image
            source={require("../../assets/icons/filter-black.png")}
            className="w-5 h-5"
          />
        </View>
        {reviews.map((i, index) => {
          const [extend, setextend] = useState(false);
          return (
            <View
              key={index}
              className="p-2 py-4 gap-2 border-b border-accentbg/20 mx-1"
            >
              {/* <------------------------------------<TOP [ MESSAGE, LIKE BUTTON ]>------------------------------------> */}
              <View className="min-h-[40px] flex-row justify-between items-start gap-3">
                {/* REVIEW TEXT */}
                <View className="flex-1">
                  <Text>
                    <ComicText
                      text={`${
                        comment.length > 70 && !extend
                          ? comment.substring(0, 70).trim() + "..."
                          : comment
                      }`}
                      style={"text-lg text-wrap"}
                    />
                    {/* <ComicText text={`more`} style={'text-sm text-gray-500'} /> */}
                    <TouchableOpacity onPress={() => setextend(!extend)}>
                      <Text className="text-sm text-gray-500">
                        {extend ? " ...less" : "more"}
                      </Text>
                    </TouchableOpacity>
                  </Text>
                </View>
                {/* LIKE REVIEW */}
                <TouchableOpacity>
                  <View className="flex-row items-end gap-2">
                    <Image
                      source={require("../../assets/icons/thumbs-up-black.png")}
                      className="w-5 h-5"
                      tintColor={"gray"}
                    />
                    <ComicText
                      text={`${likes > 0 ? likes.toString() : ""}`}
                      style={"text-gray-500"}
                    />
                  </View>
                </TouchableOpacity>
              </View>

              {/* <---------------------------------<MIDDLE [ DATE, NAME, STAR RATING  ]>--------------------------------> */}
              <View className="flex-row justify-between gap-2">
                {/* DATE AND NAME  */}
                <ComicText
                  text={`${"25-4-2025"} By ${"Mohol"} `}
                  style="text-gray-400 text-sm"
                />
                {/* RATING */}
                <View className="flex-row gap-0">
                  {rating.map((i, index) => {
                    return <Text key={index}>⭐</Text>;
                  })}
                </View>
              </View>

              {/* <----------------------------------------<BOTTOM [ verified  ]>----------------------------------------> */}
              <View className="flex-row gap-2 items-center justify-end">
                <Image
                  source={require("../../assets/icons/verified-black.png")}
                  className="w-5 h-5"
                  tintColor={"lightgreen"}
                />
                <ComicText
                  text={"Verified purchase"}
                  style={" text-sm text-green-400"}
                />
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default Reviews;
