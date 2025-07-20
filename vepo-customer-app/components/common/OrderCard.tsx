import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useContext, useLayoutEffect, useState } from "react";
import ComicText from "../styled-components/custom-texts/ComicText";
import icons from "@/constants/icons/icons";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { UIThemeContext } from "@/context/ThemeContext";
import { format, parseISO } from 'date-fns';


type Props = {
  order?: any;
};

const OrderCard = ({ order }: Props) => {

  const {currentTheme} = useContext(UIThemeContext);
	const darkTheme = currentTheme === "dark"

  const orders = [1, 2, 3];
  const location =
    "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eaque excepturi veritatis";
  const pname = "10L Mineral Water skdjvnaubvakenrvaerv";

  // <-------------HOOKES-------------->
  const [showItems, setShowItems] = useState(false);
  const [action , setAction] = useState('')
  
  const setAct = () =>{
    if(order.order_status=="pending" && order.payment_status != "paid"){
      setAction('Cancel Order')
    }else if(order.order_status == "out for delivery"){
      setAction('Track Order')
    }else if(order.order_status == "completed"){
      setAction('Rate Delivery')
    }else if(order.order_status == "cancelled"){
      setAction('Re-Order')
    }else{
      return;
    }
  }
  // ANIMATIONS
  const height = useSharedValue<any>(0)
  const cardHeight = useSharedValue<any>(130)
  const opacity = useSharedValue(0)
  const display = useSharedValue<any>("none")

  const maxHeight = useSharedValue(130);

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    maxHeight: maxHeight.value,
  }));

  const ItemsAnimatedStyle = useAnimatedStyle(()=> ({
    height: height.value,
    opacity: opacity.value,
    display: display.value
  }))

  const itemsVisible = () => {
    height.value = withTiming(300, { duration: 300 }); // increase to something big enough
    maxHeight.value = withTiming(500, { duration: 300 }); // increase to something big enough
    opacity.value = withTiming(1, { duration: 300 });
  };
  
  const itemsInvisible = () => {
    height.value = withTiming(0, { duration: 300 });
    maxHeight.value = withTiming(130, { duration: 300 });
    opacity.value = withTiming(0, { duration: 300 });
    display.value = "none"; // optional, or skip this
  };
  
  
  // <-------------VARIABLES-------------->
  const createdAt: string = order.created_at
  const parsedDate = parseISO(createdAt);

  const dateStr = format(parsedDate, 'dd MMM yyyy'); // "18 Jul 2025"
  const timeStr = format(parsedDate, 'HH:mm');       // "16:45"

  useLayoutEffect(() => {
      setAct()
  },[])
    
  return (
    <Animated.View className={`flex-1 gap-2 ${darkTheme?"bg-gray-200/15":"bg-white"} rounded-xl p-4 transition-all duration-300`}
      style={[
        // cardAnimatedStyle,
        {
          // display: ""
        }
      ]}
    >

      {/* DATE  AND AMOUNT */}
      <View className="flex-row justify-between items-center gap-[50px]">
        <View className={`flex-row gap-3`}>
          <Text className={`text-lg font-semibold ${darkTheme?"text-white":""}`}>Date: </Text>
          <Text className={`text-lg  ${darkTheme?"text-white":""}`}>{dateStr}</Text>
        </View>
        <View className={`flex-row gap-3`}>
          <Text className={`text-lg font-semibold ${darkTheme?"text-white":""}`}>Total Amt: Ksh </Text>
          <Text className={`text-lg  ${darkTheme?"text-white":""}`}>{order.total_amount}</Text>
        </View>
      </View>
      {/* ORDER STATUS AND CUSTOMER ACTIONS */}
      <View className={`flex-row justify-between gap-5 `}>
        <View className={`flex-row gap-3`}>
          <Text className={`text-lg font-semibold ${darkTheme?"text-white":""}`}>OrderStatus: </Text>
          <Text className={`text-lg  ${darkTheme?"text-white":""}`}>{order.order_status}</Text>
        </View>
        {!showItems && (
          <View className="">
            <Text className={`${darkTheme?"text-white":"text-black"} text-lg font-semibold`}>{order.order_item.length} items</Text>
          </View>
        )}
        {/* Customer actions */}
        
      </View>
      <View className="flex-row justify-between items-center gap-[50px]">
        <View className={`flex-row gap-3`}>
          <Text className={`text-lg font-semibold ${darkTheme?"text-white":""}`}>Payment Status: </Text>
          <Text className={`text-lg  ${darkTheme?"text-white":""}`}>{order.payment_status}</Text>
        </View>
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
      {/* <View className="gap-1 bg-accentbg/5 rounded-lg p-2">
        <Text className={`font-semibold  text-lg ${darkTheme?"text-white":"text-black"}`}>Vendor Details </Text>

        PHONE NUMBER
        <View className="flex-row gap-1 items-center">
          <Text className={`font-semibold  text-lg ${darkTheme?"text-white":"text-black"}`}>Phone: </Text>
          <ComicText text={`${"0712342554"}`} style={` ${darkTheme?"text-white":"text-black"}`} />
        </View>

        LOCATION
        <TouchableOpacity activeOpacity={0.7}>
          <View className="flex-row gap-1 items-center">
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
      </View> */}
      {/* ORDER ITEMS */}
      {showItems && (
        <Animated.View
          style={[
          ]}
        >
              {order?.order_item.map((item: any, index: any) => {
                return (
                  <TouchableOpacity
                    key={index}
                    activeOpacity={0.6}
                  >
                    <View
                      className="p-2 flex-row gap-2 flex-1 rounded-xl "
                    >
                      {/* IMAGE  */}
                      <View className="h-[90px] w-[90px]">
                        <Image
                          source={{uri: item.product.image_url}}
                          className="w-full h-full rounded-lg"
                        />
                      </View>
                      {/* ORDER ITEM DETAILS: Product-name, quantity, price per unit, Subtotal per item*/}
                      <View className="flex-1 gap-2 justify-center ">
                        {/* product name */}
                        <ComicText
                          text={`${
                            item.product.name.length > 30
                              ? item.product.name.substring(0, 30).trim() + "..."
                              : item.product.name
                          }`}
                          style={darkTheme?"text-white":"text-black"}
                        />
                        <View className="flex-row gap-5 justify-between items-end">
                          <View className="">
                            <View className={`flex-row gap-3`}>
                              <Text className={`text-lg font-semibold ${darkTheme?"text-white":""}`}>Qty: </Text>
                              <Text className={`text-lg  ${darkTheme?"text-white":""}`}>{item.quantity}</Text>
                            </View>
                            <View className={`flex-row gap-3`}>
                              <Text className={`text-lg font-semibold ${darkTheme?"text-white":""}`}>Price: Ksh </Text>
                              <Text className={`text-lg  ${darkTheme?"text-white":""}`}>{item.price}</Text>
                            </View>
                          </View>
                          <View className="items-end">
                            <Text className={`text-lg font-semibold ${darkTheme?"text-white":""}`}>Subtotal</Text>
                            <Text className={`text-lg  ${darkTheme?"text-white":""}`}>Ksh {item.Subtotal}</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
              <View className="gap-1">
              {/* Delivery Fee */}
              <View className="flex-row gap-2 items-end">
                <Text className={`font-semibold ${darkTheme?"text-white":"text-black"}`}>Delivery fee:</Text>
                <ComicText text={`Ksh ${50}`} style={darkTheme?"text-white":"text-black"} />
              </View>
              {/* total amount */}
              <View className="flex-row gap-2 items-end">
                <Text className={`font-semibold ${darkTheme?"text-white":"text-black"}`}>Total Amt:</Text>
                <ComicText text={`Ksh ${order.total_amount}`} style={darkTheme?"text-white":"text-black"} />
              </View>
            </View>
        </Animated.View>
      )}
      
      {!showItems ? (
        <>

          <TouchableOpacity
            className=""
            activeOpacity={0.8}
            onPress={() => {
              setShowItems(true);
              itemsVisible()
            }}
          >
            <View className="py-3 pr-3">
              {/* <ComicText text={"See Order Details"} style={"text-accentbg"} /> */}
              <Text className={`text-lg font-semibold text-accentbg`}>See Order Details</Text>
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
              itemsInvisible()
            }}
          >
            <View className="py-3 pr-3">
              {/* <ComicText text={"See less..."} style={" text-accentbg "} /> */}
              <Text className={`text-lg font-semibold text-accentbg`}>See less...</Text>

            </View>
          </TouchableOpacity>
        </>
      )}
    </Animated.View>
  );
};

export default OrderCard;




