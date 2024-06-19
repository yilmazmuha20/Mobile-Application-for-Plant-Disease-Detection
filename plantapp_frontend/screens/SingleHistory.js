import { useTheme } from "@react-navigation/native";
import { SafeAreaView, View, Text, ScrollView, Image, useWindowDimensions } from "react-native";
import styles from "../styles/SingleHistoryStyle";
import { useContext } from "react";
import { AppContext } from "../AppContext";
import placeholder from "../assets/splashh.png";
import happyPlant from "../assets/as.png";

export default function SingleHistory({route}){
    const {item} = route.params;
    const {colors} = useTheme();
    const {translation} = useContext(AppContext);
    const {width} = useWindowDimensions();
    const localHeaders = {
        tr: {
            symptoms: "Semptomlar",
            rootCause: "Ana Sebep",
            treatment: "Tedavi",
            prevention: "Önlemler"
        },
        eng: {
            symptoms: "Symptoms",
            rootCause: "Root Cause",
            treatment: "Treatment",
            prevention: "Preventive Measures"
        }
    }

    // Eğer description kısmı yoksa bitki sağlıklı demektir aynı ekran olmayacağı için burda iki farklı ekran gerekiyor.
    const healthyOrNot = item.description === "-" ?  
    (
        <View style={{flex: 1, justifyContent: "center", alignItems: "center", padding: 20}}>
            <Text style= {{fontWeight: "bold", fontSize: 18, textAlign: "center", color: colors.text}}>{translation.diagnosis.healthyText.replace("plant", item.name)}</Text>
            <Image source={happyPlant} style={{ width: 50 * width / 100, height: 50 * width / 100, objectFit: "contain" }} />
        </View>
    )
    : 
    (
        <View style={{padding: 20}}>
            <Text style={{color: colors.text, textAlign: "center", fontSize: 18, fontWeight: 600}}>{item.name}: {item.header}</Text>
            <Text style={{...styles.header, color: colors.text}}>{localHeaders[item.language].rootCause}</Text>
            <Text style={{...styles.apiText, color: colors.text}}>{item.description.root_cause}</Text>
            <Text style={{...styles.header, color: colors.text}}>{localHeaders[item.language].symptoms}</Text>
            <Text style={{...styles.apiText, color: colors.text}}>{item.description.symptoms}</Text>
            <Text style={{...styles.header, color: colors.text}}>{localHeaders[item.language].treatment}</Text>
            <Text style={{...styles.apiText, color: colors.text}}>{item.description.treatment_process}</Text>
            <Text style={{...styles.header, color: colors.text}}>{localHeaders[item.language].prevention}</Text>
            <Text style={{...styles.apiText, color: colors.text}}>{item.description.preventive_measures}</Text>
        </View>
    )

    return (
        <SafeAreaView style={{flex: 1}}>
            <ScrollView style={{paddingTop: 10}}>
                <View style={{flexDirection: "column", alignItems: "center"}}>
                    <View>
                        <Image source= {item.uri === null ? placeholder :{ uri : item.uri }} style={{width: 95 * width / 100, height: 95 * width / 100, objectFit: "contain" }} />
                    </View>
                    {healthyOrNot}
                    
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}