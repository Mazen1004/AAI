import React, { useState } from "react";
import { View, Text, TextInput, Button, Image, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView, Switch, Platform } from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import IdentifyArtifacts from "./identifyArtifacts/identifyArtifacts"; // Adjust the import based on your package structure
import { StatusBar } from "expo-status-bar";

const App = () => {
  const [inputType, setInputType] = useState("image"); // "image" or "text"
  const [userInput, setUserInput] = useState("");
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  // Switch state: false means manual mode (left), true means AI mode (right)
  const [isAIMode, setIsAIMode] = useState(true); 

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
    // Determine mode: if isAIMode is true, then use "ai" classification; otherwise "manual"
    const mode = isAIMode ? "ai" : "manual";

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
        // Always pass "text" and let IdentifyArtifacts decide based on the mode
        description = await artifactIdentifier.analyzeAndStoreArtifact(userInput, "text", mode);
      }
      setResponse(description);
    } catch (error) {
      setResponse("Error: " + error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        {/* Top left logo */}
        <View style={styles.topLeftLogoContainer}>
            <Image source={require("./assets/images/logo.png")} style={styles.topLeftLogo} />
        </View>
        <StatusBar style="light" backgroundColor="#000" translucent={false} />
      <Text style={styles.header}>Identify Your Artifact!</Text>
      <Image source={require("./assets/images/loginEmote.png")} style={styles.logo} resizeMode="contain" />

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

      {/* If text mode is active, show the toggle for Manual/AI classification */}
      {inputType === "text" && (
        <View style={styles.toggleContainer}>
          <Text style={styles.toggleLabel}> </Text>
          <View style={styles.switchContainer}>
            {/* Display current mode label */}
            <Text style={styles.modeLabel}>{isAIMode ? "AI" : "Manual"}</Text>
            <Switch
              value={isAIMode}
              onValueChange={(value) => {
                setIsAIMode(value);
                setUserInput(""); // Clear the input field on toggle
              }}
              trackColor={{ false: "#767577", true: "#eab676" }}
              thumbColor={isAIMode ? "#e28743" : "#f4f3f4"}
            />
          </View>
        </View>
      )}

      {/* If input type is image, show a button to pick an image; otherwise show a text input */}
      {inputType === "image" ? (
        <TouchableOpacity onPress={selectImage} style={styles.uploadButton}>
          <Text style={{ color: "white" }}>Pick an Image</Text>
        </TouchableOpacity>
      ) : (
        <TextInput
          style={styles.input}
          placeholder={isAIMode ? "Enter Description..." : "Enter: attribute1, attribute2, attribute3..."}
          placeholderTextColor="#fff"
          onChangeText={setUserInput}
          value={userInput}
        />
      )}

      {/* Preview the selected image if available and input type is image */}
      {selectedImage && inputType === "image" && (
        <Image source={{ uri: selectedImage.uri }} style={styles.previewImage} />
      )}

      {/* Button label changes based on mode */}
      <TouchableOpacity style={styles.sendButton} onPress={handleSubmit}>
        <Text style={styles.sendButtonText}>
            {inputType === "text" ? (isAIMode ? "Send to AI Experts" : "Use Manual Algorithm") : "Send"}
        </Text>
        </TouchableOpacity>

      {/* Display loading animation or the response inside a ScrollView */}
      {loading ? (
        <ActivityIndicator size="large" color="#ffffff" style={{ marginTop: 20 }} />
      ) : (
        <ScrollView style={{ maxHeight: 1000, width: "80%" }}>
          <Text style={styles.output}>{response}</Text>
        </ScrollView>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#000", paddingTop: 50 },
  header: { fontSize: 24, fontWeight: "bold", color: "white", marginBottom: 20, marginTop: 70 },
  logo: {
    width: 300,
    height: 300,
    resizeMode: "contain",
    marginBottom: 20,
    marginTop: 20,
  },
  
  picker: {
    height: 50,
    width: "80%",
    color: "white",
    backgroundColor: "black",
    borderRadius: 5,
    marginVertical: 10,
    justifyContent: "center",
    marginBottom: 50,
  },
  input: {
    width: "80%",
    padding: 10,
    backgroundColor: "#383838",
    marginVertical: 10,
    borderRadius: 5,
    color: "white",
  },
  toggleContainer: {
    width: "80%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  toggleLabel: {
    color: "white",
    fontSize: 16,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  modeLabel: {
    color: "white",
    marginRight: 8,
    fontSize: 16,
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
    marginTop: 30,
    padding: 10,
    borderColor: "#383838",
    borderWidth: 1,
  },
  sendButton: {
    backgroundColor: "#444", // or keep it black or gray for contrast
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 6,
    marginTop: 15,
  },
  
  sendButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },

  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
    paddingTop: 50,
    paddingBottom: 100, // Adds breathing room to scroll past bottom
  },

  topLeftLogoContainer: {
    paddingTop: 20,
    position: "absolute",
    top: 40, // adjust based on status bar height
    left: 20,
    zIndex: 10,
  },
  
  topLeftLogo: {
    width: 55,
    height: 55,
    resizeMode: "contain",
  },
  
});

export default App;
