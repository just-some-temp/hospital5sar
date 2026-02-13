
-- Create doctor_schedules table
CREATE TABLE public.doctor_schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id text NOT NULL,
  day_of_week integer NOT NULL,
  start_time text NOT NULL,
  end_time text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Add validation trigger instead of CHECK constraint
CREATE OR REPLACE FUNCTION public.validate_doctor_schedule()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.day_of_week < 0 OR NEW.day_of_week > 6 THEN
    RAISE EXCEPTION 'day_of_week must be between 0 and 6';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER validate_doctor_schedule_trigger
  BEFORE INSERT OR UPDATE ON public.doctor_schedules
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_doctor_schedule();

-- Enable RLS
ALTER TABLE public.doctor_schedules ENABLE ROW LEVEL SECURITY;

-- Anyone can view schedules (public info for doctor pages)
CREATE POLICY "Anyone can view schedules"
  ON public.doctor_schedules FOR SELECT
  USING (true);

-- Only admins can manage schedules
CREATE POLICY "Admins can manage schedules"
  ON public.doctor_schedules FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Auto-update updated_at
CREATE TRIGGER update_doctor_schedules_updated_at
  BEFORE UPDATE ON public.doctor_schedules
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Seed static doctor schedules from hardcoded data
INSERT INTO public.doctor_schedules (doctor_id, day_of_week, start_time, end_time) VALUES
  -- Doctor 1: Иванов - Пн, Ср, Пт
  ('1', 1, '09:00', '15:00'),
  ('1', 3, '09:00', '15:00'),
  ('1', 5, '14:00', '20:00'),
  -- Doctor 2: Петрова - Пн, Вт, Чт
  ('2', 1, '08:00', '14:00'),
  ('2', 2, '14:00', '20:00'),
  ('2', 4, '08:00', '14:00'),
  -- Doctor 3: Сидоров - Вт, Чт
  ('3', 2, '09:00', '15:00'),
  ('3', 4, '09:00', '15:00'),
  -- Doctor 4: Козлова - Пн, Ср, Пт
  ('4', 1, '10:00', '16:00'),
  ('4', 3, '10:00', '16:00'),
  ('4', 5, '10:00', '16:00'),
  -- Doctor 5: Морозов - Пн, Ср, Пт
  ('5', 1, '08:00', '14:00'),
  ('5', 3, '14:00', '20:00'),
  ('5', 5, '08:00', '14:00'),
  -- Doctor 6: Белова - Вт, Чт, Сб
  ('6', 2, '09:00', '15:00'),
  ('6', 4, '09:00', '15:00'),
  ('6', 6, '09:00', '13:00'),
  -- Doctor 7: Новикова - Пн, Вт, Ср
  ('7', 1, '08:00', '14:00'),
  ('7', 2, '08:00', '14:00'),
  ('7', 3, '08:00', '14:00'),
  -- Doctor 8: Федоров - Вт, Чт
  ('8', 2, '10:00', '16:00'),
  ('8', 4, '10:00', '16:00');
