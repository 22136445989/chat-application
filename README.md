# Chat Application

Приложение для обмена сообщениями в реальном времени. Пользователи могут авторизоваться, выбирать комнаты и обмениваться сообщениями. Данные хранятся в Supabase, а real-time обновления работают через встроенный механизм Supabase Realtime.

## Стек

- **Frontend:** React, TypeScript, Vite
- **Backend / БД:** Supabase (Auth, Postgres, Realtime)
- **Деплой:** Vercel

## Как запустить локально

```bash
npm install
cp .env.example .env
# заполните VITE_SUPABASE_URL и VITE_SUPABASE_ANON_KEY
npm run dev
```

## Настройка Supabase

1. Создайте проект на [supabase.com](https://supabase.com).
2. Скопируйте URL и anon key в файл `.env`.
3. Откройте SQL Editor и выполните скрипт из `supabase/migrations/001_initial_schema.sql`.
4. Включите Realtime для таблицы `messages` в разделе Database → Realtime.

## Тестовые данные

Для проверки авторизации можно использовать тестовый аккаунт:

- **Username:** `Test`
- **Email:** `viyimot361@afterdo.com`
- **Password:** `123456`

Или зарегистрировать нового пользователя на странице регистрации.

## Деплой

[https://chat-application-sooty-three.vercel.app/](https://chat-application-sooty-three.vercel.app/)

### Как задеплоить

1. Запушьте код в GitHub-репозиторий.
2. Импортируйте проект на [vercel.com](https://vercel.com).
3. Добавьте переменные окружения: `VITE_SUPABASE_URL` и `VITE_SUPABASE_ANON_KEY`.
4. Нажмите Deploy.

## Качество кода

[![Maintainability](https://qlty.sh/gh/22136445989/projects/chat-application/maintainability.svg)](https://qlty.sh/gh/22136445989/projects/chat-application)
[![Code Coverage](https://qlty.sh/gh/22136445989/projects/chat-application/coverage.svg)](https://qlty.sh/gh/22136445989/projects/chat-application)
