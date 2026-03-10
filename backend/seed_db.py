import chromadb
import chromadb.utils.embedding_functions as embedding_functions
import os
from dotenv import load_dotenv

# Загружаем твой GOOGLE_API_KEY из .env
load_dotenv()
api_key = os.getenv("GOOGLE_API_KEY")

if not api_key:
    print("❌ Ошибка: Не найден GOOGLE_API_KEY в файле .env")
    exit()

print("⏳ Подключаемся к векторной базе...")

# Настраиваем Gemini как движок для "превращения текста в векторы"
google_ef = embedding_functions.GoogleGenerativeAiEmbeddingFunction(api_key=api_key)

# Создаем папку rag_db прямо в твоем проекте
client = chromadb.PersistentClient(path="./rag_db")

# Создаем "коллекцию" (таблицу) для законов Казахстана
collection = client.get_or_create_collection(name="kaz_laws", embedding_function=google_ef)

# === НАША ТЕСТОВАЯ БАЗА ЗАКОНОВ ===
documents = [
    "ГК РК Статья 917. Вред (имущественный и (или) неимущественный), причиненный неправомерными действиями (бездействием) имущественным или неимущественным благам и правам граждан и юридических лиц, подлежит возмещению лицом, причинившим вред, в полном объеме.",
    
    "ТК РК Статья 104. Оплата труда в ночное время. Каждый час работы в ночное время оплачивается в повышенном размере, но не ниже чем в полуторном размере исходя из дневной (часовой) ставки работника."
]

# Уникальные ID для каждой статьи
ids = ["gk_917", "tk_104"]

print("🧠 Векторизуем законы и сохраняем в базу (это займет пару секунд)...")

# Закидываем в базу
collection.add(documents=documents, ids=ids)

print("✅ База успешно создана и заполнена! В папке проекта должна появиться папка 'rag_db'.")