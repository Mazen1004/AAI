import axios from 'axios';
import { OPENAIAPI_PROMPT_TEMPLATE } from '../utilities/prompts.js'; // Assuming this is the correct path

class OpenAIService {
    async getArtifactDescription(apiKey, base64Image) {
        const prompt = OPENAIAPI_PROMPT_TEMPLATE.replace("{base64_image}", base64Image);

        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
        };
        console.log(headers);

        const payload = {
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: prompt
                        },
                        {
                            type: "image_url",
                            image_url: {
                                url: `data:image/jpeg;base64,${base64Image}`
                            }
                        }
                    ]
                }
            ],
            max_tokens: 3000
        };

        try {
            const response = await axios.post("https://api.openai.com/v1/chat/completions", payload, { headers });

            // Extracting the content from the API response
            const content = response.data.choices[0]?.message?.content || "Error: Unexpected response structure";

            return content;
        } catch (error) {
            console.error("Error during API call:", error);
            return "Error: Unable to fetch the response from OpenAI.";
        }
    }
}

export { OpenAIService };
