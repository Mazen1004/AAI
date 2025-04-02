import google.generativeai as genai
import base64
from PIL import Image
import os
import io

from openai import OpenAI

import requests
from bs4 import BeautifulSoup

class ExpertResponse: 

    #constructor function
    def __init__(self, prompt = None, img_path = None):
        self.prompt = prompt
        self.img_path = img_path

    @staticmethod
    #encodes image to base 64
    def encodeImage(imgPath):
        with open(imgPath, "rb") as imgFile:
            return base64.b64encode(imgFile.read()).decode("utf-8")

    #GEMINI 2.0 FLASH EXPERIMENTAL
    @staticmethod
    def gemini(self):
        #API configuration
        api_key = input("Enter the api_key: ")
        genai.configure(api_key=api_key)

        #Gemini AI Model
        model = genai.GenerativeModel("gemini-2.0-flash-exp")

        #if user attached image with post
        if self.img_path != None:
            #path to image
            b64Img = self.encodeImage(self.img_path)
            response = model.generate_content(f"give me a description of the image: {"https://drive.google.com/file/d/114wZng2b_hjtxTcda47ZoCBY2ecJPay9/view?usp=drive_link"}")
        else:
            #no image attached
            response = model.generate_content("Can you tell me what artifact this is based on the description given? : " + self.prompt)
 
        return "\n" + response.text

    #DEEPSEEK V3 BASE (FREE)
    @staticmethod
    def deepseek(self):
        api_key = os.environ["OPENROUTER_API_KEY"] = input("Enter your API key: ").strip()

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
    
        return response.choices[0].message.content

    #used to scrap information from the artifact website
    #DOES NOT WORK YET
    @staticmethod
    def beautifulSoup () :
        url = f"https://peachstatearchaeologicalsociety.org/artifact-identification/={query}"  # Modify for the target website
        headers = {"User-Agent": "Mozilla/5.0"}  # Prevent bot detection

        response = requests.get(url, headers=headers)
        soup = BeautifulSoup(response.text, "html.parser")

        # Modify this part to match the website's structure
        results = soup.find_all("div", class_="result-item")  # Example class

        for result in results[:5]:
            title = result.find("h2").text
            link = result.find("a")["href"]
            snippet = result.find("p").text
            print(f"\n{title}\n{link}\n{snippet}\n")

    #choose and return expert response to user
    def response(self):
        #CURRENTLY RETURNS GEMINI EXPERT RESPONSE
        return self.gemini(self)

#run
def main():
    prompt = "The artifact is sharp. It is small, almost the size of a hand, and is black in colour. It also looks like an arrow."
    img_path = "aai/backend/s-l1200.jpg"  
    print(ExpertResponse(prompt, img_path).response())

if __name__ == '__main__':
    main()