import smtplib
from email.mime.text import MIMEText
import os
from dotenv import load_dotenv

load_dotenv()
sender = os.getenv("SMTP_EMAIL")
password = os.getenv("SMTP_PASSWORD")

msg = MIMEText("Привет! Это тестовое письмо от сервера Adal Qadam.", "plain", "utf-8")
msg['Subject'] = 'Тест почты Adal Qadam (порт 587)'
msg['From'] = f"Adal Qadam <{sender}>"
msg['To'] = sender 

print(f"Отправляем с почты: {sender}")
print("Подключаемся к серверам Google (порт 587)...")

try:
    
    with smtplib.SMTP('smtp.gmail.com', 587, timeout=10) as server:
        server.ehlo()
        server.starttls() 
        server.login(sender, password)
        server.send_message(msg)
    print("✅ УСПЕШНО! Письмо улетело. Проверь почту.")
except Exception as e:
    print(f"❌ ОШИБКА: {e}")