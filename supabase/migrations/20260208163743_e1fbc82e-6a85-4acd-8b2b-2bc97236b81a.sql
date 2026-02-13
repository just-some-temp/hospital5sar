
-- Create a SECURITY DEFINER function that returns booked time slots
-- This allows any authenticated user to check slot availability
-- without exposing patient data (bypasses RLS safely)
CREATE OR REPLACE FUNCTION public.get_booked_slots(p_doctor_id text, p_date date)
RETURNS text[]
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT COALESCE(array_agg(appointment_time), ARRAY[]::text[])
  FROM appointments
  WHERE doctor_id = p_doctor_id
    AND appointment_date = p_date
    AND status IN ('pending', 'confirmed')
$$;
