import { Dimensions, Platform, StatusBar, View } from "react-native";
import "../global.css";
import { Stack } from "expo-router";
import { ClerkProvider} from '@clerk/clerk-expo'
import { tokenCache } from '@clerk/clerk-expo/token-cache'
import Context from '../context/context'
import ThemeContextProvider from '../context/ThemeContext'
import { useEffect, useState } from "react";
import * as SplashScreen from 'expo-splash-screen';
import { preloadImages } from "@/constants/images/images";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';


SplashScreen.preventAutoHideAsync();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

async function sendPushNotification(expoPushToken: string) {
  const message = {
    to: expoPushToken,
    sound: 'default',
    title: 'Original Title',
    body: 'And here is the body!',
    data: { someData: 'goes here' },
  };

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
}

function handleRegistrationError(errorMessage: string) {
  alert(errorMessage);
  throw new Error(errorMessage);
}

async function registerForPushNotificationsAsync() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      handleRegistrationError('Permission not granted to get push token for push notification!');
      return;
    }
    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
    if (!projectId) {
      handleRegistrationError('Project ID not found');
    }
    try {
      const pushTokenString = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
      console.log(pushTokenString);
      return pushTokenString;
    } catch (e: unknown) {
      handleRegistrationError(`${e}`);
    }
  } else {
    handleRegistrationError('Must use physical device for push notifications');
  }
}

const { height, width } = Dimensions.get("window");
export default function Layout() {

	// <------------------HOOKES------------------>
	const darkTheme = useColorScheme() === "dark"
  const colorScheme = useColorScheme();

	// <------------------STATES------------------>
	// const [IsReady, setIsReady] = useState(false);
	const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState<Notifications.Notification | undefined>(
    undefined
  );

	// <------------------VARIABLES------------------>
	const statusBarHeight = StatusBar.currentHeight || 40;


	useEffect(() => {
		const prepare = async () => {
			try {
				await preloadImages();
			} catch (e) {
				// console.warn("Error loading images:", e);
			} finally {
				// setIsReady(true);
				await SplashScreen.hideAsync();
			}
		};
	
		prepare();
	}, []);


	useEffect(() => {
    registerForPushNotificationsAsync()
      .then(token => setExpoPushToken(token ?? ''))
      .catch((error: any) => setExpoPushToken(`${error}`));

    const notificationListener = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, []);

	return (
		// <>
		// 	<StatusBar
		// 		backgroundColor={"transparent"}
		// 		barStyle={"dark-content"}
		// 	/>
		// 	<GestureHandlerRootView>
		// 		<ThemeContextProvider>
		// 			<ClerkProvider publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY} tokenCache={tokenCache}>
		// 				<View
		// 					className={` absolute top-0 w-full ${darkTheme?"bg-black":""}`}
		// 					style={{
		// 						height: height + statusBarHeight,
		// 					}}
		// 				>
		// 					<Stack
		// 						screenOptions={{
		// 							headerShown: false,
		// 							animation: "slide_from_right", // Options: 'fade', 'slide_from_right', 'slide_from_left', 'none'
		// 							statusBarAnimation: "slide"
		// 						}}
		// 					/>
		// 				</View>
		// 			</ClerkProvider>
		// 		</ThemeContextProvider>
		// 	</GestureHandlerRootView>
		// </>
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <ThemeContextProvider>
        <ClerkProvider publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY} tokenCache={tokenCache}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(screens)" options={{ headerShown: false }} />
            <Stack.Screen name="(Auth)" options={{ headerShown: false }} />
          </Stack>
        </ClerkProvider>
      </ThemeContextProvider>
    </ThemeProvider>
	);
}
