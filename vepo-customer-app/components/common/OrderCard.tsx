import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useContext, useLayoutEffect, useState } from "react";
import ComicText from "../styled-components/custom-texts/ComicText";
import icons from "@/constants/icons/icons";
import Animated from "react-native-reanimated";
import { UIThemeContext } from "@/context/ThemeContext";

type Props = {
  order?: any;
};

const OrderCard = ({ order }: Props) => {

  const {currentTheme} = useContext(UIThemeContext);
	const darkTheme = currentTheme === "dark"

  const Date = "02/03/2025";
  const orders = [1, 2, 3];
  const location =
    "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eaque excepturi veritatis";
  const pname = "10L Mineral Water skdjvnaubvakenrvaerv";

  // <-------------HOOKES-------------->
  const [showItems, setShowItems] = useState(false);
  const [action , setAction] = useState('')

  const setAct = () =>{
    if(order=="pending"){
      setAction('Cancel Order')
    }else if(order == "out for delivery"){
      setAction('Track Order')
    }else if(order == "completed"){
      setAction('Rate Delivery')
    }else if(order == "cancelled"){
      setAction('Re-Order')
    }else{
      return;
    }
  }

  useLayoutEffect(() => {
      setAct()
  },[])
    
  return (
    <Animated.View className={`flex-1 gap-2 ${darkTheme?"bg-gray-200/15":"bg-white"} rounded-xl p-4 transition-all duration-300`}>
      {/* DATE  AND AMOUNT */}
      <View className="flex-row justify-between items-center gap-[50px]">
        <ComicText text={`Date: ${Date}`} style={darkTheme?"text-white":""} />
        <ComicText text={`Total Amt: Ksh ${1000}`} style={darkTheme?"text-white":"text-lg"} />
      </View>
      {/* ORDER STATUS AND CUSTOMER ACTIONS */}
      <View className={`flex-row justify-between gap-5 `}>
        {/* Status */}
        <View className="gap-2 flex-row items-center">
          <Text className={`font-semibold ${darkTheme?"text-white":""}`}>Status:</Text>
          <ComicText text={`${order}`} style={darkTheme?"text-white capitalize": "capitalize"} />
        </View>
        {/* Customer actions */}
        {action != "" &&
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
            }}
          >
            <View className={`py-2 px-3 border rounded-lg ${darkTheme?"border-white":"border-black"}`}>
              <ComicText text={action} style={darkTheme?"text-white":"text-black"} />
            </View>
          </TouchableOpacity>
        }
      </View>
      {/* Re-Order */}
      {order ==="completed" && 
        <TouchableOpacity 
          className=""
          activeOpacity={0.6}
        >
          <View className={`py-2 px-3 border rounded-lg items-center ${darkTheme?"border-white":"border-black"}`}>
              <Text className={`font-semibold  text-lg ${darkTheme?"text-white":"text-black"}`}>Re-Order</Text>
          </View>
        </TouchableOpacity>
      }
      {/* VENDOR DETAILS */}
      <View className="gap-1 bg-accentbg/5 rounded-lg p-2">
        <Text className={`font-semibold  text-lg ${darkTheme?"text-white":"text-black"}`}>Vendor Details </Text>

        {/* PHONE NUMBER */}
        <View className="flex-row gap-1 items-center">
          <Text className={`font-semibold  text-lg ${darkTheme?"text-white":"text-black"}`}>Phone: </Text>
          <ComicText text={`${"0712342554"}`} style={` ${darkTheme?"text-white":"text-black"}`} />
        </View>

        {/* LOCATION */}
        <TouchableOpacity activeOpacity={0.7}>
          <View className="flex-row gap-1 items-center">
            {/* <Text className='font-semibold text-lg'>Location: </Text> */}
            <Image source={icons.location} className="w-6 h-6" tintColor={darkTheme?"white":"black"} />
            <ComicText
              text={
                location.length > 50
                  ? location.substring(0, 50).trim() + "..."
                  : location
              }
              style={`${darkTheme?"text-white":"text-black"}`}
            />
          </View>
        </TouchableOpacity>
      </View>
      {/* ORDER ITEMS */}
      {showItems &&
        orders.map((item, index) => {
          return (
            <View
              key={index}
              className="p-2 flex-row gap-2 flex-1 rounded-xl "
            >
              {/* IMAGE  */}
              <View className="h-[90px] w-[90px]">
                <Image
                  source={require("../../assets/prop-images/Product_Aqualife_100C_Refill5gal.jpg")}
                  className="w-full h-full rounded-lg"
                />
              </View>
              {/* ORDER ITEM DETAILS: Product-name, quantity, price per unit, Subtotal per item*/}
              <View className="flex-1 gap-2 justify-center ">
                {/* product name */}
                <ComicText
                  text={`${
                    pname.length > 30
                      ? pname.substring(0, 30).trim() + "..."
                      : pname
                  }`}
                  style={darkTheme?"text-white":"text-black"}
                />
                <View className="flex-row gap-5 justify-between items-end">
                  <View className="">
                    <ComicText text={`Qty: ${3}`} style={` text-lg ${darkTheme?"text-white":"text-black"}`} />
                    <ComicText text={`Price: Ksh ${100}`} style={darkTheme?"text-white":"text-black"} />
                  </View>
                  <View className="items-end">
                    <ComicText text={"Subtotal"} style={`text-lg ${darkTheme?"text-white":"text-black"}`}/>
                    <ComicText text={` Ksh ${300}`} style={darkTheme?"text-white":"text-black"} />
                  </View>
                </View>
              </View>
            </View>
          );
        })}
      {showItems && (
        <>
          {/* DELIVERY DETAILS: Location, Delivery fee, Payment method  */}
          <View className="gap-1">
            {/* Delivery Fee */}
            <View className="flex-row gap-2 items-end">
              <Text className={`font-semibold ${darkTheme?"text-white":"text-black"}`}>Delivery fee:</Text>
              <ComicText text={`Ksh ${200}`} style={darkTheme?"text-white":"text-black"} />
            </View>
            {/* Location */}
            <TouchableOpacity className="" activeOpacity={0.7}>
              <View className="flex-row gap-2 items-center">
                <Image source={icons.location} className="w-6 h-6" tintColor={darkTheme?"white":"black"} />
                <ComicText
                  text={`${
                    location.length > 50
                      ? location.substring(0, 50).trim() + "..."
                      : location
                  } `}
                  style={darkTheme?"text-white":"text-black"}
                />
              </View>
            </TouchableOpacity>
            {/* total amount */}
            <View className="flex-row gap-2 items-end">
              <Text className={`font-semibold ${darkTheme?"text-white":"text-black"}`}>Total Amt:</Text>
              <ComicText text={`Ksh ${200}`} style={darkTheme?"text-white":"text-black"} />
            </View>
          </View>
        </>
      )}
      {!showItems ? (
        <>
          <View className="">
            <ComicText text={`${orders.length} items`} style={darkTheme?"text-white":"text-black"}/>
          </View>
          <TouchableOpacity
            className=""
            activeOpacity={0.8}
            onPress={() => {
              setShowItems(true);
            }}
          >
            <View className="py-3 pr-3">
              <ComicText text={"See Order Details"} style={"text-accentbg"} />
            </View>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <TouchableOpacity
            className=""
            activeOpacity={0.8}
            onPress={() => {
              setShowItems(false);
            }}
          >
            <View className="py-3 pr-3">
              <ComicText text={"See less..."} style={" text-accentbg "} />
            </View>
          </TouchableOpacity>
        </>
      )}
    </Animated.View>
  );
};

export default OrderCard;




