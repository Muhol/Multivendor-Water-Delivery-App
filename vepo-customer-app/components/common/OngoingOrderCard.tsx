import { View, Text, Image, TouchableOpacity } from 'react-native'
import React, { useContext } from 'react'
import { UIThemeContext } from '@/context/ThemeContext'
import images from '@/constants/images/images'

type Props = {
  data? : any
  TrackOrder: () => void
}

const OngoingOrderCard = ({data, TrackOrder}: Props) => {
  const { currentTheme } = useContext(UIThemeContext);
	const darkTheme = currentTheme === "dark";
  return (
    <View className={`w-full max-w-[400px]  bg-accentbg/20 p-5 rounded-2xl overflow-hidden `}>
      <View className={`min-h-[150px] min-w-[500px] bg-accentbg rotate-[30deg] absolute bottom-0 -left-7`}/>
      <View className={`w-[200px] h-[200px] absolute -bottom-3 right-0`}>
        <Image source={images.ongoing_delivery} className={`w-full h-full`}/>
      </View>
      <Text>Order ID </Text>
      <View className={`gap-4`}>
        <Text className={`font-bold text-lg`}>#57v8V8V585J390-248HVQ08</Text>
        <View className={`flex-row`}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={()=>{TrackOrder()}}
          >
            <View className={`px-6 py-2 ${darkTheme?"bg-white":"bg-black"} rounded-full w-fit`}>
              <Text className={`text-accentbg text-lg font-bold`}>Track Order</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View>
          <Text className={`font-bold ${darkTheme?"text-gray-300":""}`}>Picked From the Vendor</Text>
          <Text className={`${darkTheme?"text-gray-300":""}`}>Feb 25  7:00pm</Text>
        </View>
      </View>
    </View>
  )
}

export default OngoingOrderCard