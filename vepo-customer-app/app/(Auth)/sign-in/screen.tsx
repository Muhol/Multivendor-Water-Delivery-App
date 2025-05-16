// export const unstable_settings = {
//   animation: "slide_from_right", // Applies slide animation when navigating to this screen
// };

import {
  View,
  Text,
  Dimensions,
  Image,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  StatusBar,
  ImageBackground,
} from "react-native";
import React, { useState } from "react";
import ComicText from "@/components/styled-components/custom-texts/ComicText";
import InputFeild from "@/components/ui/InputFeild";
import { Link, useRouter } from "expo-router";
import Button from "@/components/ui/Button";
import images from "@/constants/images/images";
import { LinearGradient } from "expo-linear-gradient";
// import keyboard

const { width, height } = Dimensions.get("window");

export default function SignIn() {
  // <------------<hooks>------------->
  const router = useRouter();
  // <------------<hooks-setters>------------->
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const statusBarHeight = StatusBar.currentHeight || 0

  return (
    <>
      <StatusBar backgroundColor={"#00000000"} barStyle={"dark-content"} />

      <View
        className="bg-primarybg"
        style={{
          flex: 1,
          height : height + statusBarHeight
        }}
      >
        <KeyboardAvoidingView
          behavior="padding"
          style={{
            flex: 1,
            height : height + statusBarHeight
          }}
        >
          <ScrollView 
            className="flex-1 w-full" 
            overScrollMode="never"
            showsVerticalScrollIndicator={false}
            contentContainerStyle= {{
              paddingBottom: 100,
              flex: 1,
              height : height + statusBarHeight
            }}
          >
            <ImageBackground
              source={images.authBgLight}
              style={{
                height: height * 0.35,
                marginBottom: -(height * 0.1),
              }}
            >
              <LinearGradient 
                className="w-full h-full "
                colors={['transparent', '#f0f0f0']}
              >

              </LinearGradient>
            </ImageBackground>
            <View className="w-full gap-3 px-6">
              <View className=" w-[90%] self-center">
                <ComicText
                  // text={"Welcome 👋"}
                  text={"Sign In to Your Account"}
                  style={"text-[30px] text-black"}
                />
              </View>
              <View className="py-[50px] gap-[20px] items-center">
              
                <InputFeild
                  label={"Email"}
                  type={""}
                  placeholder={"Enter Your Email"}
                  set={(text: string) => {}}
                />
                <InputFeild 
                  label={"Password"} 
                  type={"password"} 
                  placeholder={"Enter Your Password"} 
                  set={(text: string) => {}}
                />
                <View className="flex-row items-center justify-end w-[90%]">
                  <Link href={"/(Auth)/forgot-password/screen"} className="group">
                    <Text className="text-accenttxt group-active:text-gray-400">
                      Forgot Password?
                    </Text>
                  </Link>
                </View>
                <TouchableOpacity
                  className="w-full items-center"
                  activeOpacity={0.7}
                  onPress={() => {
                    router.push("/(screens)");
                  }}
                >
                  <View className="w-[90%] h-[50px] items-center justify-center bg-accentbg rounded-[10px]" >
                    {/* <ComicText text={"Log In"} style="text-white text-2xl" /> */}
                    <Text className="text-white text-2xl font-semibold">Log In</Text>
                  </View>
                </TouchableOpacity>
                <View className="flex flex-row items-center gap-4 my-0">
                  <View className={"border-b border-gray-400 w-[20%]"}></View>
                  <Text className="text-gray-400">Or </Text>
                  <View className={"border-b border-gray-400 w-[20%]"}></View>
                </View>
                <TouchableOpacity
                  activeOpacity={0.7}
                >
                  <View className="flex-row gap-4 w-[260px] h-[40px] rounded-[30px] shadow-xl bg-slate-50 items-center justify-center">
                    <Image
                      source={require("../../../assets/images/google.png")}
                      className="w-[40px] h-[40px] rounded-full"
                    />
                    <ComicText text={"Sign in with Google"} />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            <View className="flex-row gap-2 items-center justify-center">
              <ComicText text={"Don't Have an Account?"} />
              <Link href={"/(Auth)/sign-up/screen"} className="group">
                <View className="w-[50px] h-7 items-center justify-center">
                  <ComicText
                    text={"Sign Up"}
                    style={"text-accenttxt group-active:text-gray-400"}
                  />
                </View>
              </Link>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </>
  );
}
