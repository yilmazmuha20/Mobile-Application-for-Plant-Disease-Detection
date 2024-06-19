import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useEffect, useState } from "react";
import tr from "./languages/tr.json";
import eng from "./languages/eng.json";


const translations = {
    eng,
    tr,
  };

export const AppContext = createContext();


export default function AppContextProvider({children}){
    const [language, setLanguage] = useState("");
    const [theme, setTheme] = useState("");
    const [initialLoading, setInitialLoading] = useState(false);
    const [historyData, setHistoryData] = useState([]);
    const [translation, setTranslation] = useState(translations.eng);

    const getData = async () => {
        try {
          const jsonValue = await AsyncStorage.multiGet(["hist-5", "hist-4", "hist-3", "hist-2", "hist-1"]);
          const filteredData = jsonValue.filter(item => item[1] !== null).map(item => JSON.parse(item[1]));
          setHistoryData(filteredData);
        } catch (e) {
          console.log(e.message);
        }
      };

    const addToHistory = (newData) => {
        setHistoryData([newData, ...historyData])
    }

    const fetchInitials = async () => {

        setInitialLoading(true);

        try {
            let language = await AsyncStorage.getItem("lang");
            let theme = await AsyncStorage.getItem("theme");

            // onboarding
            if (language === null) {
                await AsyncStorage.setItem("language", "tr");
                language = "tr";
            }
            if (theme === null) {
                await AsyncStorage.setItem("theme", "light");
                theme = "light";
            }

            // all openings
            setLanguage(language);
            setTheme(theme === "light");
            setTranslation(translations[language]);

            console.log(translation)

        }
        catch (e) {
            console.log(e.message);
        }
        finally {
            await getData();
            setInitialLoading(false);
        }
    }

    const setAndStoreLanguage = async (lang) => {
        try {
            setLanguage(lang);
            setTranslation(translations[lang]);
            await AsyncStorage.setItem("lang", lang);
        }
        catch (e) {
            console.log(e.message);
        }
    }

    const setAndStoreTheme = async (them) => {
        try {
            setTheme(them === "light");
            await AsyncStorage.setItem("theme", them);
        }
        catch (e) {
            console.log(e.message);
        }
    }



    useEffect(() => {
        fetchInitials();
    }, [])

    values = {
        language,
        theme,
        setAndStoreLanguage,
        setAndStoreTheme,
        initialLoading,
        historyData,
        setHistoryData,
        addToHistory,
        translation
    }


    return (
        <AppContext.Provider value={values}>
            {children}
        </AppContext.Provider>
    )
}