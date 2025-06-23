import { View, Text, TouchableOpacity } from "react-native";
import React, { useContext } from "react";
import { Image } from "react-native";
import ComicText from "../styled-components/custom-texts/ComicText";
import { UIThemeContext } from "@/context/ThemeContext";
import ApiRoutes from "@/API/routes/ApiRoutes";
import { useAuth } from "@clerk/clerk-expo";
import Context from "@/context/context";

type Props = {
  data? : any
  // loaded : boolean
  func : () => void
};

const CartItem = ({data, func}: Props) => {
  // <--------------------HOOKS--------------------->
  const {currentTheme} = useContext(UIThemeContext);
	const darkTheme = currentTheme === "dark"
  const { getToken } = useAuth()
  const { fetchCart } = useContext(Context)

  // <-------------------STATES--------------------->


  // <-------------------VARIABLES--------------------->

  // <-------------------FUNCTIONS--------------------->
  // API CALLS
  // change quantity of cart item 
  const ChangeQuantity = async (type: string ) => {
    const token  = await getToken()
    const payload = {
      type: type,
      id: data?.id
    }
    try {
      const apiCall = await fetch(ApiRoutes.ChangeCartItemQuantity.path , {
        method : ApiRoutes.ChangeCartItemQuantity.method,
        headers : {
          "Authorization" : `Bearer ${token}`,
          "Content-Type" : "Application/json"
        },
        body : JSON.stringify(payload)
      })
      const response = await apiCall.json()
    } catch (error: any) {
      console.log(error.message)
    }finally{
      func()
      fetchCart()
    }
  }

  // remove item from cart
  const DeleteItem = async () => {
    const token  = await getToken()
    const payload = {
      id: data?.id
    }
    try {
      const apiCall = await fetch(ApiRoutes.DeleteCartItem.path , {
        method : ApiRoutes.DeleteCartItem.method,
        headers : {
          "Authorization" : `Bearer ${token}`,
          "Content-Type" : "Application/json"
        },
        body : JSON.stringify(payload)
      })
      const response = await apiCall.json()
      fetchCart()
      console.log(response)
    } catch (error: any) {
      console.log(error.message)
    }finally{
      func()
    }
  }

  return (
    <View className={` p-2 rounded-xl `}>
      {/* <-------------------------------<CART ITEM>-------------------------------> */}
      <View className="flex-row gap-2 py-2 items-center justify-between">
        <View className="flex-row gap-2 items-center">
          {/* <--------------------<left>--------------------> */}
          <View>
            <Image
              source={{uri: data?.product.image_url}}
              className="w-[90px] h-[90px] rounded-lg"
              resizeMode="contain"
            />
          </View>
          {/* <--------------------<middle>--------------------> */}
          <View className=" gap-1 ">
            <Text className={`${darkTheme?'text-white':'text-black'}`}>{`${data?.product.name.length > 25 ? data?.product.name.substring(0,25).trim()+"..." : data?.product.name}`}</Text>
            <ComicText text={`Ksh ${data?.product.price - data?.product.discount}`} style={darkTheme?"text-lg text-white":"text-lg text-black"} />

            {/* <--------<QUANTITY SECTION>--------> */}
            <View className="flex-row gap-3 items-center">
              {/* DECREASE */}
              <TouchableOpacity activeOpacity={0.6} onPress={() => {
                ChangeQuantity("decrease")
              }}>
                <View className="p-2 rounded-xl ">
                  <Image
                    source={require("../../assets/icons/minus-black.png")}
                    className="w-5  h-5 rounded-full"
                    tintColor={darkTheme?"white":"black"}
                  />
                </View>
              </TouchableOpacity>

              <ComicText text={`${data?.quantity}`} style={darkTheme?"text-white":"text-black"} />

              {/* INCREASE */}
              <TouchableOpacity activeOpacity={0.6} onPress={() => {
                ChangeQuantity("increase")
              }}>
                <View className="p-2 rounded-xl ">
                  <Image
                    source={require("../../assets/icons/add-black.png")}
                    className="w-5  h-5 rounded-full"
                    tintColor={darkTheme?"white":"black"}
                  />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* <--------------------<right>--------------------> */}
        <View className=" gap-6 items-end ">
          {/* subtotal */}
          <ComicText text={`Ksh ${data?.price * data?.quantity}`} style={darkTheme?"text-lg text-white":"text-lg text-black"}/>
          {/* <--------<REMOVE BUTTON>--------> */}
          <TouchableOpacity 
            activeOpacity={0.6}
            onPress={() => {
              DeleteItem()
            }}
          >
              <View className="flex-row gap-1 h-7 items-center">
                <Image
                source={require('../../assets/icons/delete-black.png')}
                className="w-6 h-6 rounded-full"
                tintColor={darkTheme?'white':'black'}
                />
              </View>
          </TouchableOpacity>
        </View>
      </View>

    </View>
  );
};

export default CartItem;
