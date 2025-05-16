
// export const unstable_settings = {
//   animation: "slide_from_right", // Applies slide animation when navigating to this screen
// };

import { View, Text, Image, TouchableOpacity, StatusBar } from "react-native";
import React from "react";
// import { StatusBar } from "expo-status-bar";
import { Dimensions } from "react-native";
import { useRouter } from "expo-router";
import ComicText from "@/components/styled-components/custom-texts/ComicText";
// import {LinearGradient} from "expo-linear-gradient"; 

const { width, height } = Dimensions.get("window");

export default function Auth() {
  const router = useRouter(); 

  return (
    <View
      className="flex-1 justify-center items-center gap-6 bg-white "
    >
      <StatusBar  backgroundColor={"transparent"} />

      <Image
        source={require("../../assets/images/vepo-white.jpg")}
        className="w-screen h-[39%] mix-blend-multiply "
      />

      <TouchableOpacity 
        activeOpacity={0.6}
        onPress={() => {
           router.push('/(Auth)/sign-in/screen');
        }}
      >  
        <View 
          className="border border-accentbg w-[300px] justify-center items-center rounded-[30px] py-[7px]"
          style={{
            width: width*0.75
          }}
        >
          {/* <Text className="text-accentbg font text-3xl">LOGIN</Text> */}
          <ComicText text={"LOGIN"} style={"text-accentbg font text-2xl"} />
        </View>
      </TouchableOpacity>

      <TouchableOpacity 
        activeOpacity={0.6}
        onPress={() =>{
          router.push("/sign-up/screen")
        }}
      >
        <View 
          className="bg-accentbg w-[300px] justify-center items-center rounded-[30px] py-[9px]"
          style={{
            width: width*0.75
          }}
        >
          {/* <Text className="text-white font-semibold text-2xl">SIGN UP</Text> */}
          <ComicText text={"SIGN UP"} style={"text-white font-semibold text-2xl"} />
        </View>
      </TouchableOpacity>

      {/* Or Login with */}
      <View className="flex flex-row items-center gap-4 my-4">
        <View className={"border-b border-gray-400 w-[20%]"}></View>
        <Text className="text-gray-400">Or Login with</Text>
        <View className={"border-b border-gray-400 w-[20%]"}></View>
      </View>

      {/* Sign in with Google */}
      <TouchableOpacity
        activeOpacity={0.6}
      >
        <View 
          className="flex-row gap-4 w-[260px] h-[40px] rounded-[30px] border border-gray-200 bg-slate-50 items-center justify-center"
          style={{
            width: width*0.6
          }}
        >
          <Image
            source={require("../../assets/images/google.png")}
            className="w-[30px] h-[30px] rounded-full"
          />
          <ComicText text={"Sign in with Google"} style={"text-lg"} />

        </View>
      </TouchableOpacity>
    </View>
  );
}
