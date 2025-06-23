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
};

const InputFeild = ({ label, style, type, placeholder, set }: Props) => {
  // <---------------HOOKS---------------->
  const {currentTheme} = useContext(UIThemeContext)
  const darkTheme = currentTheme === "dark";

  //   STATES
  // const [text, setText] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);

  // set(text);

  return (
    <View
      className={`relative w-[90%] border ${darkTheme?"border-gray-400":""} rounded-xl h-[50px] px-[10px] flex-row items-center` + style
      }
    >
      <View className={`px-2 ${darkTheme?"bg-black":"bg-primarybg"} absolute -top-3 left-2`}>
        <Text className={`${darkTheme?"text-white":""}`}>{label}</Text>
      </View>
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

