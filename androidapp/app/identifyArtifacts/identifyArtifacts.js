﻿// identifyArtifacts/IdentifyArtifacts.js
const { getBase64FromUri } = require('../utilities/image_encoder'); // Assuming you've defined this utility
import { OpenAIService } from '../services/openai_service';
import { GeminiAIService } from '../services/gemini_service';

// >>> ADDED: Import the manual classifier service <<<
import { ManualArtifactClassifier } from '../services/manual_service';

class IdentifyArtifacts {
  // Added third parameter "mode" for text classification; default "ai"
  async analyzeAndStoreArtifact(input, type, mode = "ai") {
    let description = "";

    if (type === "image") {
      description = await this.analyzeArtifactwithGemini(input);
    } 
    else if (type === "text") {
      if (mode === "manual") {
        const result = this.manualClassifier.classify(input);
        
        // Compute confidence explanation based on result.confidence:
        let confidenceExplanation;
        switch(result.confidence) {
          case "very low":
            confidenceExplanation = "Not enough descriptors provided. Consider adding more details to improve accuracy.";
            break;
          case "low":
            confidenceExplanation = "Limited matching descriptors; try including additional characteristics for clarity.";
            break;
          case "medium":
            confidenceExplanation = "A moderate match. More descriptive words could increase confidence further.";
            break;
          case "high":
            confidenceExplanation = "Strong match. Additional descriptors might further confirm the classification.";
            break;
          case "very high":
            confidenceExplanation = "Excellent match. The odds are very good that this classification is correct.";
            break;
          default:
            confidenceExplanation = "Insufficient information to determine confidence.";
        }

        // Provide an expanded explanation for each category:
        let categoryExplanation;
        switch(result.category) {
          case "Textile/Cloth Artifact":
            categoryExplanation = "These artifacts include items made from fabrics or textiles, such as clothing, drapes, or rugs. They are typically characterized by soft textures, woven patterns, and varied prints.";
            break;
          case "Wood/Bone Artifact":
            categoryExplanation = "This category encompasses objects crafted from wood or bone. They often exhibit natural grain, a rustic finish, and include items like carved utensils or decorative elements.";
            break;
          case "Metal/Weapon Artifact":
            categoryExplanation = "Items in this group are made of metal and often serve practical or combative functions, such as swords, daggers, or other edged tools. They are recognized by their sharp edges and robust construction.";
            break;
          case "Adornment/Jewelry Artifact":
            categoryExplanation = "This category covers small decorative items worn as personal adornments. They are typically elegant, shiny, and designed to enhance personal appearance using precious metals and stones.";
            break;
          case "Ceramic/Pottery Artifact":
            categoryExplanation = "Artifacts made from clay or ceramics, this group includes vessels such as pots, jars, or bowls. They are often handmade and characterized by textured surfaces and traditional glazes.";
            break;
          case "Carved/Statue Artifact":
            categoryExplanation = "These are sculpted or carved objects that represent figures or abstract forms. They display intricate craftsmanship and artistic expression, ranging from small busts to monumental statues.";
            break;
          case "Glass/Crystal Artifact":
            categoryExplanation = "This group comprises items made from glass or crystal, known for their transparency, fragility, and reflective qualities. They often exhibit modern elegance and a luminous finish.";
            break;
          case "Coin/Currency Artifact":
            categoryExplanation = "Artifacts in this category are small, minted objects used as currency or collected as relics. They are marked by their uniform, metallic appearance and often carry historical significance.";
            break;
          case "Technology/Device Artifact":
            categoryExplanation = "This category includes modern or historical devices featuring mechanical or electronic components. These artifacts are designed for functionality and often showcase sleek, innovative designs.";
            break;
          case "Religious/Spiritual Artifact":
            categoryExplanation = "These artifacts hold ceremonial or sacred significance, frequently used in religious practices. They are rich in symbolism and often feature intricate engravings and spiritual motifs.";
            break;
          default:
            categoryExplanation = "A general artifact category that does not fit into a specific group.";
        }

        description = `~Manual Classification~\n\nPredicted Artifact Class --> ${result.category.toUpperCase()}:\n\n${categoryExplanation}\n\nConfidence Level --> ${result.confidence.toUpperCase()}:\n\n${confidenceExplanation}`;
      } else {
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

    // Instantiate a manual classifier instance
    this.manualClassifier = new ManualArtifactClassifier();
  }
}

export default IdentifyArtifacts;
