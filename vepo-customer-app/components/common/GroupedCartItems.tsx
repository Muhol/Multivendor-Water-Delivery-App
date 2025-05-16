import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Image } from "react-native";
import ComicText from "../styled-components/custom-texts/ComicText";
import CartItem from "./CartItem";

type Props = {};

const GroupedCartItems = (props: Props) => {
  // DUMMY DATA
  const checked = true;
  const name = "20 ltr dasani Refill dveowpv oewpmcweomc ecwmopmvn";
  return (
    <View className={` p-2 rounded-xl `}>
    {/* <View className={`bg-accentbg/10 p-2 rounded-xl `}> */}
      {/* <---------<TOP [NAME OF THE VENDOR AS A LINK TO THE VENDORS SHOP]>---------> */}
      {/* <View className="flex-row py-2 gap-2 items-center justify-between border-b border-accentbg/20">
        <View className="flex-row gap-2 items-center ">
          <Image
            source={require("../../assets/icons/shop-black.png")}
            className="w-5 h-5"
            tintColor={"orange"}
          />
          <ComicText text={`${"Joye's shop"}`} style="" />
        </View>
        <View
          className={`w-6 h-6 rounded-full  ${
            checked ? "bg-accentbg/55" : "bg-white"
          }`}
        >
          <Image
            source={require("../../assets/icons/checked-black.png")}
            className="w-full h-full"
            tintColor={checked ? "white" : "black"}
          />
        </View>
      </View> */}
      {/* <-------------------------------<CART ITEM>-------------------------------> */}
      <View className="flex-row gap-2 py-2 items-center justify-between">
        <View className="flex-row gap-2 items-center">
          {/* <--------------------<left>--------------------> */}
          <View>
            <Image
              source={require("../../assets/prop-images/Product_Aqualife_100C_Refill5gal.jpg")}
              className="w-[90px] h-[90px] rounded-lg"
              resizeMode="contain"
            />
          </View>
          {/* <--------------------<middle>--------------------> */}
          <View className=" gap-1 ">
            {/* <ComicText text={`${name.length > 25 ? name.substring(0,25).trim()+"..." : name}`} style="text-lg" /> */}
            <Text>{`${name.length > 25 ? name.substring(0,25).trim()+"..." : name}`}</Text>
            <ComicText text={`Ksh ${"10.99"}`} style="text-lg" />

            {/* <--------<QUANTITY SECTION>--------> */}
            <View className="flex-row gap-3 items-center">
              {/* DECREASE */}
              <TouchableOpacity activeOpacity={0.6} onPress={() => {}}>
                <View className="p-2 rounded-xl ">
                  <Image
                    source={require("../../assets/icons/minus-black.png")}
                    className="w-5  h-5 rounded-full"
                    tintColor={"black"}
                  />
                </View>
              </TouchableOpacity>

              <ComicText text={`${"1"}`} style="" />

              {/* INCREASE */}
              <TouchableOpacity activeOpacity={0.6} onPress={() => {}}>
                <View className="p-2 rounded-xl ">
                  <Image
                    source={require("../../assets/icons/add-black.png")}
                    // source={require('')}
                    className="w-5  h-5 rounded-full"
                    tintColor={"black"}
                  />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* <--------------------<right>--------------------> */}
        <View className=" gap-6 items-end  ">
          {/* subtotal */}
          <ComicText text={`Ksh ${"10.99"}`} style="text-lg"/>
          {/* <--------<REMOVE BUTTON>--------> */}
          <TouchableOpacity 
          activeOpacity={0.6}
          onPress={() => {}}
          >
              <View className="flex-row gap-1 h-7 items-center g-black">
             
                <Image
                source={require('../../assets/icons/delete-black.png')}
                className="w-6 h-6 rounded-full"
                tintColor={'black'}
                />
              </View>
          </TouchableOpacity>
        </View>
      </View>

    </View>
  );
};

export default GroupedCartItems;
