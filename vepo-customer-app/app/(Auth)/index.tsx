
// export const unstable_settings = {
//   animation: "slide_from_right", // Applies slide animation when navigating to this screen
// };

import { View, Text, Image, TouchableOpacity, StatusBar } from "react-native";
import React, { useCallback, useState } from "react";
// import { StatusBar } from "expo-status-bar";
import { Dimensions } from "react-native";
import { useRouter } from "expo-router";
import ComicText from "@/components/styled-components/custom-texts/ComicText";
import { useWarmUpBrowser } from "./_layout";
import { useSSO } from "@clerk/clerk-expo";
// import {LinearGradient} from "expo-linear-gradient"; 
import * as AuthSession from 'expo-auth-session'

const { width, height } = Dimensions.get("window");

export default function Auth() {
  // <-----------------------HOOKES----------------------->
  const router = useRouter(); 
  const { startSSOFlow } = useSSO()
  
  // <-----------------------STATES----------------------->
	const [OAuthLoading, setOAuthLoading] = useState(false);

  // <----------------------VARIABLES--------------------->
  useWarmUpBrowser()
  // <----------------------FUNCTIONS--------------------->

  const onPress = useCallback(async () => {
		setOAuthLoading(true)
    try {
      // Start the authentication process by calling `startSSOFlow()`
      const { createdSessionId, setActive, signIn, signUp } = await startSSOFlow({
        strategy: 'oauth_google',
        // For web, defaults to current path
        // For native, you must pass a scheme, like AuthSession.makeRedirectUri({ scheme, path })
        // For more info, see https://docs.expo.dev/versions/latest/sdk/auth-session/#authsessionmakeredirecturioptions
        redirectUrl: AuthSession.makeRedirectUri({
          scheme: 'myapp',
          path: '(Auth)'
        }),
      })

      // If sign in was successful, set the active session
      if (createdSessionId) {
        setActive!({ session: createdSessionId })
        .then(()=> {
          router.push("/(screens)")
        })
      } else {
        // If there is no `createdSessionId`,
        // there are missing requirements, such as MFA
        // Use the `signIn` or `signUp` returned from `startSSOFlow`
        // to handle next steps
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }finally{
			setOAuthLoading(false)
		}
  }, [])

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
           router.replace('/(Auth)/sign-in/screen');
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
        onPress={()=>{
          console.log("pressed")
          onPress();
        }}
      >
        <View 
          className="flex-row gap-4 w-[260px] h-[40px] rounded-[30px] border border-gray-50 shadow-2xl bg-slate-50 items-center justify-center"
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
