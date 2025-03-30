import google.generativeai as genai


def gemini():
    genai.configure(api_key="AIzaSyAA8nFxwOL9ib2nvmQkCTKXQquehTLtxF0")

    model = genai.GenerativeModel("gemini-2.0-flash")
    response = model.generate_content("hello, tell me about yourself")

    return response.text

def main():
    print(gemini())

if __name__ == '__main__':
    main()