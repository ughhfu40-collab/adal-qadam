import google.generativeai as genai
import os
from dotenv import load_dotenv
from pathlib import Path


load_dotenv(Path(__file__).parent / ".env")
api_key = os.getenv("GOOGLE_API_KEY")

if not api_key:
    print("ОШИБКА: Не найден API ключ в .env!")
else:
    genai.configure(api_key=api_key)
    print("--- СПИСОК ДОСТУПНЫХ МОДЕЛЕЙ ---")
    try:
        for m in genai.list_models():
            if 'generateContent' in m.supported_generation_methods:
                print(f"✅ {m.name}")
    except Exception as e:
        print(f"Ошибка соединения: {e}")