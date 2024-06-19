import { View, SafeAreaView, FlatList, Text, StatusBar, Platform } from "react-native";
import HistoryItem from "../components/HistoryItem";
import { useContext} from "react";
import * as Progress from 'react-native-progress';
import { AppContext } from "../AppContext";



const ItemSeperator = () => {
  return <View style={{ height: 1, backgroundColor: "gray" }}></View>;
};

export default function History() {
  const {historyData, initialLoading, translation} = useContext(AppContext);

  return (
    <SafeAreaView style={{flex: 1, marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0}}>
        {initialLoading &&
        <View style= {{flexDirection: "column", flex: 1, justifyContent: "center"}}>
            <Progress.Circle size={40} indeterminate={true} indeterminateAnimationDuration={1200} borderWidth={4} />
        </View>}
        {historyData && historyData.length === 0 &&
        <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
          <Text style= {{fontWeight: "bold", fontSize: 18, textAlign: "center"}}>{translation.history.empty}</Text>
        </View>}
        {historyData && historyData.length > 0 &&
        <FlatList
        
        data={historyData}
        renderItem={({ item }) => <HistoryItem item={item} />}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={ItemSeperator}
        />}
    </SafeAreaView>
  );
}
