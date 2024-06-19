import { DarkTheme, DefaultTheme, NavigationContainer } from "@react-navigation/native";
import BottomNavigation from "./BottomNavigation";
import AppContextProvider, { AppContext } from "../AppContext";
import { useContext, useEffect, useState } from "react";
import SplashScreen from "../screens/SplashScreen";





export default function AppNavigation(){
    const {initialLoading, theme} = useContext(AppContext);
    const [launch, setLaunch] = useState(true);

    useEffect(() => {

        setTimeout(() => {
            setLaunch(false);
          }, 2000);

    }, [])

    const LightTheme = {
        dark: false,
        colors: {
          primary: 'green',
          background: 'rgb(242, 242, 242)',
          card: 'rgb(255, 255, 255)',
          text: 'rgb(28, 28, 30)',
          border: 'rgb(199, 199, 204)',
          notification: 'green',
        },
      };

      const DarkTheme = {
        dark: true,
        colors: {
          primary: '#1B4242',
          background: '#1B4242',
          card: '#5C8374',
          text: 'white',
          border: '#1B4242',
          notification: 'rgb(255, 69, 58)',
        },
      };

    

    return (
        <NavigationContainer theme={theme ? LightTheme : DarkTheme}>
            {initialLoading || launch ? <SplashScreen /> : <BottomNavigation />}
        </NavigationContainer>
    )
}