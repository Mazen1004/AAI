#import google.generativeai as genai
import base64
#from PIL import Image
import os
import io
from dotenv import load_dotenv

import requests

#import requests

#import openAI

class ExpertResponse: 

    #constructor function
    def __init__(self, prompt = None, img = None):
        self.img = img
        self.prompt = prompt

    @staticmethod
    #encodes image to base 64
    def encodeImage(imgPath):
        with open(imgPath, "rb") as imgFile:
            return base64.b64encode(imgFile.read()).decode("utf-8")

    # @staticmethod
    # def gemini(self):
    #     #API configuration
    #     api_key = input("Enter the api_key: ")
    #     genai.configure(api_key=api_key)

    #     #Gemini AI Model
    #     model = genai.GenerativeModel("gemini-2.0-flash-exp")

    #     #if user attached image with post
    #     if self.img != None:
    #         #path to image
    #         b64Img = self.encodeImage(self.img)
    #         response = model.generate_content(f"Can you tell me what artifact this is based on the image and description given? : {self.prompt}")
    #         response.image_data = b64Img
    #     else:
    #         #no image attached
    #         response = model.generate_content("Can you tell me what artifact this is based on the description given? : " + self.prompt)
 
    #     return "\n" + response.text

    # @staticmethod
    # def deepseek(self):
    #     api_key = os.environ["OPENROUTER_API_KEY"] = input("Enter your API key: ").strip()

    #     client = OpenAI (
    #                     api_key=api_key, 
    #                     base_url="https://openrouter.ai/api/v1"
    #             )


    #     response = client.chat.completions.create(

    #         model="deepseek/deepseek-v3-base:free",
    #         messages=[
    #             {
    #                 "role": "user",
    #                 "content": "Can you tell me what artifact this is based on the description given? : " + self.prompt
    #             }
    #         ]
    #     )
    
    #     #completion.choices[0].message.content
    #     return response.choices[0].message.content

    def response(self):
        return self.deepseek(self)

#run
def main():
    load_dotenv()
    prompt = "The artifact is sharp. It is small, almost the size of a hand, and is black in colour. It also looks like an arrow."
    img_path = "s-l1200.jpg"  

    # Getting the Base64 string
    base64_image = ExpertResponse.encodeImage(img_path)

    # OpenAI API Key
    api_key = os.environ['OPENAI_API_KEY']


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
            "text": "can you please describe the image?"
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

    print(response.json())

    #print(ExpertResponse(prompt).response())

if __name__ == '__main__':
    main()