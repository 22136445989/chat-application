-- Разрешаем авторизованным пользователям удалять комнаты
CREATE POLICY "Авторизованные могут удалять комнаты"
  ON public.rooms FOR DELETE
  USING (auth.role() = 'authenticated');
