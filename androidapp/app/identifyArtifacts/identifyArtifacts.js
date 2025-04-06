﻿// identifyArtifacts/IdentifyArtifacts.js
const { getBase64FromUri } = require('../utilities/image_encoder'); // Assuming you've defined this utility
import { OpenAIService } from '../services/openai_service';
import { GeminiAIService } from '../services/gemini_service';

// >>> ADDED: Import or define your manual classifier <<<
import { ManualArtifactClassifier } from '../services/manual_service';

class IdentifyArtifacts {
  constructor() {
    const apiUrlOpenAI = process.env.EXPO_PUBLIC_OPENAI_API_KEY;
    const apiUrlGemini = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
    this.apiKeyGemini = apiUrlGemini;
    this.apiKeyOpenAI = apiUrlOpenAI;
    if (!this.apiKeyOpenAI) {
      throw new Error("OpenAI API Key not found. Please set EXPO_PUBLIC_OPENAI_API_KEY in your environment.");
    }
    if (!this.apiKeyGemini) {
      throw new Error("Gemini Key not found. Please set EXPO_PUBLIC_GEMINI_API_KEY in your environment.");
    }

    this.history = []; // Stores processed artifacts: { type, input, description }

    // >>> ADDED: Instantiate a manual classifier instance <<<
    this.manualClassifier = new ManualArtifactClassifier();
  }

  async analyzeAndStoreArtifact(input, type) {
    let description = "";

    if (type === "image") {
      description = await this.analyzeArtifactwithGemini(input);
    } 
    else if (type === "text") {
      // >>> ADDED: If text starts with ";", do manual classification; otherwise do GPT <<<
      if (input.startsWith(";")) {
        // Remove the leading semicolon
        const trimmed = input.slice(1);
        const result = this.manualClassifier.classify(trimmed);
        description = `Manual Classification -> Category: ${result.category} (Matches: ${result.matches})`;
      }
      else {
        description = await this.analyzeArtifactwithOpenAI(input);
      }
    } 
    else {
      throw new Error("Invalid input type. Must be 'image' or 'text'.");
    }

    this.history.push({
      type,
      input,
      description,
      timestamp: new Date().toISOString(), // optional: to track when it was added
    });

    return description;
  }

  // Optional: Method to retrieve history
  async getHistory() {
    return this.history;
  }

  //Handles Text
  async analyzeArtifactwithOpenAI(text) {
    try {
      // Instantiate the OpenAI service and pass the user text
      const service = new OpenAIService();
      const description = await service.getArtifactDescription(this.apiKeyOpenAI, text);
      
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
