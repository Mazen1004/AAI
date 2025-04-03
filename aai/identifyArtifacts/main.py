# main.py

import os
from dotenv import load_dotenv
from identifyArtifacts.services.openai_service import OpenAIService

def main():
    # Load environment variables (API keys, etc.) from .env
    load_dotenv()

    # Instantiate the service
    service = OpenAIService()

    # Call the service to get the description
    answer = service.get_artifact_description()

    print("OpenAIService Answer:")
    print(answer)

if __name__ == "__main__":

    main()
