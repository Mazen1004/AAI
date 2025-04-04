import React, { useState } from "react";
import { View, Text, TextInput, Button, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import IdentifyArtifacts from "./identifyArtifacts/identifyArtifacts"; // Adjust the import based on your package structure

const App = () => {
  const [inputType, setInputType] = useState("image");
  const [userInput, setUserInput] = useState("");
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [response, setResponse] = useState("");

  const selectImage = async () => {
    // Use the Expo ImagePicker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false, // set true if you want to allow cropping
      quality: 1
    });

    // If the user didn't cancel
    if (!result.canceled) {
      // On Expo SDK 49+, 'result.assets' should be an array of selected images
      // Typically, you just need the first one
      const pickedAsset = result.assets && result.assets.length > 0 ? result.assets[0] : null;
      if (pickedAsset) {
        // Store the selected image in state
        setSelectedImage(pickedAsset);
      }
    }
  };

  const handleImage = async (image: any) => {
    if (!image) return;

    // Create an instance of IdentifyArtifacts
    const artifactIdentifier = new IdentifyArtifacts();
    // analyzeArtifact expects the raw file or URI
    const description = await artifactIdentifier.analyzeArtifact(image);
    setResponse(description);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Identify Your Artifact!</Text>
      <Image source={require("./assets/images/logo.png")} style={styles.logo} />

      {/* Picker for selecting input type */}
      <Picker
        selectedValue={inputType}
        onValueChange={setInputType}
        style={styles.picker}
      >
        <Picker.Item label="Upload an Image" value="image" />
        <Picker.Item label="Describe with Text" value="text" />
      </Picker>

      {/* If user wants to upload an image, show “Pick an Image” button; else show a TextInput */}
      {inputType === "image" ? (
        <TouchableOpacity onPress={selectImage} style={styles.uploadButton}>
          <Text style={{ color: "white" }}>Pick an Image</Text>
        </TouchableOpacity>
      ) : (
        <TextInput
          style={styles.input}
          placeholder="Enter text..."
          onChangeText={setUserInput}
          value={userInput}
        />
      )}

      {/* Preview the selected image if present */}
      {selectedImage && inputType === "image" && (
        <Image source={{ uri: selectedImage.uri }} style={styles.previewImage} />
      )}

      {/* Button to send data to AI */}
      <Button
        title="Send to AI Experts"
        onPress={() => handleImage(selectedImage)}
      />

      {/* Display AI response */}
      <Text style={styles.output}>{response}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#000" },
  header: { fontSize: 24, fontWeight: "bold", color: "white", marginBottom: 20 },
  logo: { width: "50%", height: "50%", marginBottom: 20 },
  picker: {
    height: "5%",
    width: "30%",
    color: "white",
    backgroundColor: "black",
    borderRadius: 5,
    marginVertical: 10,
    justifyContent: "center",
  },
  input: {
    width: "80%",
    padding: 10,
    backgroundColor: "white",
    marginVertical: 10,
    borderRadius: 5
  },
  uploadButton: {
    backgroundColor: "gray",
    padding: 10,
    borderRadius: 5,
    marginVertical: 10
  },
  previewImage: {
    width: 200,
    height: 200,
    marginTop: 10
  },
  output: {
    color: "white",
    marginTop: 20,
    padding: 10,
    borderColor: "gray",
    borderWidth: 1,
    width: "80%"
  },
});

export default App;
