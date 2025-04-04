// identifyArtifacts/IdentifyArtifacts.js
const { encodeImage } = require('../utilities/image_encoder'); // Assuming you've defined this utility
import { OpenAIService } from '../services/openai_service';

class IdentifyArtifacts {
  constructor() {
    const apiUrl = process.env.EXPO_PUBLIC_OPENAI_API_KEY;
    this.apiKey = apiUrl;
    if (!this.apiKey) {
      throw new Error("OpenAI API Key not found. Please set OPENAI_API_KEY in your environment.");
    }
  }

  async analyzeArtifact(imageFile) {
    try {
      // Convert image file to base64
      const base64Image = await encodeImage(imageFile);

      // Instantiate the OpenAI service and pass the base64 image
      const service = new OpenAIService();
      const description = await service.getArtifactDescription(this.apiKey, base64Image);
      
      return description;
    } catch (error) {
      throw new Error(`Error analyzing artifact: ${error.message}`);
    }
  }
}

export default IdentifyArtifacts;
