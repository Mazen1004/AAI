import axios from 'axios';
import { OPENAIAPI_PROMPT_TEMPLATE } from '../utilities/prompts.js'; // Assuming this is the correct path

class OpenAIService {
    async getArtifactDescription(apiKey, base64Image) {
        const prompt = OPENAIAPI_PROMPT_TEMPLATE.replace("{base64_image}", base64Image);

        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
        };

        const payload = {
            model: "gpt-4o-mini",  // Ensure that the model supports image processing (if applicable)
            messages: [
                {
                    role: "user",
                    content: prompt  // Text-based prompt for artifact description
                },
                //{
                  //  role: "user",
                    //content: `Data:image/jpeg;base64,${base64Image}`  // Base64 image (or URL if supported)
                //}
            ],
            max_tokens: 3000
        };

        try {
            const response = await axios.post("https://api.openai.com/v1/chat/completions", payload, { headers });

            // Extracting the content from the API response
            const content = response.data.choices[0]?.message?.content || "Error: Unexpected response structure";

            return content;
        } catch (error) {
            console.error("Error during API call:", error.response?.data || error.message);
            return "Error: Unable to fetch the response from OpenAI.";
        }
    }
}

export { OpenAIService };
