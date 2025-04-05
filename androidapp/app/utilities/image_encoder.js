import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';

// Converting a file path to a file:// URI
async function pathToFileUri(path) {
    // Check if path is defined and is a string
    if (!path || typeof path !== 'string') {
        throw new Error('Invalid path: must be a non-empty string');
    }

    // Make sure the path doesn't already have a scheme
    if (path.startsWith('file://') || path.startsWith('content://')) {
        return path; // Already a URI
    }
    
    // Make sure the path starts with a slash
    if (!path.startsWith('/')) {
        path = '/' + path;
    }
    
    return 'file://' + path;
}

async function getBase64FromUri(filePath) {
    try {
        // Define uri variable with let before assigning value
        let uri;
        
        try {
            uri = await pathToFileUri(filePath);
        } catch (error) {
            console.log("Error in pathToFileUri:", error);
            // If conversion fails, use the original filePath
            uri = filePath;
        }
        
        console.log("Getting base64 from URI:", uri);
        
        // If it's already a data URL with base64 included, just strip off the base64 portion
        if (typeof uri === 'string' && uri.includes("base64,")) {
            console.log("URI is already a data URL with base64");
            const base64Data = uri.split("base64,")[1];
            if (!base64Data) {
                throw new Error("Invalid base64 data URL format");
            }
            return base64Data;
        }
        
        // If it's an object with a uri property (from ImagePicker)
        if (uri && typeof uri === 'object' && uri.uri) {
            console.log("URI is an object with uri property, extracting:", uri.uri);
            uri = uri.uri;
        }
        
        // If it's a file:// URI (e.g., from an Android camera capture)
        if (typeof uri === 'string' && uri.startsWith("file://")) {
            console.log("Reading file from filesystem:", uri);
            const base64 = await FileSystem.readAsStringAsync(uri, {
                encoding: FileSystem.EncodingType.Base64,
            });
            console.log("Base64 data obtained, length:", base64.length);
            return base64;
        }
        
        // Handle content:// URIs on Android
        if (typeof uri === 'string' && uri.startsWith("content://")) {
            console.log("Reading content URI:", uri);
            const base64 = await FileSystem.readAsStringAsync(uri, {
                encoding: FileSystem.EncodingType.Base64,
            });
            console.log("Base64 data obtained, length:", base64.length);
            return base64;
        }
        
        // Handle web platform separately
        if (Platform.OS === 'web') {
            return await encodeImageWeb(uri);
        }
        
        console.error("Unsupported URI format:", uri);
        throw new Error("Unsupported URI format");
    } catch (error) {
        console.error("Error converting image to base64:", error);
        throw error;
    }
}

async function encodeImage(imgPath) {
    if (Platform.OS === 'web') {
        return encodeImageWeb(imgPath);
    }

    try {
        const base64Image = await FileSystem.readAsStringAsync(imgPath, {
            encoding: FileSystem.EncodingType.Base64,
        });
        return base64Image;
    } catch (error) {
        console.error('Error reading file:', error);
        return null;
    }
}

async function encodeImageWeb(imgPath) {
    try {
        const response = await fetch(imgPath);
        const blob = await response.blob();

        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result.split(',')[1]); // Extract base64 string
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    } catch (error) {
        console.error('Error converting image to Base64:', error);
        throw error; // Rethrow to handle consistently with encodeImage
    }
}

export { encodeImage, pathToFileUri, encodeImageWeb, getBase64FromUri };