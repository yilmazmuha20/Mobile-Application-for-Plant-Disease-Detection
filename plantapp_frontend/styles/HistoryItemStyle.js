import { StyleSheet } from "react-native";



const styles = StyleSheet.create({
    container: {
        padding: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        
    },
    info: {
        flexDirection: "column",
        flex: 1,
        marginLeft: 20,
        paddingTop:5,
        paddingBottom:5,
        justifyContent: "space-between"
    },
    infoInner: {display: "flex", flexDirection: "row"}
    
})


export default styles;