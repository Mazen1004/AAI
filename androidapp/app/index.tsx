import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, TouchableOpacity, Picker, StyleSheet } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import IdentifyArtifacts from './identifyArtifacts/identifyArtifacts'; // Adjust the import based on your package structure

const App = () => {
    const [inputType, setInputType] = useState("image");
    const [userInput, setUserInput] = useState("");
    const [selectedImage, setSelectedImage] = useState(null);
    const [response, setResponse] = useState("");

    const selectImage = () => {
        launchImageLibrary({ mediaType: 'photo', quality: 1 }, (result) => {
            if (result.didCancel) return;
            if (result.errorMessage) {
                console.error(result.errorMessage);
                return;
            }
            const image = result.assets[0];
            setSelectedImage(image);
        });
    };

    const handleImage = async (image) => {
        const artifactIdentifier = new IdentifyArtifacts();
        const description = await artifactIdentifier.analyzeArtifact(image);  // Send the raw file
        setResponse(description);
    };
  
    return (
        <View style={styles.container}>
            <Text style={styles.header}>Identify Your Artifact!</Text>
            <Image source={require("./assets/images/logo.png")} style={styles.logo} />

            <Picker selectedValue={inputType} onValueChange={setInputType} style={styles.picker}>
              <Picker.Item label="Upload an Image" value="image" />
              <Picker.Item label="Describe with Text" value="text" />
            </Picker>

            {inputType === "image" ? (
                <TouchableOpacity onPress={selectImage} style={styles.uploadButton}>
                <Text style={{ color: 'white' }}>Pick an Image</Text>
            </TouchableOpacity>
            ) : (<TextInput
              style={styles.input}
              placeholder="Enter text..."
              onChangeText={setUserInput}
              value={userInput}
          />)}

            {selectedImage && inputType === "image" && (
                <Image source={{ uri: selectedImage.uri }} style={styles.previewImage} />
            )}

            <Button title="Send to AI Experts" onPress={() => handleImage(selectedImage)} />
            <Text style={styles.output}>{response}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' },
    header: { fontSize: 24, fontWeight: 'bold', color: 'white', marginBottom: 20 },
    logo: { width: "50%", height: "50%", marginBottom: 20 },
    picker: { height: '5%', width: '30%', color: 'white', backgroundColor: 'black', borderRadius: 5, marginVertical: 10, justifyContent: 'center' },
    input: { width: '80%', padding: 10, backgroundColor: 'white', marginVertical: 10, borderRadius: 5 },
    uploadButton: { backgroundColor: 'gray', padding: 10, borderRadius: 5, marginVertical: 10 },
    previewImage: { width: 200, height: 200, marginTop: 10 },
    output: { color: 'white', marginTop: 20, padding: 10, borderColor: 'gray', borderWidth: 1, width: '80%' },
});

export default App;
