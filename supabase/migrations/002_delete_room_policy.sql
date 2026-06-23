-- Разрешаем авторизованным пользователям удалять комнаты
DROP POLICY IF EXISTS "Авторизованные могут удалять комнаты" ON public.rooms;

CREATE POLICY "Авторизованные могут удалять комнаты"
  ON public.rooms FOR DELETE
  USING (auth.uid() IS NOT NULL);
