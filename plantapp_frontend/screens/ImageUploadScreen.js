import React, { useContext, useState } from 'react';
import { View, Button, Image, Alert, Modal, Text, useWindowDimensions, SafeAreaView, ScrollView, StatusBar, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import styles from "../styles/ImageUploadScreenStyles";
import plantPlaceholder from "../assets/plant_placeholder.png";
import happyPlant from "../assets/as.png";
import * as Progress from 'react-native-progress';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';
import { AppContext } from '../AppContext';
import { useTheme } from '@react-navigation/native';
import CustomButton from '../components/CustomButton';
import { SelectList } from 'react-native-dropdown-select-list';

const plantData = [{'key': null, 'value': "General"}, {'key': 'Apple', 'value': 'Apple'}, {'key': 'Cherry', 'value': 'Cherry'}, {'key': 'Corn', 'value': 'Corn'}, {'key': 'Cucumber', 'value': 'Cucumber'}, {'key': 'Grape', 'value': 'Grape'}, {'key': 'Peach', 'value': 'Peach'}, {'key': 'Pepper_bell', 'value': 'Pepper_bell'}, {'key': 'Potato', 'value': 'Potato'}, {'key': 'Rice', 'value': 'Rice'}, {'key': 'Soybean', 'value': 'Soybean'}, {'key': 'Strawberry', 'value': 'Strawberry'}, {'key': 'Sugarcane', 'value': 'Sugarcane'}, {'key': 'Tea', 'value': 'Tea'}, {'key': 'Tomato', 'value': 'Tomato'}, {'key': 'Wheat', 'value': 'Wheat'}]

const ImageUploadScreen = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [plantType, setPlantType] = useState(null);
  const { height, width, scale, fontScale } = useWindowDimensions();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiResponse, setApiResponse] = useState(null);
  const { addToHistory, translation, language } = useContext(AppContext);
  const { colors } = useTheme();



  const getCurrentTime = () => {
    const date = new Date();

    const twoDigits = (num) => (num < 10 ? `0${num}` : num);

    const day = twoDigits(date.getDate());
    const month = twoDigits(date.getMonth() + 1); // Months are zero-indexed
    const year = date.getFullYear();
    const hours = twoDigits(date.getHours());
    const minutes = twoDigits(date.getMinutes());

    return `${day}:${month}:${year} ${hours}:${minutes}`;
  };

  const pickImage = async () => {
    try {
      await ImagePicker.requestMediaLibraryPermissionsAsync();
      let result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        aspect: [1, 1]
      });

      if (!result.canceled) {
        const { uri, type, fileName } = result.assets[0];
        setSelectedImage({ uri, type, fileName });
      }
      else throw new Error("An error occured during selection. Please try again.");
    }
    catch (e) {
      Alert.alert("Selection Failure", e.message, [{ text: "Ok", onPress: () => { console.log("Ok") } }])
    }

  };

  const takePhoto = async () => {
    try {
      await ImagePicker.requestCameraPermissionsAsync();
      let result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 1,
        aspect: [1, 1]

      });

      if (!result.canceled) {
        const { uri, type, fileName } = result.assets[0];
        setSelectedImage({ uri, type, fileName });
      }
      else throw new Error("An error occured during upload. Please try again.");
    }
    catch (e) {
      Alert.alert("Upload Failure", e.message, [{ text: "Ok", onPress: () => { console.log("Ok") } }])
    }
  };

  const reset = () => {
    if (loading) return;

    setSelectedImage(null);
    setApiResponse(null);
    setError(null);

  }

  const storeData = async (data) => {
    try {
      let currentTurn = await AsyncStorage.getItem('currentTurn');
      if (currentTurn === null) {
        await AsyncStorage.setItem('currentTurn', "1");
        currentTurn = "1";
      }

      const stringified = JSON.stringify(data);
      addToHistory(data);
      await AsyncStorage.setItem('hist-' + currentTurn, stringified);

      let nextTurn = parseInt(currentTurn) + 1;
      if (nextTurn === 6) nextTurn = 1;

      await AsyncStorage.setItem("currentTurn", nextTurn.toString());

    } catch (e) {
      console.log(e.message);
    }
  }

  const wipeStoredData = async () => {
    await AsyncStorage.clear();
  }

  const sendRequest = async () => {

    if (loading) return;

    setApiResponse(null);
    setError(null);

    if (selectedImage === null) {
      setError("Önce bir seçim yapmanız gerekiyor!")
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("file", {
      uri: selectedImage.uri,
      name: selectedImage.fileName || "upload.jpg",
      type: "image/jpeg"
    });

    formData.append("language", language);
    
    if (plantType) formData.append("plant_type", plantType);



    try {
      const response = await fetch("http://192.168.170.113:5000/predict", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) throw new Error("Failed to fetch.");

      setApiResponse(data.data);

      const dataToBeStored = {
        id: uuid.v4(),
        uri: selectedImage.uri,
        header: data.data.prediction,
        name: data.data.plant_name,
        severity: data.data.severity || "-",
        description: data.data.description || "-",
        time: getCurrentTime(),
        language: language
      }

      storeData(dataToBeStored);
    }
    catch (e) {
      setError(e.message);
      console.log(e);
    }
    finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={{...styles.container,marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0 }}>
      


      {loading &&    // loading block
        <View style={{ flexDirection: "column", flex: 1, justifyContent: "center" }}>
          <Progress.Circle size={40} indeterminate={true} indeterminateAnimationDuration={1200} borderWidth={4} />
        </View>}
      {!loading && !apiResponse &&    // inital screen block
        <ScrollView >
          <View >
            <View style={{ flexDirection: "column", alignItems: "center", marginBottom: 5 }}>
              <Image source={selectedImage === null ? plantPlaceholder : { uri: selectedImage.uri }} style={{ width: 95 * width / 100, height: 95 * width / 100 }} />
              {selectedImage && <SelectList data={plantData} setSelected={(val) => setPlantType(val)} save='key' placeholder='Select (You dont have to)' searchPlaceholder='Select (You dont have to)' search={false} boxStyles={{marginTop:10, backgroundColor: "#5C8374", width: 60 * width / 100 }} dropdownStyles={{backgroundColor: "#5C8374"}} dropdownItemStyles={{borderBottomWidth:1,borderBottomColor: "#1B4242", paddingTop: 10, paddingBottom: 10}} />}
              {selectedImage && <Text style={{ marginTop: 10, textAlign: "center" }}> <Button title={translation.diagnosis.getInsights} onPress={sendRequest} /> </Text>}
            </View>
            <View style={{ marginTop: 20 }}>
              <CustomButton title={translation.diagnosis.selectImage} onPress={pickImage} iconName="photo-library" />
              <CustomButton title={translation.diagnosis.takePhoto} onPress={takePhoto} iconName="photo-camera" />
              
            </View>
            <View style = {{padding: 20}}>
              <Text style={{textAlign: "center", color: colors.text, fontStyle: "italic", fontSize: 12}}>{translation.diagnosis.footnote}</Text>
            </View>
          </View>
        </ScrollView>}

      {!loading && apiResponse && apiResponse.prediction !== "Healthy" && // server respond back success block
        <ScrollView>
          <View style={{ flexDirection: "column", alignItems: "center", marginBottom: 5 }}>
            <View>
              <Image source={selectedImage === null ? plantPlaceholder : { uri: selectedImage.uri }} style={{ width: 95 * width / 100, height: 95 * width / 100, objectFit: "contain" }} />
            </View>
            <View style={{ padding: 20 }}>
              <Text style={{ color: colors.text, textAlign: "center", fontSize: 18, fontWeight: 600 }}>{apiResponse.plant_name}: {apiResponse.prediction}</Text>
              <Text style={{ color: colors.text, textAlign: "center", fontSize: 16, fontWeight: 500, marginTop: 10 }}>{translation.diagnosis.rootCause}</Text>
              <Text style={{ color: colors.text, textAlign: "justify", fontWeight: 400, fontSize: 14, marginTop: 15 }}>{apiResponse.description.root_cause}</Text>
              <Text style={{ color: colors.text, textAlign: "center", fontSize: 16, fontWeight: 500, marginTop: 10 }}>{translation.diagnosis.symptoms}</Text>
              <Text style={{ color: colors.text, textAlign: "justify", fontWeight: 400, fontSize: 14, marginTop: 15 }}>{apiResponse.description.symptoms}</Text>
              <Text style={{ color: colors.text, textAlign: "center", fontSize: 16, fontWeight: 500, marginTop: 10 }}>{translation.diagnosis.treatment}</Text>
              <Text style={{ color: colors.text, textAlign: "justify", fontWeight: 400, fontSize: 14, marginTop: 15 }}>{apiResponse.description.treatment_process}</Text>
              <Text style={{ color: colors.text, textAlign: "center", fontSize: 16, fontWeight: 500, marginTop: 10 }}>{translation.diagnosis.prevention}</Text>
              <Text style={{ color: colors.text, textAlign: "justify", fontWeight: 400, fontSize: 14, marginTop: 15 }}>{apiResponse.description.preventive_measures}</Text>
            </View>
            <Button title={translation.diagnosis.anotherSearch} onPress={reset} />
          </View>
        </ScrollView>
      }

      {!loading && apiResponse && apiResponse.prediction === "Healthy" && // server respond back success block
        <ScrollView>
          <View style={{ flexDirection: "column", alignItems: "center", marginBottom: 5 }}>
            <View>
              <Image source={selectedImage === null ? plantPlaceholder : { uri: selectedImage.uri }} style={{ width: 95 * width / 100, height: 95 * width / 100, objectFit: "contain" }} />
            </View> 
            <View style={{flex: 1, justifyContent: "center", alignItems: "center", padding: 20}}>
              <Text style= {{fontWeight: "bold", fontSize: 18, textAlign: "center", color: colors.text}}>{translation.diagnosis.healthyText.replace("plant", apiResponse.plant_name)}</Text>
              <Image source={happyPlant} style={{ width: 50 * width / 100, height: 50 * width / 100, objectFit: "contain" }} />
            </View>        
            <Button title={translation.diagnosis.anotherSearch} onPress={reset} />
          </View>
        </ScrollView>
      }

      {!loading && error &&         // server respond back error block
        <View></View>

      }


      
    </SafeAreaView>
  );
};

export default ImageUploadScreen;