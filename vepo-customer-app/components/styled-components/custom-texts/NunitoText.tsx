import { useFonts } from "expo-font";
import React from "react";
import { Text } from "react-native";

type Props = {
    style: string;
    text? : string;
};

export default function NunitoText({
    style,
    text
}: Props) {

    // load font 
    const [fontsLoaded] = useFonts({
        'Nunito': require("../../../assets/fonts/Nunito-VariableFont_wght.ttf"),
    })

    // check if fonts loaded
    if (!fontsLoaded){
        return null;
    }
  return <Text className={style} style={{fontFamily : 'Nonito'}}>{text}</Text>;
}
