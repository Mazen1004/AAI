// identifyArtifacts/IdentifyArtifacts.js
const { getBase64FromUri } = require('../utilities/image_encoder'); // Assuming you've defined this utility
import { OpenAIService } from '../services/openai_service';
import { GeminiAIService } from '../services/gemini_service';
class IdentifyArtifacts {
  constructor() {
    const apiUrlOpenAI = process.env.EXPO_PUBLIC_OPENAI_API_KEY;
    const apiUrlGemini = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
    this.apiKeyGemini = apiUrlGemini;
    this.apiKeyOpenAI = apiUrlOpenAI;
    if (!this.apiKeyOpenAI) {
      throw new Error("OpenAI API Key not found. Please set EXPO_PUBLIC_OPENAI_API_KEY in your environment.");
    }
    if (!this.apiKeyOpenAI) {
      throw new Error("Gemini Key not found. Please set EXPO_PUBLIC_GEMINI_API_KEY in your environment.");
    }
  }

  //Handles Images
  async analyzeArtifactwithOpenAI(imageURL) {
    try {
      // Instantiate the OpenAI service and pass the user text
      const service = new OpenAIService();
      const description = await service.getArtifactDescription(this.apiKeyOpenAI, imageURL);
      
      return description;
    } catch (error) {
      throw new Error(`Error analyzing artifact: ${error.message}`);
    }
  }

  //Handles Images
  async analyzeArtifactwithGemini(imageFile) {
    try {
      // Convert image file to base64
      const base64Image = await getBase64FromUri(imageFile);

      // Instantiate the GeminiAI service and pass the base64 image
      const service = new GeminiAIService();
      const description = await service.getArtifactDescription(this.apiKeyGemini, base64Image);
      
      return description;
    } catch (error) {
      throw new Error(`Error analyzing artifact: ${error.message}`);
    }
  }
}

export default IdentifyArtifacts;
