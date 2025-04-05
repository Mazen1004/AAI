// processImageWithGemini.js
import { OPENAIAPI_PROMPT_TEMPLATE } from '../utilities/prompts.js'; // Assuming this is the correct path
import { GoogleGenerativeAI } from "@google/generative-ai";

class GeminiAIService {
    async getArtifactDescription(apiKey, base64Image) {
        try {
            const prompt = OPENAIAPI_PROMPT_TEMPLATE;
            // Instantiate the top-level client
            const genAI = new GoogleGenerativeAI(apiKey);

            // Assume JPEG file 
            const mimeType = "image/jpeg";

            console.log("Processing image with Gemini API...");

            // Initialize the Gemini model
            const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

            // Prepare the image data
            const imageData = {
                inlineData: {
                    data: base64Image,
                    mimeType: mimeType,
                },
            };
            // Generate content by passing [prompt, imageData]
            const result = await model.generateContent([prompt, imageData]);
            const response = await result.response;
            const text = response.text();
            console.log("gemini output")
            console.log(text)
            return text
        } catch (error) {
            console.error("Error processing image with Gemini:", error);
            throw new Error("Failed to analyze image with AI");
        }
    }

}
export { GeminiAIService };