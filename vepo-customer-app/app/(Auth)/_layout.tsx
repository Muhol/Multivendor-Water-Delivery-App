// import { useAuth } from "@clerk/clek-expo";
import { Redirect, Stack } from "expo-router";
import {
  Dimensions,
  StatusBar,
  View,
} from "react-native";
import {
  ReanimatedLogLevel,
  configureReanimatedLogger,
} from "react-native-reanimated";
import { useAuth } from '@clerk/clerk-expo'
import { useEffect } from "react";
import * as WebBrowser from 'expo-web-browser'


configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false, // Reanimated runs in strict mode by default
});

const { width, height } = Dimensions.get("window");


export const useWarmUpBrowser = () => {
  useEffect(() => {
    // Preloads the browser for Android devices to reduce authentication load time
    // See: https://docs.expo.dev/guides/authentication/#improving-user-experience
    void WebBrowser.warmUpAsync()
    return () => {
      // Cleanup: closes browser when component unmounts
      void WebBrowser.coolDownAsync()
    }
  }, [])
}

// Handle any pending authentication sessions
WebBrowser.maybeCompleteAuthSession()




const Layout = () => {
  // <------------------------HOOKES------------------------->
  const { isSignedIn } = useAuth()

  // <-----------------------VARIABLES----------------------->
  const statusbarHieght = StatusBar.currentHeight || 50;

  // <-----------------------FUNCTIONS----------------------->
  useWarmUpBrowser()

  if (isSignedIn) {
    return <Redirect href={'/(screens)'} />
  }

  return (
    <>
      <StatusBar
        translucent={true}
        backgroundColor="transparent"
        barStyle="dark-content" // or "dark-content" depending on your UI
        animated={true}
      />

      <View
        className="absolute bg-white"
        style={{
          minHeight: height+statusbarHieght,
          minWidth: width,
        }}
      >
        <Stack
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right', // Options: 'fade', 'slide_from_right', 'slide_from_left', 'none'
        }}
        />
      </View>
    </>
  );
};

export default Layout;
