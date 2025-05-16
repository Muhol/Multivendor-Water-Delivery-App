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

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false, // Reanimated runs in strict mode by default
});

const { width, height } = Dimensions.get("window");

const Layout = () => {
  const statusbarHieght = StatusBar.currentHeight || 50;
  

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
