import google.generativeai as genai

# Set your API key
API_KEY = "AIzaSyAE9mYVjQ0wrTroQgfkSqURrkszCzrC8kQ"
genai.configure(api_key=API_KEY)

# Choose a fast and good model
MODEL_NAME = "gemini-1.5-flash"

def get_gemini_response(prompt):
    try:
        model = genai.GenerativeModel(MODEL_NAME)
        response = model.generate_content(prompt)

        if response and hasattr(response, "text"):
            return response.text
        else:
            return "I'm sorry, I couldn't generate a response."
    except Exception as e:
        print("❌ ERROR:", e)
        return "Sorry, there was an error processing your request."
