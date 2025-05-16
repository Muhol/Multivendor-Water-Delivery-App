import React from 'react';
import { View, Text, ImageBackground } from 'react-native';
import { BlurView } from 'expo-blur';
import images from '@/constants/images/images';



const GlassMorphismCard = () => {
  const [colors, setColors] = React.useState<any>([])

  
  return (
    <ImageBackground
      source={images.plain_logo}
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
    >
      <BlurView
        intensity={10}
        tint="dark"
        // experimentalBlurMethod='dimezisBlurView'
        style={{
          width: 300,
          height: 200,
          borderRadius: 20,
          padding: 20,
          borderWidth: 1,
          borderColor: 'rgba(255, 255, 255, 0.3)',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
        }}
      >
        <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold' }}>
          Glassmorphism
        </Text>
        <Text style={{ color: 'white', marginTop: 10 }}>
          Beautiful frosted glass effect!
        </Text>
      </BlurView>
    </ImageBackground>
  );
};

export default GlassMorphismCard;
