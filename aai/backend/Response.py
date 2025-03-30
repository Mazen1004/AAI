import google.generativeai as genai

def response ():
    return 0

def gemini(prompt, image):
    api_key = input("Enter the api_key: ")
    genai.configure(api_key=api_key)

    model = genai.GenerativeModel("gemini-2.0-flash-exp")
    response = model.generate_content(prompt)

    return response.text

def main():
    print(response)

if __name__ == '__main__':
    main()