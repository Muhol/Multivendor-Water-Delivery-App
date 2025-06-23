import ApiRoutes from "@/API/routes/ApiRoutes";
import TabIcon from "@/components/ui/TabIcon";
import { UIThemeContext } from "@/context/ThemeContext";
import Context from "@/context/context";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { isLoaded } from "expo-font";
import { Redirect, Stack, usePathname, useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import {
  Dimensions,
  SafeAreaView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
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
	// <--------------------HOOKES------------------->
  const {currentTheme} = useContext(UIThemeContext);
	const darkTheme = currentTheme === "dark"  
  const router = useRouter();
  const path = usePathname();
  const { isSignedIn, getToken } = useAuth()
  const user = useUser()
  // const {getToken} = useAuth()
	// console.log(user)
	// console.log(user.user?.imageUrl)
  
	// <--------------------HOOKES------------------->
  const [Cart, setCart] = useState<any>()
  
	// <------------------FUNCTIONS------------------>
  const active = (pathname: string) => {
    return pathname === path;
  };

  // API CALLS
  const fetchCart = async ()=>{
    const token = await getToken()
    try {
      const apiCall = await fetch(ApiRoutes.GetCart.path, {
        method: ApiRoutes.GetCart.method,
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "Application/json"
        }
      })

      const response = await apiCall.json()
      setCart(response)
      // console.log(response)
    } catch (error: any) {
      console.log(error.message)
    }
  }
  
  // <------------------VARIABLES------------------>
  const statusbarHieght = StatusBar.currentHeight || 50;
  
  if (isSignedIn === false) {
    return <Redirect href={'/(Auth)'} />
  }

  useEffect(() =>{
    fetchCart()
  },[])

  return (
    <>
      <StatusBar
        translucent={true}
        backgroundColor="transparent"
        barStyle="dark-content" // or "dark-content" depending on your UI
        animated={true}
      />

      <View
        className={`absolute ${darkTheme? "bg-black":""}`} 
        style={{
          minHeight: height+statusbarHieght,
          minWidth: width,
          paddingBottom: 55
        }}
      >
				<Context.Provider value={{ fetchCart }}>
          <Stack
            screenOptions={{
              headerShown: false,
              animation: 'slide_from_right',
              statusBarAnimation: "slide"
            }}
          />
        </Context.Provider>
      </View>

      <SafeAreaView className=" w-full absolute bottom-0" style={{}}>
        <View className={`z-50 ${ darkTheme? "bg-black border-t border-black" : "bg-white border-t border-gray-100"}  shadow-2xl shadow-black w-full h-[55px] flex-row items-center `}>
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
              
              <TabIcon name={"cart"} active={active("/Cart")} count={Cart?.items_count} />
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
