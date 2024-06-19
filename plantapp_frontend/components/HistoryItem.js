import { View, Text, Image, useWindowDimensions, TouchableWithoutFeedback } from "react-native";
import styles from "../styles/HistoryItemStyle";
import { useNavigation, useTheme } from "@react-navigation/native";
import  FontAwesome6  from 'react-native-vector-icons/FontAwesome6';
import  FontAwesome5  from 'react-native-vector-icons/FontAwesome5';
import { SINGLE_HISTORY } from "../constant";


export default function HistoryItem({item}) {
    const {width} = useWindowDimensions();
    const {colors} = useTheme();
    const navigation = useNavigation();

    const getToSingleItemPage = (item) => {
        navigation.push(SINGLE_HISTORY, {item})
      }

    return (
        <TouchableWithoutFeedback onPress={() => getToSingleItemPage(item)}>
            <View style={styles.container}>
                <Image source={{uri: item.uri}} style={{width: 40 * width / 100, height: 40 * width / 100 }} />
                <View style= {styles.info}>
                    
                    <View style={styles.infoInner}>
                        <FontAwesome6 name="plant-wilt"  size={15} color={colors.text} />
                        <Text style={{...styles.infoText, color: colors.text, marginLeft: 10}}>{item.name}</Text>
                    </View>
                    <View style={styles.infoInner}>
                        <FontAwesome5 name="disease" size={15} color={colors.text} />
                        <Text style={{...styles.infoText, color: colors.text, marginLeft: 10}}>{item.header}</Text>
                    </View>

                    <View style={styles.infoInner}>
                        <FontAwesome6 name="heart-circle-exclamation" size={15} color={colors.text} />
                        <Text style={{...styles.infoText, color: colors.text, marginLeft: 10}}>{item.severity}/5</Text>
                    </View>

                    <View style={styles.infoInner}>
                        <FontAwesome6 name="clock" size={15} color={colors.text} />
                        <Text style={{...styles.infoText, color: colors.text, marginLeft: 10}}>{item.time.split(' ')[0].replaceAll(":", ".")}</Text>
                    </View>
                    
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
}