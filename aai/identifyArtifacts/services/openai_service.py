import os
import requests
from dotenv import load_dotenv
from identifyArtifacts.services.expert_service import AIService
from identifyArtifacts.utilities.image_encoder import encodeImage
from identifyArtifacts.prompts import OPENAIAPI_PROMPT_TEMPLATE

class OpenAIService(AIService):
    def __init__(self, api_key: str = None):
        load_dotenv()  # Load environment variables from .env file
        self.api_key = api_key or os.getenv("OPENAI_API_KEY")
        if not self.api_key:
            raise ValueError("OpenRouter API Key not found. Please set OPENROUTER_API_KEY in your environment.")
        
    def get_artifact_description(self) -> str:
        load_dotenv()
        #prompt = "The artifact is sharp. It is small, almost the size of a hand, and is black in colour. It also looks like an arrow."
        current_dir = os.path.dirname(__file__)
        img_path = os.path.join(current_dir, "s-l1200.jpg")
        #img_path = "s-l1200.jpg"  

        # Getting the Base64 string
        image = encodeImage(img_path)
        base64_image = encodeImage(img_path)

        # OpenAI API Key
        api_key = os.environ['OPENAI_API_KEY']

        prompt = OPENAIAPI_PROMPT_TEMPLATE


        headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}"
        }

        payload = {
        "model": "gpt-4o-mini",
        "messages": [
            {
            "role": "user",
            "content": [
                {
                "type": "text",
                "text": prompt
                },
                {
                "type": "image_url",
                "image_url": {
                    "url": f"data:image/jpeg;base64,{base64_image}"
                }
                }
            ]
            }
        ],
        "max_tokens": 3000
        }

        response = requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload)

        # Convert the response to JSON
        json_data = response.json()

        # Extract the text from 'content'
        try:
            content = json_data["choices"][0]["message"]["content"]
        except (KeyError, IndexError):
            content = "Error: Unexpected response structure"


        print(content)
