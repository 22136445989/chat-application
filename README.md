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

## Деплой

[https://chat-application.vercel.app](https://chat-application.vercel.app)

## Качество кода

[![Code Climate](https://codeclimate.com/github/22136445989/chat-application/badges/gpa.svg)](https://codeclimate.com/github/22136445989/chat-application)
