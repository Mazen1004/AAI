import google.generativeai as genai
import base64
from PIL import Image
import io

from openai import OpenAI

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

    @staticmethod
    def gemini(self):
        #API configuration
        api_key = input("Enter the api_key: ")
        genai.configure(api_key=api_key)

        #Gemini AI Model
        model = genai.GenerativeModel("gemini-2.0-flash-exp")

        #if user attached image with post
        if self.img != None:
            #path to image
            b64Img = self.encodeImage(self.img)
            response = model.generate_content(f"Can you tell me what artifact this is based on the image and description given? : {self.prompt}")
            response.image_data = b64Img
        else:
            #no image attached
            response = model.generate_content("Can you tell me what artifact this is based on the description given? : " + self.prompt)
 
        return "\n" + response.text

    @staticmethod
    def deepseek(self):
        api_key = input("Enter the api_key: ")
        client = OpenAI (
                        api_key=api_key, 
                        base_url="https://openrouter.ai/api/v1"
                )


        response = client.chat.completions.create(

            model="deepseek/deepseek-v3-base:free",
            messages=[
                {
                    "role": "user",
                    "content": "Can you tell me what artifact this is based on the description given? : " + self.prompt
                }
            ]
        )
    
        #completion.choices[0].message.content
        return response.choices[0].message.content

    def response(self):
        return self.deepseek(self)

#run
def main():
    prompt = "The artifact is sharp. It is small, almost the size of a hand, and is black in colour. It also looks like an arrow."
    img_path = "aai/backend/s-l1200.jpg"  
    print(ExpertResponse(prompt).response())

if __name__ == '__main__':
    main()