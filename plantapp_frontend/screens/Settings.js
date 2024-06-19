import { View, SafeAreaView, Text, Switch, TouchableOpacity } from "react-native";
import styles from "../styles/SettingsStyles";
import { useContext, useState } from "react";
import { AppContext } from "../AppContext";
import { useTheme } from "@react-navigation/native";
const Seperator = () => {
    return (
        <View style= {{height: 0.4, backgroundColor: "lightgrey"}}></View>
    )
}

export default function Settings(){
    const {language, setAndStoreLanguage, theme, setAndStoreTheme, translation} = useContext(AppContext);
    const {colors} = useTheme();

    const switchLanguage = (targetLanguage) => {
        if (language === targetLanguage) return;
        setAndStoreLanguage(targetLanguage);
    }
    
    const toggleSwitch = () => {
        if (theme) setAndStoreTheme("dark");
        else setAndStoreTheme("light");
    }

    return (
        <SafeAreaView>
            <View style ={styles.item}>
                <Text style= {{...styles.itemText, color: colors.text}}>{translation.settings.language}</Text>
                <View style= {{flexDirection: "row", alignItems: "center", width: 100}}>
                    <TouchableOpacity activeOpacity={0.65} onPress={() => switchLanguage("eng")} style= {language === "eng" ? styles.languageActive : styles.languagePassive}>
                        <Text style= {{padding: 5, fontWeight: 600, color: colors.text}}>ENG</Text>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.65} onPress={() => switchLanguage("tr")} style= {language === "tr" ? styles.languageActive : styles.languagePassive}>
                        <Text style= {{padding: 5, fontWeight: 600, color: colors.text}} >TR</Text>
                    </TouchableOpacity>
                </View>
                
            </View>
            <Seperator />
            <View style ={styles.item}>
                <Text style= {{...styles.itemText, color: colors.text}}>{translation.settings.theme}</Text>
                <Switch
                    value={theme}
                    onValueChange={toggleSwitch}
                    trackColor={{false: '#767577', true: '#81b0ff'}}
                    thumbColor={theme ? '#f5dd4b' : '#f4f3f4'}
                    ios_backgroundColor="#3e3e3e"
                />
            </View>
            <Seperator />
            <View >
                <Text style= {{fontSize: 20, fontWeight: 600, color: colors.text, textAlign: "center", marginTop: 30}}>{translation.settings.about}</Text>
                <Text style={{color: colors.text, fontWeight: 400, fontSize: 16, padding: 30, textAlign: "justify"}}>{translation.settings.aboutText}</Text>
            </View>
        </SafeAreaView>

    );
}