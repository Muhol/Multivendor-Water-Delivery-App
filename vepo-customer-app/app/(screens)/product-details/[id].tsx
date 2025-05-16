import {
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Image,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import BackButton from "@/components/ui/BackButton";
import ComicText from "@/components/styled-components/custom-texts/ComicText";
import Button from "@/components/ui/Button";
import icons from "@/constants/icons/icons";
import Reviews from "@/components/common/Reviews";

const { width } = Dimensions.get("window");

const ProductDetails = () => {
  const router = useRouter();
  const statusBarHieght = StatusBar.currentHeight || 60;
  // Dummy Data
  const location =
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Suscipit alias illum nisi tenetur, earum autem consequatur nulla blanditiis porro adipisci";

  const product = {
    name: "20L Mineral Water Refill",
    description:
      "Clean, mineral-rich drinking water in a refillable 10L container.",
    price: 150,
    stockAvailable: true,
    quantity: 1,
  };



  return (
    <>
      <StatusBar backgroundColor="transparent" barStyle="dark-content" />
      <SafeAreaView className="flex-1 bg-white">
        {/* Back Button */}
        <TouchableOpacity
          className="p-5"
          style={{
            position:"absolute",
            top: statusBarHieght,
            left: 0,
            zIndex:10
          }}
          activeOpacity={0.7}
          onPress={() => router.back()}
        >
          <BackButton />
        </TouchableOpacity>

        {/* Product Image and Name */}

        {/* Product Details */}
        <ScrollView
          className="flex-1 border-gray-50"
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingVertical: 60,
            paddingBottom: 50,
            gap: 15,
          }}
          scrollEnabled
          showsVerticalScrollIndicator={false}
          bounces={false}
          overScrollMode="never"

        >
          <View className="w-full items-center justify-center">
            <View
              className="rounded-3xl bg-gray-50"
              style={{ width: width * 0.7, height: width * 0.6 }}
            >
              <Image
                source={require("@/assets/prop-images/Product_Aqualife_100C_Refill5gal.jpg")}
                className="w-full h-full rounded-3xl"
                resizeMode="cover"
              />
            </View>

            <View className="py-3">
              <ComicText text={product.name} style="text-lg" />
            </View>
          </View>

          {/* Description */}
          <ComicText text={product.description} style="text-lg" />

          <View className="gap-2">
            {/* Price */}
            <View className="flex-row items-center gap-2">
              <Text>Price:</Text>
              <ComicText text={`ksh ${product.price}`} />
            </View>

            {/* Availability */}
            <View className="flex-row items-center gap-2">
              <Text>Availability:</Text>
              <ComicText
                text={product.stockAvailable ? "In Stock" : "Out Of Stock"}
                style={`text-lg ${
                  product.stockAvailable ? "text-green-400" : "text-red-500"
                }`}
              />
            </View>
            <View className="flex-row items-center gap-2">
              <Text>Estimated Delivery Time:</Text>
              <ComicText text={`${"35 - 40 mins"}`} style={`text-l `} />
            </View>
            <View className="flex-row items-center gap-2">
              <Text>Delivery Cost:</Text>
              <ComicText text={`ksh ${"50"}`} style={`text-l `} />
            </View>
          </View>

          {/* Quantity Selector */}
          <View className="flex-row items-center justify-between gap-4">
            <View className="flex-row items-center gap-4">
              {/* minus */}
              <TouchableOpacity
                activeOpacity={0.7}
                >
               <View className="h-[40px] w-[40px] rounded-2xl items-center justify-center bg-accentbg/80">
                  <Image source={icons.minus} className="w-5 h-5" tintColor={'white'}/>
               </View>
              </TouchableOpacity>

              <ComicText text={`${product.quantity}`} />

              {/* add */}
              <TouchableOpacity
                activeOpacity={0.7}
              >
               <View className="h-[40px] w-[40px] rounded-2xl items-center justify-center bg-accentbg/80">
                  <Image source={icons.add} className="w-5 h-5" tintColor={'white'}/>
               </View>
              </TouchableOpacity>
            </View>

            {/* Subtotal */}
            <View className="flex-row items-center gap-2">
              <Text>Subtotal:</Text>
              <ComicText text={`ksh ${product.price * product.quantity}`} />
            </View>
          </View>

          <View
            className="flex-row gap-2 self-center items-center"
            style={{
              width: width * 0.8,
            }}
          >
            {/* <----------------------add to cart----------------------> */}
            <TouchableOpacity 
              className="flex-1"
              activeOpacity={0.7}
            >
              <View className="p-2 rounded-full items-center justify-center border border-accentbg ">
                  <ComicText text={"Add to Cart "} style={"text-lg text-accentbg"} />
              </View>

            </TouchableOpacity>
            
            
            {/* <------------------------buy now------------------------> */}
            <TouchableOpacity 
              className="flex-1"
              activeOpacity={0.7}
            >
              <View className="p-2 rounded-full items-center justify-center bg-accentbg border border-accentbg ">
                  <ComicText text={"Buy Now"} style={"text-lg text-white"} />
              </View>

            </TouchableOpacity>
            
           
          </View>
          

          {/* Vendor Info Snippet */}
          <View className="h-[100px] p-4 bg-slate-200 gap-2 rounded-2xl">
            <ComicText text="Vendor Info:" style="text-lg" />

            <View className="flex-1 gap-2">
              <View className="flex-row items-center gap-2">
                <Text>Name:</Text>
                <ComicText text="Vendor Name" />
              </View>

              <TouchableOpacity activeOpacity={0.7} onPress={() => {}}>
                <View className="flex-row items-center gap-2">
                  <Image
                    source={icons.location}
                    tintColor="black"
                    className="w-5 h-5"
                  />
                  <ComicText
                    text={
                      location.length > 50
                        ? `${location.substring(0, 50).trim()}...`
                        : location
                    }
                  />
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* scheduled delivery */}
          <View>
            <TouchableOpacity activeOpacity={0.7} onPress={() => {}}>
              {/* <Button style={""} label={"Schedule Delivery"} /> */}
              <View className="p-2 bg-accentbg/80 self-center rounded-full items-center"
              // <View className="p-2 border border-gray-400 self-center rounded-full items-center"
                style={{
                  width: width*0.8
                }}
              >
                <ComicText text={"Schedule Delivery"} style="text-lg text-white" />
              </View>
            </TouchableOpacity>
          </View>

          <View>
            <Reviews/>
          </View>
          {/* Future: Delivery options, estimated delivery time, delivery cost */}
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default ProductDetails;
