import ApiRoutes from "@/API/routes/ApiRoutes";
import TabIcon from "@/components/ui/TabIcon";
import { UIThemeContext } from "@/context/ThemeContext";
import Context from "@/context/context";
import { useAuth } from "@clerk/clerk-expo";
import { Redirect, Stack, usePathname, useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import {
  Dimensions,
  StatusBar,
  TouchableOpacity,
  View,
} from "react-native";
import {
  ReanimatedLogLevel,
  configureReanimatedLogger,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { Tabs } from "expo-router";
import icons from "@/constants/icons/icons";
import { BlurView } from "expo-blur";
import type { BottomTabNavigationOptions } from "@react-navigation/bottom-tabs";



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
  
	// <--------------------STATES------------------->
  const [Cart, setCart] = useState<any>()
  const [User, setUser] = useState<any>()
  
	// <------------------FUNCTIONS------------------>
  const active = (pathname: string) => {
    return pathname === path;
  };

  // API CALLS
  const fetchCart = async ()=>{
    const token = await getToken()
    
    // console.log(payload)
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
    } catch (error: any) {
    }
  }
  const fetchUserDetails = async ()=>{
    const token = await getToken()
    try {
      const apiCall = await fetch(ApiRoutes.GetUserDetails.path, {
        method: ApiRoutes.GetUserDetails.method,
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "Application/json"
        }
      })

      const response = await apiCall.json()
      setUser(response)
      // console.log(response)
    } catch (error: any) {
    }
  }
  
  // <------------------VARIABLES------------------>
  const statusbarHieght = StatusBar.currentHeight || 0;
  
  
  useEffect(() =>{
    if(isSignedIn){
      fetchCart()
      fetchUserDetails()
    }
  },[])
  
  if (isSignedIn === false) {
    return <Redirect href={'/(Auth)'} />
  }
  return (
      <View
        className={`flex-1 ${darkTheme? "bg-black":""}`} 
        style={[{
          minWidth: width,
        }
      ]}
      >

				<Context.Provider value={{ fetchCart, fetchUserDetails, User }}>
          <Stack
            screenOptions={{
              headerShown: false,
              animation: 'slide_from_right',
              statusBarAnimation: "slide"
            }}
          />
        
        </Context.Provider>

        <View className={`bg-transparent items-center px-5 pb-2 w-full absolute bottom-0`}>
          <View className={`z-50 rounded-full px-3 ${ darkTheme? "bg-black/90 border-2 border-black" : "bg-white/95 border-2 border-white"}  shadow-2xl shadow-black w-full max-w-[350px] h-[60px] flex-row justify-between items-center `}>
            <TouchableOpacity
              onPress={() => {
                router.push("/(screens)");
              }}
              // className="flex-1"
            >
              <View className="h-full flex-1 items-center justify-center ">
                <TabIcon name={"home"} active={active("/")} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                router.push("/(screens)/Search");
              }}
            >
              <View className="h-full flex-1 items-center justify-around ">
                <TabIcon name={"search"} active={active("/Search")} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                router.push("/(screens)/Cart");
              }}
            >
              <View className="h-full flex-1 items-center justify-around ">
                
                <TabIcon name={"cart"} active={active("/Cart")} count={Cart?.items_count} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                router.push("/(screens)/Orders");
              }}
            >
              <View className="h-full flex-1 items-center justify-around ">
                <TabIcon name={"order"} active={active("/Orders")} />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>

    //   <Context.Provider value={{ fetchCart, fetchUserDetails, User }}>
    //     <Tabs screenOptions={{
    //       headerShown: false,
    //       tabBarShowLabel: false,
    //       tabBarStyle :{
    //         position: "absolute",
    //         // bottom: 10,
    //         // marginHorizontal: 15,
    //         paddingTop: 5,
    //         // elevation: 10,
    //         height: 50,
    //         borderColor: darkTheme? "#000000" : "#FFFFFFFF",
    //         // borderRadius: 55,
    //         alignSelf: "center",
    //         display: "flex",
    //         flexDirection: "row",
    //         alignItems: "flex-start",
    //         justifyContent:"space-around",
    //         backgroundColor: darkTheme? "#000000d0" : "#ffffffd0",
            
    //         shadowColor: "transparent",
    //         // shadowOffset: {
    //         //   width: 10,
    //         //   height: 15,
    //         // },
    //         // shadowOpacity: 0.15,
    //         // shadowRadius: 3.5
    //       }
    //     }}>
    //       <Tabs.Screen name="index" options={{
    //         title : "home",
    //         // tabBarActiveTintColor: "#deb020",
    //         tabBarIcon: ({focused}) => (
    //           <TabIcon name="home" active={focused}/>
    //         )
    //       }}  />
    //       <Tabs.Screen name="Search" options={{
    //         // title : "home",
    //         // href:  null,
    //         unmountOnBlur: true,

    //         tabBarIcon: ({focused}) => (
    //           <TabIcon name="search" active={focused}/>
    //         )
    //       } as BottomTabNavigationOptions}  />
    //       <Tabs.Screen name="Cart" options={{
            
    //         // title : "home",
    //         // href:  null,
    //         tabBarIcon: ({focused}) => (
    //           <TabIcon name="cart" active={focused} count={Cart?.items_count}/>
    //         )

    //       } as BottomTabNavigationOptions}  />
    //       <Tabs.Screen name="Orders" options={{
    //         // href:  null,
    //         tabBarIcon: ({focused}) => (
    //           <TabIcon name="order" active={focused}/>
    //         )

    //       } as BottomTabNavigationOptions}  />

    // {/* hidden tub buttons */}
    //       <Tabs.Screen name="Profile" options={{
    //         // title : "home",
    //                   // unmountOnBlur: true,
    //         href:  null,
    //       } as BottomTabNavigationOptions}  />
    //       <Tabs.Screen name="Notifications" options={{
    //         // title : "home",
    //                   // unmountOnBlur: true,

    //         href:  null,
    //       } as BottomTabNavigationOptions}  />
    //       <Tabs.Screen name="Map/[id]" options={{
    //         // title : "home",
    //                   // unmountOnBlur: true,

    //         href:  null,
    //       } as BottomTabNavigationOptions}  />
    //       <Tabs.Screen name="product-details/[id]" options={{
    //         // title : "home",
    //         href:  null,
    //                   // unmountOnBlur: true,

    //       } as BottomTabNavigationOptions}  />
    //       <Tabs.Screen name="vendor/[id]" options={{
    //         // title : "home",
    //         href:  null,
    //                   // unmountOnBlur: true,

    //       } as BottomTabNavigationOptions}  />
    //     </Tabs>
    //   </Context.Provider>
  );
};

export default Layout;
