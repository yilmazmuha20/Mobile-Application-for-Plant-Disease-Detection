import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    item: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 20,
    },
    itemText: {
        fontSize: 20,
        fontWeight: 300
    },
    languageActive: {flex: 1, alignItems: "center", backgroundColor: "red", borderRadius: 10},
    languagePassive: {flex: 1, alignItems: "center"}
});



export default styles;