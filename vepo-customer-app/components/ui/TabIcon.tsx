import { View, Text, Image } from "react-native";
import React from "react";
import Animated from "react-native-reanimated";

type Props = {
  name: string;
  active: boolean;
};

const TabIcon = ({ name, active }: Props) => {
  if (name === "home") {
    return (
      <View className="items-center gap-1">
        <Image
          source={require("../../assets/icons/home-black.png")}
          className="w-7 h-7"
          tintColor={`${active ? "#deb020" : "black"}`}
        />
        {active && (
          <View
            className="h-1 w-2 rounded-full"
            style={{
              backgroundColor: "#deb020",
            }}
          />
        )}
      </View>
    );
  } else if (name === "notification") {
    return (
      <View className="items-center gap-1">
        <Image
          source={require("../../assets/icons/notification-black.png")}
          className="w-7 h-7"
          tintColor={`${active ? "#deb020" : "black"}`}
        />
        {active && (
          <View
            className="h-1 w-2 rounded-full"
            style={{
              backgroundColor: "#deb020",
            }}
          />
        )}
      </View>
    );
  } else if (name === "cart") {
    return (
      <View className="items-center gap-1">
        <Image
          source={require("../../assets/icons/cart-black.png")}
          className="w-7 h-7"
          tintColor={`${active ? "#deb020" : "black"}`}
        />
        {active && (
          <View
            className="h-1 w-2 rounded-full"
            style={{
              backgroundColor: "#deb020",
            }}
          />
        )}
      </View>
    );
  } else if (name === "search") {
    return (
      <View className="items-center gap-1">
        <Image
          source={require("../../assets/icons/search-icon-black.png")}
          className="w-7 h-7"
          tintColor={`${active ? "#deb020" : "black"}`}
        />
        {active && (
          <View
            className="h-1 w-2 rounded-full"
            style={{
              backgroundColor: "#deb020",
            }}
          />
        )}
      </View>
    );
  } else if (name === "order") {
    return (
      <View className="items-center gap-1">
        <Image
          source={require("../../assets/icons/ordernow-black.png")}
          className="w-7 h-7"
          tintColor={`${active ? "#deb020" : "black"}`}
        />
        {active && (
          <View
            className="h-1 w-2 rounded-full"
            style={{
              backgroundColor: "#deb020",
            }}
          />
        )}
      </View>
    );
  } else if (name === "profile") {
    return (
      <View className="items-center gap-1">
        <Image
          source={require("../../assets/icons/profile-black.png")}
          className="w-7 h-7"
          tintColor={`${active ? "#deb020" : "black"}`}
        />
        {active && (
          <View
            className="h-1 w-2 rounded-full"
            style={{
              backgroundColor: "#deb020",
            }}
          />
        )}
      </View>
    );
  }
};

export default TabIcon;
