import { View, Text, Image } from 'react-native'
import React, { useContext } from 'react'
import { UIThemeContext } from '@/context/ThemeContext';
import icons from '@/constants/icons/icons';

type Props = {}

const OrderListItem = (props: Props) => {
  // <---------------------HOOKES----------------------->
  const { currentTheme } = useContext(UIThemeContext);
	const darkTheme = currentTheme === "dark";
  return (
    <View className={`flex-row gap-3 items-center`}>
      <View className={`w-[60px] h-[60px] items-center justify-center rounded-full ${darkTheme?"bg-gray-200/10":"bg-gray-200"}`}>
        <Image source={icons.package1} className="w-9 h-9" tintColor={darkTheme?"gray":"dimgray"}/>
      </View>
      <View className={`flex-1`}>
        <Text className={`font-bold text-lg ${darkTheme?"text-white":"text-black"}`}>#F84VSF843CUD8VIS993C38</Text>
        <View className={`flex-row justify-between items-center `}>
          <Text className={`${darkTheme?"text-white":"text-black"}`}>Picked from Vendor</Text>
          <View className={`px-4 py-1 rounded-full ${darkTheme?"bg-gray-200/20":"bg-gray-200"}`}>
            <Text className={`font-semibold ${darkTheme?"text-white":"text-black"}`}>Delivered</Text>
          </View>
          {/* <View className={`px-4 py-1 rounded-full bg-accentbg`}>
            <Text className="">On the way</Text>
          </View> */}
        </View>
      </View>
    </View>
  )
}

export default OrderListItem