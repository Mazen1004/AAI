import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';

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
        return null;
    }
}

export { encodeImage };
