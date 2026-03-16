import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "./LanguageContext"; // Импортируем наш контекст языка

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Adal Qadam | Ваш ИИ-Юрист",
  description: "Бесплатная юридическая помощь и анализ документов в Казахстане",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Оборачиваем весь сайт в провайдер, чтобы язык работал везде */}
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}