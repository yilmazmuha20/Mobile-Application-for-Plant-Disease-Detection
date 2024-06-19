import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SETTINGS_PAGE, MAIN_PAGE, HISTORY_PAGE, HISTORY_STACK } from "../constant";
import ImageUploadScreen from "../screens/ImageUploadScreen";
import  MaterialIcons  from 'react-native-vector-icons/MaterialIcons';
import Settings from "../screens/Settings";

import AppContextProvider, { AppContext } from "../AppContext";
import { useContext } from "react";
import HistoryStack from "./HistoryStack";


const Tab = createBottomTabNavigator();


export default function BottomNavigation() {

    const {translation} = useContext(AppContext);

    return (
        
        <Tab.Navigator 
            initialRouteName={MAIN_PAGE}

        >

            <Tab.Screen 
                name={HISTORY_STACK}
                component={HistoryStack}
                options={{
                    tabBarLabel: translation.bottomNavBar.history,
                    tabBarIcon: ({color, size}) => <MaterialIcons name="history" size={size} color={color} />,
                    headerShown: false,
                    
                }}

            />
            <Tab.Screen 
                name={MAIN_PAGE} 
                component={ImageUploadScreen}
                options={{
                    tabBarLabel: translation.bottomNavBar.diagnosis,
                    tabBarIcon: ({color, size}) => <MaterialIcons name="image-search" size={size} color={color} />,
                    headerShown: false
                }}
            />
            <Tab.Screen 
                name={SETTINGS_PAGE} 
                component={Settings}
                options={{
                    tabBarLabel: translation.bottomNavBar.settings,
                    tabBarIcon: ({color, size}) => <MaterialIcons name="settings" size={size} color={color} />,
                    headerTitle: "PlantApp"
                }}
            />







        </Tab.Navigator>
        
    )
}