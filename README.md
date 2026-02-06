# Ridero Banner Generator

Генератор баннеров для авторов книг Ridero. Позволяет за 2-3 клика создать баннер для соцсетей (VK, Telegram, TenChat).

## Быстрый старт

```bash
# Установка зависимостей
npm install

# Запуск в режиме разработки
npm run dev

# Сборка для продакшена
npm run build
npm run start
```

Открой http://localhost:3000 в браузере.

## Деплой на Vercel (бесплатно)

### Вариант 1: Через GitHub

1. Загрузи проект на GitHub
2. Зайди на [vercel.com](https://vercel.com)
3. Нажми "New Project" → "Import Git Repository"
4. Выбери репозиторий и нажми "Deploy"

### Вариант 2: Через CLI

```bash
# Установи Vercel CLI
npm install -g vercel

# Залогинься
vercel login

# Задеплой
vercel

# Для продакшен-деплоя
vercel --prod
```

## Структура проекта

```
src/
├── app/
│   └── page.tsx              # Главная страница (визард)
├── components/
│   ├── steps/                # Шаги визарда (6 шагов)
│   │   ├── Step1Url.tsx      # Ввод ссылки на книгу
│   │   ├── Step2Type.tsx     # Выбор типа (О книге / Презентация)
│   │   ├── Step3Format.tsx   # Выбор форматов
│   │   ├── Step4Color.tsx    # Выбор цветовой схемы
│   │   ├── Step5Preview.tsx  # Предпросмотр и редактирование
│   │   └── Step6Download.tsx # Скачивание баннеров
│   ├── templates/            # Шаблоны баннеров
│   │   ├── SquareBanner.tsx  # 1080×1080 (лента)
│   │   ├── VerticalBanner.tsx # 1080×1920 (истории)
│   │   └── OgBanner.tsx      # 1200×630 (превью ссылок)
│   └── ui/                   # UI компоненты
└── lib/
    ├── types.ts              # TypeScript типы
    ├── store.ts              # Zustand store
    ├── mock-books.ts         # Мок-данные книг (← заменить на API)
    └── image-generator.ts    # Генерация PNG
```

## Форматы баннеров

| Формат | Размер | Использование |
|--------|--------|---------------|
| Квадратный | 1080×1080 | Лента VK, Telegram, TenChat |
| Вертикальный | 1080×1920 | Истории VK, TenChat |
| OG | 1200×630 | Превью ссылок при шаринге |

## Цветовые схемы

- **Светлая** — нейтральная, универсальная
- **Тёмная** — драматичная, выделяющаяся
- **Романтика** — для женской литературы
- **Деловая** — бизнес, нон-фикшн
- **Яркая** — молодёжная, энергичная
- **Креатив** — нестандартная

---

## TODO для продакшена

### 1. Подключить Ridero API

Файл: `src/lib/mock-books.ts`

Заменить функцию `getBookData()` на реальный API-вызов:

```typescript
export async function getBookData(url: string): Promise<BookData | null> {
  const response = await fetch('/api/ridero/book', {
    method: 'POST',
    body: JSON.stringify({ url }),
  });
  return response.json();
}
```

API должен возвращать:
- `title` — название книги
- `author` — имя автора
- `coverUrl` — URL обложки
- `annotation` — аннотация
- `genre` — жанр
- `bookUrl` — ссылка на книгу
- `freeFragmentUrl` — ссылка на бесплатный фрагмент

### 2. Добавить авторизацию

Когда понадобится авторизация через Ridero:
- Добавить NextAuth.js или кастомный провайдер
- Защитить страницы через middleware

### 3. QR-трекинг

Для аналитики переходов по QR-коду:
1. Создать эндпоинт `/api/track/[id]`
2. Подключить базу данных (PostgreSQL/Supabase)
3. При генерации баннера создавать уникальный tracking_id
4. QR-код ведёт на `/api/track/[id]` → редирект на книгу

### 4. Заменить шаблоны от дизайнера

Когда будут готовы макеты в Figma:
1. Обновить компоненты в `src/components/templates/`
2. Добавить логотип Ridero в `public/assets/ridero-logo.svg`
3. При необходимости обновить цветовые схемы в `src/lib/types.ts`

---

## Технологии

- **Next.js 14+** — React-фреймворк
- **TypeScript** — типизация
- **Tailwind CSS** — стили
- **Zustand** — стейт-менеджмент
- **html-to-image** — генерация PNG из HTML
- **qrcode.react** — QR-коды
- **JSZip** — архивация

## Тестовые данные

MVP использует:
- Мок-данные книг (2 тестовых книги)
- Обложки из Open Library API

При вводе любой ссылки вида `ridero.ru/books/*` сервис сгенерирует тестовые данные.

## Лицензия

Проект Ridero. Все права защищены.
