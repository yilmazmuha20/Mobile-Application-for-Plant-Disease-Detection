import { View, Image } from "react-native";
import img from "../assets/splashh.png";


export default function SplashScreen(){

    return (
        <View style={{flex: 1, backgroundColor: "#32b818", justifyContent: "center", alignItems: "center"}}>
            <Image source={img} style={{height: 250, width: 250}} />
        </View>
    )
}