import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HISTORY_PAGE, SINGLE_HISTORY } from '../constant';
import History from "../screens/History";
import SingleHistory from '../screens/SingleHistory';
import { useContext } from 'react';
import { AppContext } from '../AppContext';

const Stack = createNativeStackNavigator();

export default function HistoryStack(){
    const {translation} = useContext(AppContext);


    return (
        <Stack.Navigator initialRouteName={HISTORY_PAGE}>
            <Stack.Screen name={HISTORY_PAGE} component={History} options={{headerTitle: translation.header.history, headerShown: false}}/>
            <Stack.Screen name={SINGLE_HISTORY} component={SingleHistory} options={{headerTitle: translation.header.history}}/>
        </Stack.Navigator>
    )
}