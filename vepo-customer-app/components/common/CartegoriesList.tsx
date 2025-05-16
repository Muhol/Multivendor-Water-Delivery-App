import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React, { useState } from "react";

type Props = {
	data: string[];
};

const CartegoriesList = ({ data }: Props) => {

    const [active , setActive] = useState(0);

	return (
		<ScrollView
			horizontal={true}
			className="shadow-xl"
            showsHorizontalScrollIndicator={false}
			contentContainerStyle={{
				paddingHorizontal: 10,
				gap: 10,
                paddingVertical: 5
			}}
		>
			{data.map((i,index) => {
				return (
                    <TouchableOpacity
                        key={index}
                        activeOpacity={0.7}
                        onPress={()=>{
                            setActive(index)
                        }}
                    >
                        <View className={`py-3 z-30 px-4 justify-center rounded-full ${active === index ? 'bg-black':'bg-white'} shadow-xl`}>
                            <Text className={`${active === index ? 'text-white':''}`} >{i}</Text>
                        </View>
                    </TouchableOpacity>
				);
			})}
		</ScrollView>
	);
};

export default CartegoriesList;
