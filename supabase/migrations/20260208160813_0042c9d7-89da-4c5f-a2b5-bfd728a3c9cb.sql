
-- Create doctor_profiles table
CREATE TABLE public.doctor_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE NOT NULL,
  specialty text NOT NULL DEFAULT '',
  department text NOT NULL DEFAULT '',
  experience integer NOT NULL DEFAULT 0,
  category text NOT NULL DEFAULT 'без категории',
  education text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  is_published boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.doctor_profiles ENABLE ROW LEVEL SECURITY;

-- Public can view published profiles
CREATE POLICY "Anyone can view published doctor profiles"
  ON public.doctor_profiles FOR SELECT
  USING (is_published = true);

-- Doctors can view their own profile (even if not published)
CREATE POLICY "Doctors can view own profile"
  ON public.doctor_profiles FOR SELECT
  USING (user_id = auth.uid());

-- Doctors can update their own profile
CREATE POLICY "Doctors can update own profile"
  ON public.doctor_profiles FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Doctors can insert their own profile
CREATE POLICY "Doctors can insert own profile"
  ON public.doctor_profiles FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Admins can manage all doctor profiles
CREATE POLICY "Admins can manage doctor profiles"
  ON public.doctor_profiles FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Auto-update updated_at trigger
CREATE TRIGGER update_doctor_profiles_updated_at
  BEFORE UPDATE ON public.doctor_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
