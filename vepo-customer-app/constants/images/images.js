// import image
import { Asset } from "expo-asset";


import plain_logo from '../../assets/images/logo-black.png'
import profile_placeholder from '../../assets/images/person-placeholder.jpg' 
import bg1light from '../../assets/images/4.png'
import bg1dark from '../../assets/images/1.png'
import bg2dark from '../../assets/images/3.png'
import authBgLight from '../../assets/images/authbglight.png'
import authBgDark from '../../assets/images/authbgdark.png'
import logoLight from '../../assets/images/logo-white.png'
import logo from '../../assets/images/vepo-logo.png'
import water_bottles from '../../assets/prop-images/skynews-water-bottle-generic_6415949.jpg'


const images = {
    plain_logo,
    profile_placeholder,
    bg1light,
    bg1dark,
    bg2dark,
    authBgLight,
    authBgDark,
    logo,
    water_bottles,
}


export async function preloadImages() {
    const imageArray = Object.values(images);
    const cacheImages = imageArray.map((image) => Asset.fromModule(image).downloadAsync());
    await Promise.all(cacheImages);
}

export default images 
