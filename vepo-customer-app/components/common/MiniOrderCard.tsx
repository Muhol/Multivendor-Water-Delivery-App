import { View, Text, Image, TouchableOpacity } from 'react-native'
import React, { useContext } from 'react'
import { UIThemeContext } from '@/context/ThemeContext'
import TrackOrderCard from './TrackOrderCard'
import icons from '@/constants/icons/icons'

type Props = {
  data?: any
}

const MiniOrderCard = (props: Props) => {
  // <-------------HOOKES------------->
  const { currentTheme } = useContext(UIThemeContext);
	const darkTheme = currentTheme === "dark";
  return (
    <View 
			className={`${darkTheme?"bg-black":"bg-white"} self-end w-full gap-2 p-4 rounded-3xl shadow-xl border-gray-50 shadow-black/40`}
    >
      <View className=' flex-row justify-between items-start'>
        <View>
          <Text className={`${darkTheme?"text-white":"text-black"}`}>Order Id</Text>
          <Text className={`font-bold ${darkTheme?"text-white":"text-black"}`}>#57v8V8V585J390-248HVQ08</Text>
        </View>
        <View className={`px-6 py-1 ${darkTheme?"bg-accentbg/20":"bg-black"} rounded-full`}>
          <Text className={`font-bold ${darkTheme?"text-white":"text-white"}`}>In Transit</Text>
        </View>
      </View>
      <View className={`flex-row gap-2 pb-3 border-b ${darkTheme?"border-gray-600":"border-gray-200"}`}>
        <View className={`gap-2 flex-1`}>
          <Text className={`font-bold ${darkTheme?"text-white":"text-black"}`}>Placed At</Text>
          <Text className={`${darkTheme?"text-gray-400":"text-gray-600"}`}>2:00pm Feb 25, 2024 </Text>
        </View>
        <View className={`gap-2 flex-1`}>
          <Text className={`font-bold ${darkTheme?"text-white":"text-black"}`}>Items</Text>
          <Text className={`${darkTheme?"text-gray-400":"text-gray-600"}`}>3 items</Text>
        </View>
        <View className={`gap-2 flex-1`}>
          <Text className={`font-bold ${darkTheme?"text-white":"text-black"}`}>Amount</Text>
          <Text className={`${darkTheme?"text-gray-400":"text-gray-600"}`}>Ksh 300 </Text>
        </View>
      </View>
      <View className={`flex-row w-full py-2 items-center justify-between`}>
        <View className={`flex-row gap-2 items-center`}>
          <Image source={icons.profile2} className={`w-[60px] h-[60px]`} tintColor={darkTheme?"gray":"dimgray"}/>
          <View className={`gap-1`}>
            <Text className={`${darkTheme?"text-white":"text-black"}`}>Delivery Man</Text>
            <Text className={`font-bold text-lg ${darkTheme?"text-white":"text-black"}`}>John Doe</Text>
          </View>
        </View>
        <View className={`flex-row gap-3`}>
          <TouchableOpacity 
            activeOpacity={0.7}
          >
            <View className="w-12 h-12 shadow-lg shadow-black bg-green-500 rounded-2xl items-center justify-center">
              <Image source={icons.call} className="w-7 h-7" tintColor={darkTheme?"black":"white"}/>
            </View>
          </TouchableOpacity>
          <TouchableOpacity 
            activeOpacity={0.7}
          >
            <View className={`w-12 h-12 shadow-lg shadow-black bg-blue-500 rounded-2xl items-center justify-center`}>
              <Image source={icons.message} className="w-7 h-7" tintColor={darkTheme?"black":"white"}/>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default MiniOrderCard