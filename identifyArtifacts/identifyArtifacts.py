# this should contain our main logic for figuring out which service to use and outputting a proper answer
# then we pass our answer to main.py
import os
from dotenv import load_dotenv
from utilities.image_encoder import encodeImage
from services.openai_service import OpenAIService

class IdentifyArtifacts():
    #Check that our environment variables exist
    def __init__(self, api_key: str = None):
        load_dotenv()  # Load environment variables from .env file
        self.api_key = api_key or os.getenv("OPENAI_API_KEY")
        if not self.api_key: #TODO: need to add gemini and others s
            raise ValueError("OpenAI API Key not found. Please set OPENAI_API_KEY in your environment.")

    def analyze_artifact(self, image_file) -> str:
        #TODO will need alot of logic here to figure out which agent(ai) to call based on the type of input we get
        """
        Instantiates the OpenAI service and passes the base64 image (and other prompt information)
        so that the service returns a text description of the artifact.
        """
        self.base64_image = encodeImage(image_file)
        service = OpenAIService()
        # Here we pass the base64_image to the service.
        # (Make sure your OpenAIService.get_artifact_description() is defined to accept a parameter for the image.)
        description = service.get_artifact_description(api_key=self.api_key,
                                                            base64_image=self.base64_image)
        return description
        
    