import google.generativeai as genai


def gemini():
    api_key = input("Enter the api_key: ")
    genai.configure(api_key=api_key)

    model = genai.GenerativeModel("gemini-2.0-flash")
    response = model.generate_content("hello, tell me about yourself")

    return response.text

def main():
    print(gemini())

if __name__ == '__main__':
    main()