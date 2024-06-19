import { useTheme } from "@react-navigation/native";
import { TouchableOpacity, View, Text } from "react-native";
import  MaterialIcons  from 'react-native-vector-icons/MaterialIcons';

export default function CustomButton({title, onPress, iconName}) {
    const {colors} = useTheme();

    return (
        <TouchableOpacity onPress={onPress} style= {{borderBottomWidth: 1, borderBottomColor: colors.text, marginTop:8,flexDirection: "row", paddingLeft: 20, paddingTop: 5, paddingBottom: 5, alignItems: "center"}}>
            <MaterialIcons name={iconName} size={30} color={colors.text} />
            <Text style={{fontSize: 18, marginLeft: 30, color: colors.text}}>{title}</Text>
        </TouchableOpacity>
    )
}