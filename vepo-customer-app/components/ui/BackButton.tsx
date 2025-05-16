import { View, Text, Image } from "react-native";
import React from "react";

type Props = {
  
};

const BackButton = (props: Props) => {
  return (
    <View
      className=" p-2 rounded-2xl bg-accentbg flex-row w-[40px] "
      style={{
        boxShadow: "2px 2px 20px #00000066",
        zIndex: 20
       }}
    >
      <Image
        source={require("../../assets/icons/back-arrow-black.png")}
        className="h-7 w-7"
      />
    </View>
  );
};

export default BackButton;
