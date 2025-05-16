import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import ComicText from "../styled-components/custom-texts/ComicText";
import { useRouter } from "expo-router";

type Props = {
  style: string;
  textStyle?: string;
  label: string;
  type?: string; 
  iconright?: any;
  iconleft?: any;
  iconcolor?: string;
};

const Button = ({ style, label, type, textStyle, iconleft, iconright, iconcolor }: Props) => {
  const router = useRouter();

  return (
      <View
        className={`p-[10px] flex-row items-center justify-center shadow-xl gap-3 ${type==="outline" ? "border border-gray-400 bg-white" : "bg-accentbg"}  ${style}`}
      >
        {
          iconleft && (
            <View className=" w-7 h-7 ">
              <Image source={iconleft} className="w-full h-full" tintColor={iconcolor || "white"} />
            </View>
          )
        }
        <ComicText style={` ${type ==="outline" ? "" : "text-white"}  ${textStyle}`} text={label} />
        {
          iconright && (
            <View className=" w-7 h-7 ">
              <Image source={iconright} className="w-full h-full" tintColor={iconcolor || "white"} />
            </View>
          )
        }
      </View>
  );
};

export default Button;
