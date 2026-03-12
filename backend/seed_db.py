import chromadb
import chromadb.utils.embedding_functions as embedding_functions
import os
from dotenv import load_dotenv


load_dotenv()
api_key = os.getenv("GOOGLE_API_KEY")

if not api_key:
    print("❌ Ошибка: Не найден GOOGLE_API_KEY в файле .env")
    exit()

print("⏳ Подключаемся к векторной базе...")


google_ef = embedding_functions.GoogleGenerativeAiEmbeddingFunction(api_key=api_key)


client = chromadb.PersistentClient(path="./rag_db")


collection = client.get_or_create_collection(name="kaz_laws", embedding_function=google_ef)


documents = [
    "ГК РК Статья 917. Вред (имущественный и (или) неимущественный), причиненный неправомерными действиями (бездействием) имущественным или неимущественным благам и правам граждан и юридических лиц, подлежит возмещению лицом, причинившим вред, в полном объеме.",
    
    "ТК РК Статья 104. Оплата труда в ночное время. Каждый час работы в ночное время оплачивается в повышенном размере, но не ниже чем в полуторном размере исходя из дневной (часовой) ставки работника."
]


ids = ["gk_917", "tk_104"]

print("🧠 Векторизуем законы и сохраняем в базу (это займет пару секунд)...")


collection.add(documents=documents, ids=ids)

print("✅ База успешно создана и заполнена! В папке проекта должна появиться папка 'rag_db'.")