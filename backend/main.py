from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Form, BackgroundTasks
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, Field
from sqlalchemy import create_engine, Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session, relationship
from passlib.context import CryptContext
from jose import jwt, JWTError
from datetime import datetime
import google.generativeai as genai
import os
import random
import resend
from dotenv import load_dotenv
from PIL import Image
import io
import PyPDF2  # ДОБАВЛЕНО ДЛЯ ЧТЕНИЯ PDF
import chromadb
import chromadb.utils.embedding_functions as embedding_functions

load_dotenv()
API_KEY = os.getenv("GOOGLE_API_KEY")
genai.configure(api_key=API_KEY)
model = genai.GenerativeModel('models/gemini-flash-latest')

resend.api_key = os.getenv("RESEND_API_KEY")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base = declarative_base()
engine = create_engine("sqlite:///./users.db", connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True)
    username = Column(String, unique=True)
    hashed_password = Column(String)
    cases = relationship("Case", back_populates="owner")

class Case(Base):
    __tablename__ = "cases"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    owner = relationship("User", back_populates="cases")
    messages = relationship("Message", back_populates="case", cascade="all, delete-orphan")

class Message(Base):
    __tablename__ = "messages"
    id = Column(Integer, primary_key=True, index=True)
    case_id = Column(Integer, ForeignKey("cases.id"))
    role = Column(String)
    content = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    case = relationship("Case", back_populates="messages")

Base.metadata.create_all(bind=engine)

print("⏳ Подключение к векторной базе знаний...")
collection = None
try:
    google_ef = embedding_functions.GoogleGenerativeAiEmbeddingFunction(api_key=API_KEY)
    chroma_client = chromadb.PersistentClient(path="./rag_db")
    collection = chroma_client.get_or_create_collection(name="kaz_laws", embedding_function=google_ef)
    print("✅ База RAG успешно подключена!")
except Exception as e:
    print(f"⚠️ Ошибка RAG: {e}")

def send_verification_email(to_email: str, code: str):
    print(f"\n{'='*40}\n🔑 КОД РЕГИСТРАЦИИ: {code}\n{'='*40}\n")
    try:
        params = {
            "from": "onboarding@resend.dev",
            "to": to_email,
            "subject": "Код подтверждения Adal Qadam",
            "html": f"""
            <div style="font-family: sans-serif; text-align: center; background: #060b19; color: white; padding: 30px; border-radius: 20px;">
                <h1 style="color: #3b82f6; margin-bottom: 20px;">Adal Qadam</h1>
                <p style="font-size: 16px;">Ваш код для регистрации в системе:</p>
                <div style="background: #1e293b; padding: 20px; border-radius: 12px; display: inline-block; margin: 20px 0;">
                    <span style="font-size: 32px; font-weight: bold; letter-spacing: 10px; color: #60a5fa;">{code}</span>
                </div>
                <p style="font-size: 12px; color: #64748b;">Если вы не запрашивали этот код, просто проигнорируйте письмо.</p>
            </div>
            """
        }
        resend.Emails.send(params)
    except Exception as e:
        print(f"❌ Ошибка отправки Resend: {str(e)}")

def send_reset_email(to_email: str, code: str):
    print(f"\n{'='*40}\n🔓 КОД ВОССТАНОВЛЕНИЯ: {code}\n{'='*40}\n")
    try:
        params = {
            "from": "onboarding@resend.dev",
            "to": to_email,
            "subject": "Восстановление пароля Adal Qadam",
            "html": f"<p>Код для сброса пароля: <strong>{code}</strong></p>"
        }
        resend.Emails.send(params)
    except Exception as e:
        print(f"❌ Ошибка отправки Resend: {str(e)}")

class Step1Req(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)

class StepFinalReq(BaseModel):
    email: EmailStr
    code: str
    username: str = Field(..., min_length=3)

class ResetRequest(BaseModel):
    email: EmailStr

class ResetConfirm(BaseModel):
    email: EmailStr
    code: str
    new_password: str = Field(..., min_length=8)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
SECRET_KEY = "super-secret-key-adal-qadam"
ALGORITHM = "HS256"

def get_db():
    db = SessionLocal()
    try: yield db
    finally: db.close()

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        user = db.query(User).filter(User.username == username).first()
        if not user: raise HTTPException(status_code=401)
        return user
    except: raise HTTPException(status_code=401)

temp_registrations = {}
temp_resets = {}

@app.post("/register/step1")
def register_step1(data: Step1Req, bg: BackgroundTasks, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == data.email).first():
        raise HTTPException(status_code=400, detail="Email занят")
    code = str(random.randint(100000, 999999))
    temp_registrations[data.email] = {"password": data.password, "code": code}
    bg.add_task(send_verification_email, data.email, code)
    return {"ok": True}

@app.post("/register/final")
def register_final(data: StepFinalReq, db: Session = Depends(get_db)):
    if data.email not in temp_registrations or temp_registrations[data.email]["code"] != data.code:
        raise HTTPException(status_code=400, detail="Неверный код")
    hashed = pwd_context.hash(temp_registrations[data.email]["password"])
    new_user = User(email=data.email, username=data.username, hashed_password=hashed)
    db.add(new_user)
    db.commit()
    return {"ok": True}

@app.post("/password-reset/request")
def request_password_reset(data: ResetRequest, bg: BackgroundTasks, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user: raise HTTPException(status_code=404, detail="Пользователь не найден")
    code = str(random.randint(100000, 999999))
    temp_resets[data.email] = {"code": code}
    bg.add_task(send_reset_email, data.email, code)
    return {"message": "Код отправлен"}

@app.post("/password-reset/confirm")
def confirm_password_reset(data: ResetConfirm, db: Session = Depends(get_db)):
    if data.email not in temp_resets or temp_resets[data.email]["code"] != data.code:
        raise HTTPException(status_code=400, detail="Неверный код")
    user = db.query(User).filter(User.email == data.email).first()
    if not user: raise HTTPException(status_code=404, detail="Пользователь не найден")
    user.hashed_password = pwd_context.hash(data.new_password)
    db.commit()
    del temp_resets[data.email]
    return {"message": "Пароль успешно изменен"}

@app.post("/token")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == form_data.username).first()
    if not user or not pwd_context.verify(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Ошибка входа")
    token = jwt.encode({"sub": user.username}, SECRET_KEY, algorithm=ALGORITHM)
    return {"access_token": token, "token_type": "bearer"}

@app.get("/users/me")
def read_users_me(current_user: User = Depends(get_current_user)):
    return {"username": current_user.username, "email": current_user.email, "id": current_user.id}

@app.get("/cases")
def get_cases(u: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(Case).filter(Case.user_id == u.id).all()

@app.get("/cases/{case_id}")
def get_messages(case_id: int, u: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(Message).filter(Message.case_id == case_id).all()

@app.post("/analyze")
async def analyze(
    text: str = Form(None), 
    file: UploadFile = File(None),
    case_id: str = Form(None),
    u: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not case_id or case_id == "null":
        case = Case(user_id=u.id, title=(text[:30] if text else "Анализ") + "...")
        db.add(case)
        db.commit()
        db.refresh(case)
        c_id = case.id
    else:
        c_id = int(case_id)

    db.add(Message(case_id=c_id, role="user", content=text or "[Файл]"))
    
    context_text = ""
    if collection and text:
        try:
            results = collection.query(query_texts=[text], n_results=1)
            if results['documents'] and results['documents'][0]:
                context_text = results['documents'][0][0]
        except: pass

    system_instruction = f"""
    Ты — LegalPredict AI, продвинутый цифровой юрист и аналитик РК (в системе Adal Qadam).
    ... (весь твой текст инструкции без изменений) ...
    [НАЙДЕННЫЙ ЗАКОН]: {context_text if context_text else "Опирайся на общие знания законов РК."}
    """
    
    prompt = [system_instruction]
    if text: prompt.append(f"Запрос пользователя: {text}")
    
    # --- ИСПРАВЛЕННАЯ ЛОГИКА ОБРАБОТКИ ФАЙЛОВ ---
    if file:
        content_type = file.content_type
        file_data = await file.read()
        
        if content_type == "application/pdf":
            try:
                pdf_reader = PyPDF2.PdfReader(io.BytesIO(file_data))
                pdf_text = ""
                for page in pdf_reader.pages:
                    pdf_text += page.extract_text()
                prompt.append(f"\n[ТЕКСТ ИЗ ПРИКРЕПЛЕННОГО PDF]:\n{pdf_text}")
            except Exception as e:
                print(f"Ошибка чтения PDF: {e}")
        elif content_type.startswith("image/"):
            prompt.append(Image.open(io.BytesIO(file_data)))

    res = model.generate_content(prompt)
    ai_text = res.text.replace("```html", "").replace("```", "")
    
    db.add(Message(case_id=c_id, role="ai", content=ai_text))
    db.commit()
    
    return {"analysis": ai_text, "case_id": c_id}