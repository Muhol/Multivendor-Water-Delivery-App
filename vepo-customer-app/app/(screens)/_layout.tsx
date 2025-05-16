import TabIcon from "@/components/ui/TabIcon";
import { Stack, usePathname, useRouter } from "expo-router";
import {
  Dimensions,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  View,
} from "react-native";
import {
  ReanimatedLogLevel,
  configureReanimatedLogger,
} from "react-native-reanimated";
import { SafeAreaProvider} from "react-native-safe-area-context";

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false, // Reanimated runs in strict mode by default
});

const { width, height } = Dimensions.get("window");

const Layout = () => {
  const router = useRouter();
  const path = usePathname();



  const active = (pathname: string) => {
    return pathname === path;
  };

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
        className="absolute "
        style={{
          minHeight: height+statusbarHieght,
          minWidth: width,
          paddingBottom: 55
        }}
      >
        <Stack
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        />
      </View>

      <SafeAreaView className=" w-full absolute bottom-0" style={{}}>
        <View className="z-50 bg-white border-t border-gray-100 shadow-2xl shadow-black w-full h-[55px] flex-row items-center ">
          <TouchableOpacity
            onPress={() => {
              router.push("/(screens)");
            }}
            className="flex-1"
          >
            <View className="h-full flex-1 items-center justify-center ">
              <TabIcon name={"home"} active={active("/")} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              router.push("/(screens)/Search");
            }}
            className="flex-1"
          >
            <View className="h-full flex-1 items-center justify-around ">
              <TabIcon name={"search"} active={active("/Search")} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              router.push("/(screens)/Orders");
            }}
            className="flex-1"
          >
            <View className="h-full flex-1 items-center justify-around ">
              <TabIcon name={"order"} active={active("/Orders")} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              router.push("/(screens)/Cart");
            }}
            className="flex-1"
          >
            <View className="h-full flex-1 items-center justify-around ">
              <TabIcon name={"cart"} active={active("/Cart")} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              router.push("/(screens)/Profile");
            }}
            className="flex-1"
          >
            <View className="h-full flex-1 items-center justify-around ">
              <TabIcon name={"profile"} active={active("/Profile")} />
            </View>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );
};

export default Layout;
