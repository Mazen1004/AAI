import os
import requests
from dotenv import load_dotenv
from services.expert_service import AIService
from utilities.image_encoder import encodeImage
from prompts import OPENAIAPI_PROMPT_TEMPLATE

class OpenAIService(AIService):        
    def get_artifact_description(self, api_key: str, base64_image: str ) -> str:

        #Retrieving prompt from prompts.py
        prompt = OPENAIAPI_PROMPT_TEMPLATE


        #Preparing header to be sent with api key
        headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}"
        }

        #Preparing payload with info to be sent
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
