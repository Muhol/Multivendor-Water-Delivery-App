import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext } from "react";
import icons from "@/constants/icons/icons";
import { UIThemeContext } from "@/context/ThemeContext";

type Props = {
  label: string;
  type: string;
  style?: string;
  placeholder: string;
  set: (text: string) => void;
  iconleft?: any
};

const InputFeild = ({ label, style, type, placeholder, set, iconleft }: Props) => {
  // <---------------HOOKS---------------->
  const {currentTheme} = useContext(UIThemeContext)
  const darkTheme = currentTheme === "dark";

  //   STATES
  const [showPassword, setShowPassword] = React.useState(false);


  return (
    <View
      className={`relative max-w-[350px] w-[90%] border ${darkTheme?"border-gray-100/20 bg-gray-200/20":"border-gray-500 bg-gray-100"} rounded-full h-[50px] px-5 flex-row items-center` + style
      }
    >
      {/* <View className={`px-2 py-[2px] ${darkTheme?"":"bg-gray-100"} absolute -top-3 left-5 rounded-full`}>
        <Text className={`${darkTheme?"text-white":""}`}>{label}</Text>
      </View> */}
      {iconleft != undefined && (
        <View className="h-full items-center justify-center">
          <View className="w-9 h-9 items-center justify-center  ">
              <Image source={iconleft} className="w-6 h-6" tintColor={"dimgrey"} />
          </View>
        </View>
        )}
      <TextInput
        placeholder={placeholder}
        onChangeText={(text) => set(text)}
        secureTextEntry={type === "password" && !showPassword}
        className="flex-1 " 
      />
      {type === "password" && (
        <TouchableOpacity 
          className="justify-center items-center"
          activeOpacity={0.7}
          onPress={() => {
            setShowPassword(!showPassword)
          }}
        >
          <View className="w-9 h-9 items-center justify-center  ">
            {showPassword ? (
              <Image source={icons.eyeslash} className="w-6 h-6" tintColor={"dimgrey"} />
            ):(
              <Image source={icons.eye} className="w-6 h-6" tintColor={"dimgrey"} />
            )}
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default InputFeild;

