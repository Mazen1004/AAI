import React, { useState } from "react";
import { View, Text, TextInput, Button, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import IdentifyArtifacts from "./identifyArtifacts/identifyArtifacts"; // Adjust the import based on your package structure

const App = () => {
  const [inputType, setInputType] = useState("image"); // "image" or "text"
  const [userInput, setUserInput] = useState("");
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const selectImage = async () => {
    // Use the Expo ImagePicker to let user select an image
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    // If the user didn't cancel, store the selected image in state
    if (!result.canceled) {
      const pickedAsset = result.assets && result.assets.length > 0 ? result.assets[0] : null;
      if (pickedAsset) {
        setSelectedImage(pickedAsset);
      }
    }
  };

  // This function handles both image and text inputs based on the user's selection.
  const handleSubmit = async () => {
    setLoading(true);
    const artifactIdentifier = new IdentifyArtifacts();
    let description = "";
    
    try {
      if (inputType === "image") {
        if (!selectedImage) {
          setResponse("Please select an image.");
          return;
        }
        // Call the Gemini-based analysis with the selected image
        description = await artifactIdentifier.analyzeAndStoreArtifact(selectedImage, "image");
      } else if (inputType === "text") {
        if (!userInput) {
          setResponse("Please enter a description text.");
          return;
        }
        // Call the OpenAI-based analysis with the provided text description
          description = await artifactIdentifier.analyzeAndStoreArtifact(userInput, "text");
      }
      setResponse(description);
    } catch (error) {
      setResponse("Error: " + error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Identify Your Artifact!</Text>
      <Image source={require("./assets/images/logo.png")} style={styles.logo} />

      {/* Picker for selecting input type */}
      <Picker
        selectedValue={inputType}
        onValueChange={(value) => {
          setInputType(value);
          setUserInput(""); // Clear text input when switching modes
          setSelectedImage(null); // Clear any previously selected image when switching modes
        }}
        style={styles.picker}
      >
        <Picker.Item label="Upload an Image" value="image" />
        <Picker.Item label="Describe with Text" value="text" />
      </Picker>

      {/* If input type is image, show a button to pick an image; otherwise show a text input */}
      {inputType === "image" ? (
        <TouchableOpacity onPress={selectImage} style={styles.uploadButton}>
          <Text style={{ color: "white" }}>Pick an Image</Text>
        </TouchableOpacity>
      ) : (
        <TextInput
          style={styles.input}
          placeholder="Enter description..."
          onChangeText={setUserInput}
          value={userInput}
        />
      )}

      {/* Preview the selected image if available and input type is image */}
      {selectedImage && inputType === "image" && (
        <Image source={{ uri: selectedImage.uri }} style={styles.previewImage} />
      )}

      {/* Button to send data to AI */}
      <Button title="Send to AI Experts" onPress={handleSubmit} />

      {/* Display loading animation or the response */}
      {loading ? (
        <ActivityIndicator size="large" color="#ffffff" style={{ marginTop: 20 }} />
      ) : (
        <Text style={styles.output}>{response}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#000" },
  header: { fontSize: 24, fontWeight: "bold", color: "white", marginBottom: 20 },
  logo: { width: "50%", height: "50%", marginBottom: 20 },
  picker: {
    height: 50,
    width: "80%",
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
    borderRadius: 5,
  },
  uploadButton: {
    backgroundColor: "gray",
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  previewImage: {
    width: 200,
    height: 200,
    marginTop: 10,
  },
  output: {
    color: "white",
    marginTop: 20,
    padding: 10,
    borderColor: "gray",
    borderWidth: 1,
    width: "80%",
  },
});

export default App;
