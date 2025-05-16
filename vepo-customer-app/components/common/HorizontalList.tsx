import {
  View,
  Text,
  ScrollView,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Dimensions,
  Image,
} from "react-native";
import React from "react";
import ComicText from "../styled-components/custom-texts/ComicText";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("screen");
const w = Math.ceil(width);
const h = Math.ceil(height);

type Props = {
  title: string;
  type?: string;
  data?: any[];
};

const HorizontalList = ({ title, type, data }: Props) => {
  // <-----------------<HOOKS>----------------->
  const router = useRouter();
  // dummy data
  const dataarr = [1, 2, 3, 4, 5, 6, 7];
  const rating = [1, 2, 3, 4, 5];
  const text =
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic error aspernatur at qui,.";
  const product = {
    name: "10L Refill Bottle",
    price: "Ksh 10.99",
    available: true,
  };

  return (
    <View 
      className=" bg-white pt-1 border-y border-gray-50 shadow-2xl"
    >
      <View className="px-5  justify-between flex-row items-center">
        <ComicText text={title} style={"text-xl"} />
      </View>
      <ScrollView
        horizontal={true}
        contentContainerStyle={{ gap: 10, padding: 5, height: w * 0.43 }}
        scrollEnabled={true}
        className="py-2 "
      >
        <View className="flex-row gap-3 px-3">
          {dataarr.map((item, index) => {
            return (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  if(type === "product"){
                    router.push('/product-details/[id:1]');
                  }else{
                    router.push(`/(screens)/vendor/[id:1]`);
                  }
                }}
                activeOpacity={0.6}
              >
                <View
                  className=" overflow-hidden shadow justify-end bg-white rounded-xl h-full"
                  style={{
                    width: w * 0.41,
                    boxShadow : '1px 1px 10px rgba(0,0,0,0.15)'
                  }}
                >
                  {/* IMAGE */}
                  <View className=" absolute w-full h-full ">
                    <Image
                      source={require("../../assets/prop-images/Product_Aqualife_100C_Refill5gal.jpg")}
                      className="w-full h-full rounded-t-xl"
                      resizeMode="cover"
                    />
                  </View>
                  <LinearGradient 
                    className="p-1 "
                    colors={["transparent", "white", "white", "white"]}
                  >
                  {/* <-----------------<RENDER ACCORDING TO TYPE OF LIST>-----------------> */}
                    {type === "product" ? (
                      <Text className="text-wrap">
                        {product.name.length > 20? product.name.substring(0,21).trim()+"..." : product.name}
                      </Text>
                    ) : (
                      <Text className="text-wrap">
                        {text.length > 23
                          ? text.substring(0, 23).trim() + "..."
                          : text}
                      </Text>
                    )}

                  {/* <-----------------<RENDER ACCORDING TO TYPE OF LIST>-----------------> */}
                    {type === "product" ? (
                      // <---------------------<PRODUCT PRICE>--------------------->
                      <View>
                        <Text className="text-accentbg">{product.price}</Text>
                      </View>
                    ) : (
                      // <------------------------<RATING>------------------------->
                      <View className="flex-row gap-3 justify-between items-center  h-7">
                          <View className="flex-row gap-1 items-center">
                              <Image
                                  source={require("../../assets/icons/bike-black.png")}
                                  className="w-5 h-5"
                                  tintColor={"gray"}
                              />
                              <ComicText text={"Est 40 mins"} style="text-gray-700"/>
                          </View>
                          <Text >⭐ 4.3</Text>
                      </View>
                    )}

                    {/* <--------------------<ADD TO CART BUTTON>--------------------> */}
                    {
                      type === "product" ? (
                          <>
                              <TouchableOpacity
                                  activeOpacity={0.6} 
                                  style={{
                                      position: 'absolute',
                                      bottom: 1,
                                      right: 2
                                  }}
                              >
                                  <View className="bg-accentbg/90 p-2 rounded-xl">
                                      <Image 
                                      source={require("../../assets/icons/addtocart-black.png")}
                                      className="w-4 h-4"
                                      tintColor={"white"}
                                      />
                                  </View>
                              </TouchableOpacity>
                          </>
                      ) : (
                          <></>
                      )
                    }

                  </LinearGradient>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

export default HorizontalList;
