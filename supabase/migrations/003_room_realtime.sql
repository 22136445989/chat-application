-- Включаем realtime для таблицы rooms, чтобы удаление комнат отображалось у всех пользователей
ALTER PUBLICATION supabase_realtime ADD TABLE public.rooms;
