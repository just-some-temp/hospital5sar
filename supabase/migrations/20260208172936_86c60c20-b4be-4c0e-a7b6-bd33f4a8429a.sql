
-- Step 1: Add full_name column to doctor_profiles
ALTER TABLE public.doctor_profiles
ADD COLUMN full_name TEXT DEFAULT '';

-- Step 2: Create trigger function to sync full_name from profiles
CREATE OR REPLACE FUNCTION public.sync_doctor_full_name()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  SELECT p.full_name INTO NEW.full_name
  FROM public.profiles p
  WHERE p.id = NEW.user_id;

  IF NEW.full_name IS NULL THEN
    NEW.full_name = '';
  END IF;

  RETURN NEW;
END;
$$;

-- Step 3: Create trigger on doctor_profiles for INSERT and UPDATE
CREATE TRIGGER trg_sync_doctor_full_name
BEFORE INSERT OR UPDATE ON public.doctor_profiles
FOR EACH ROW
EXECUTE FUNCTION public.sync_doctor_full_name();

-- Step 4: Backfill existing records
UPDATE public.doctor_profiles dp
SET full_name = COALESCE(p.full_name, '')
FROM public.profiles p
WHERE p.id = dp.user_id;
