import os
from dotenv import load_dotenv
import google.generativeai as genai
from utils.config import generation_config, safety_settings

def get_api_key():
    load_dotenv()
    return os.getenv('GOOGLE_API_KEY')

def set_gemini_api_key(api_key):
    genai.configure(api_key=api_key)

#returns model for gemini use
def set_gemini_config():
    model = genai.GenerativeModel(model_name="gemini-1.5-pro-latest",
                              generation_config=generation_config,
                              safety_settings=safety_settings)
    return model

