import { createContext, useEffect, useState } from "react"
import { useColorScheme } from "react-native"

// <-----------------HOOKS----------------->
export const UIThemeContext = createContext()

const ThemeContextProvider = ({ children }) => {
  const theme = useColorScheme()
  // <----------------STATES----------------->
  const [currentTheme, setCurrentTheme] = useState(theme)
  
  _retrieveTheme = async () => {
    try {
      const value = await AsyncStorage.getItem('THEME');
      if (value !== null) {
        setCurrentTheme(value)
        console.log(value);
      }
    } catch (error) {
      // Error retrieving data
    }
  };
  
  const setTheme = async () => {
    try {
      if(currentTheme ==="dark"){
        setCurrentTheme("light")
        await AsyncStorage.setItem(
          'THEME',
          'light',
        );
      }else{
        setCurrentTheme("dark")
        await AsyncStorage.setItem(
          'THEME',
          'dark',
        );
      }
    } catch (error) {
      console.log(error)
    }
  }
  
  useEffect(() => {
    const updateTheme = async () => {
      setCurrentTheme(theme)
      try {
        await AsyncStorage.setItem(
          'THEME',
          theme,
        );
      } catch (error) {
        
      }
    }
    updateTheme()
  }, [theme])
  
  return (
    <UIThemeContext.Provider value={{ setTheme, currentTheme }}>
      {children}
    </UIThemeContext.Provider>
  );
};

export default ThemeContextProvider