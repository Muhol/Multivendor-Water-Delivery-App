import * as React from "react";
import { Dimensions, Image, Text, View } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import Carousel, {
	ICarouselInstance,
	Pagination,
} from "react-native-reanimated-carousel";

const data = [...new Array(6).keys()];
const width = Dimensions.get("window").width;
type Props = {
	data?: any;
};

const CarouselComponent = (props: Props) => {
	const ref = React.useRef<ICarouselInstance>(null);
	const progress = useSharedValue<number>(0);

	const onPressPagination = (index: number) => {
		ref.current?.scrollTo({
			/**
			 * Calculate the difference between the current index and the target index
			 * to ensure that the carousel scrolls to the nearest index
			 */
			count: index - progress.value,
			animated: true,
		});
	};

	const images = [
    {
      image: "https://res.cloudinary.com/dn5f0jksu/image/upload/v1751037362/vfosinwt3jqcjbhucp3a.jpg",
    },
    {
      image: "https://res.cloudinary.com/dn5f0jksu/image/upload/v1751037404/sceiqtshafpreiq9fbkz.png",
    },
    {
      image: "https://res.cloudinary.com/dn5f0jksu/image/upload/v1751037549/wxcio4tsef4lxh2cnuwc.jpg",
    },
    {
      image: "https://res.cloudinary.com/dn5f0jksu/image/upload/v1751037581/wjkgfge7pknggi0iq6ji.jpg",
    },
    {
      image: "https://res.cloudinary.com/dn5f0jksu/image/upload/v1751037600/nc74rdkk2r9ge6lld8qa.png",
    },
    {
      image: "https://res.cloudinary.com/dn5f0jksu/image/upload/v1751037632/j9ixiboe0hzzccsd02g6.png",
    },
    {
      image: "https://res.cloudinary.com/dn5f0jksu/image/upload/v1751037680/rxc1o5h8iykypy4el8eh.png",
    }
	];

	return (
		<View className={`w-full min-h-[200px]`}>
			{/* <Text>Carousel</Text> */}
			<Carousel
				ref={ref}
				width={width}
				height={width / 2}
				data={images}
				autoPlay
				autoPlayInterval={5000}
				mode="parallax"
				modeConfig={{
					parallaxScrollingScale: 0.99,
					parallaxScrollingOffset: 30,
					parallaxAdjacentItemScale: 0.7,
				}}
				onProgressChange={progress}
				renderItem={({ index, item }) => (
					<View
						style={{
							flex: 1,
							// borderWidth: 1,
							justifyContent: "center",
						}}
					>
						<Image source={{uri: item.image}} className="w-full h-full"/>
					</View>
				)}
			/>
			<Pagination.Custom
				progress={progress}
				data={data}
				dotStyle={{
					backgroundColor: "rgba(0,0,0,0.2)",
					borderRadius: 50,
				}}
				// containerStyle={{ gap: 5, marginTop: 10 }}
				onPress={onPressPagination}
				size={5}
				activeDotStyle={{
					borderRadius: 8,
					width: 20,
					height: 5,
					overflow: "hidden",
					backgroundColor: "#000000",
				}}
				containerStyle={{
					gap: 5,
					marginTop: 5,
					alignItems: "center",
					height: 5,
				}}
			/>
		</View>
	);
};

export default CarouselComponent;
