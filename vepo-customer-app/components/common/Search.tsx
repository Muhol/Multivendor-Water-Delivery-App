import { View, Text, TextInput, Image } from 'react-native'
import React, { useEffect, useRef } from 'react'

type Props = {
    width: string;
    height: string;
    buttonStyle: string;
    setFunc: (value: string ) => void;
}

const SearchBar = ({
    width,
    buttonStyle,
    height,
    setFunc
}: Props) => {

  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      inputRef.current?.focus();
    }, 100); // Delay is sometimes needed to ensure the keyboard opens smoothly

    return () => clearTimeout(timeout);
  }, []);

  return (
    <View className={`px-4 flex-1 bg-gray-200 rounded-full ${width} ${height}`}>
    <TextInput
      ref={inputRef} 
      placeholder='Search for Vendor/Shop or location '
      placeholderTextColor={true && "gray"}
      className='flex-1'
      enterKeyHint={"search"}
      onChangeText={(text) => setFunc(text)}
    />
   
  </View>
  )
}

export default SearchBar