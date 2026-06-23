-- Профили пользователей
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Комнаты чата
CREATE TABLE IF NOT EXISTS public.rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Сообщения
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Включаем RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Политики для profiles
CREATE POLICY "Пользователи могут читать все профили"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Пользователи могут обновлять только свой профиль"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Политики для rooms
CREATE POLICY "Все могут читать комнаты"
  ON public.rooms FOR SELECT
  USING (true);

CREATE POLICY "Авторизованные могут создавать комнаты"
  ON public.rooms FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Политики для messages
CREATE POLICY "Все могут читать сообщения"
  ON public.messages FOR SELECT
  USING (true);

CREATE POLICY "Авторизованные могут отправлять сообщения"
  ON public.messages FOR INSERT
  WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);

-- Триггер: создавать профиль при регистрации
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substr(NEW.id::text, 1, 8)));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Включаем realtime для messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
