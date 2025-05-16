import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import ComicText from '../styled-components/custom-texts/ComicText'

type Props = {}

const CartItem = (props: Props) => {
  return (
    <View className='flex-row gap-2 py-2'>
      <View>
        <Image 
        source={require('../../assets/prop-images/Product_Aqualife_100C_Refill5gal.jpg')}
        className='w-[90px] h-[90px] rounded-xl'
        resizeMode='contain'
        />
      </View>
      
      <View className=' gap-2 '>
        <ComicText text={'20 ltr dasani Refill'} style='text-lg' />
        <ComicText text={`Ksh ${'10.99'}`} style='text-lg' />

        {/* <--------<QUANTITY SECTION>--------> */}
        <View className='flex-row gap-3 items-center'>
          {/* DECREASE */}
          <TouchableOpacity 
          activeOpacity={0.6}
          onPress={() => {
          }}
          >
            <View className='p-2 rounded-xl bg-accentbg'>
              <Image 
              source={require('../../assets/icons/minus-black.png')}
              className='w-4  h-4 rounded-full'
              tintColor={"white"}
              />
            </View>
          </TouchableOpacity>

          <ComicText text={`${'1'}`} style='' />

          {/* INCREASE */}
          <TouchableOpacity 
          activeOpacity={0.6}
          onPress={() => {

          }}
          >
            <View className='p-2 rounded-xl bg-accentbg'>
              <Image 
              source={require('../../assets/icons/add-black.png')}
              // source={require('')}
              className='w-4  h-4 rounded-full'
              tintColor={"white"}
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default CartItem