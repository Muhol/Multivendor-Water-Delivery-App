import { useFonts } from "expo-font";
import React from "react";
import { Text } from "react-native";

type Props = {
  text: string;
  style?: string;
};

export default function ComicText({ text, style }: Props) {
  // Load fonts
  const [fontsLoaded] = useFonts({
    'ComicFont': require("../../../assets/fonts/Ldfcomicsans-jj7l.ttf"),
  });

  // Check if font is loaded
  if (!fontsLoaded) {
    return null; // Prevent rendering until fonts are loaded
  }

  return <Text className={style} style={{fontFamily : 'ComicFont'}}>{text}</Text  >;
}
