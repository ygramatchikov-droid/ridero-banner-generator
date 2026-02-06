import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Генератор баннеров | Ridero",
  description: "Создайте баннер для своей книги за 2-3 клика",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
