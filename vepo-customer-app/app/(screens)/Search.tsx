import {
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import React, { useLayoutEffect, useState } from "react";
import BackButton from "@/components/ui/BackButton";
import { useRouter } from "expo-router";
import SearchBar from "@/components/common/Search";
import icons from "@/constants/icons/icons";
import ComicText from "@/components/styled-components/custom-texts/ComicText";

const Search = () => {
  // <--------------------<HOOKS>-------------------->
  const router = useRouter();

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
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <View
        className="bg-white flex-1 pb-[20px]"
        style={{
          paddingTop: StatusBar.currentHeight,
          flex: 1,
        }}
      >
        {/* <-----------------------------------<TOP SEARCH SECTION>-----------------------------------> */}
        <View className="flex-row justify-between  items-center w-full  h-[90px] gap-[10px] px-[15px] ">
          <TouchableOpacity
            onPress={() => {
              router.back();
            }}
          >
            <BackButton />
          </TouchableOpacity>
          <SearchBar
            width={"w-[70%]"}
            height={"h-[40px]"}
            buttonStyle={""}
            setFunc={(value: string) => {
              setSearch(value);
            }}
          />
          <TouchableOpacity onPress={handleSearch}>
            <View className="w-[40px] h-[40px] items-center justify-center bg-gray-200 rounded-full">
              <Image source={icons.search} className="w-6 h-6" />
            </View>
          </TouchableOpacity>
        </View>
        {/* <-----------------------<RESULTS SECTION>-----------------------> */}
        <View className="px-[10px] items-end py-2">
          <Text>
            <ComicText text={`Search Results  (${"25"})`} style={""} />
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
          {vendors.map((index) => {
            return (
              <TouchableOpacity activeOpacity={0.6} key={index}>
                <View className="flex-row w-full gap-[20px] border-b border-gray-100 py-4">
                  <Image
                    source={require("../../assets/prop-images/dasani-banner.png")}
                    className="w-[40px] h-[40px] rounded-full  "
                  />
                  <View className="gap-1 ">
                    <ComicText
                      text={`${"dasani refill shop"}`}
                      style={"text-gray-700"}
                    />
                    <View className="flex-row gap-2">
                      <View className="pl-[10px]">
                        <Image source={icons.location} className="w-5 h-5" />
                      </View>
                      <ComicText
                        text={`Location: ${
                          location.length > 40
                            ? location.substring(0, 40).trim() + "..."
                            : location
                        }`}
                        style="text-gray-500"
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
                        ? location.substring(0, 45).trim() + "..."
                        : location
                    }`}
                    style="text-gray-500"
                  />
                  <View className="ml-2 p-2 bg-gray-200 rounded-full">
                    <Image source={icons.location} className="w-6 h-6 " />
                  </View>
                </View>
              );
            })}
          </View>
        </ScrollView>
      </View>
    </>
  );
};

export default Search;
