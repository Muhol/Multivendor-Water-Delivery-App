
import { Stack } from "expo-router";
import "react-native-reanimated";
import "../global.css";
import { StatusBar, View } from "react-native";

function RootLayout() {

  return (
    <>
      <StatusBar backgroundColor={'transparent'} barStyle={'dark-content'} />
        <Stack
        screenOptions={{
          headerShown:false,
          animation: 'slide_from_right', // Options: 'fade', 'slide_from_right', 'slide_from_left', 'none'
          }}
        />
    </>
  );
}

export default RootLayout
