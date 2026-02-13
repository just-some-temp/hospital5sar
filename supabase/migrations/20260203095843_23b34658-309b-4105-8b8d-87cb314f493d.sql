-- 1. Create trigger on auth.users (if not exists, drop and recreate)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 2. Add is_active column to profiles for user deactivation
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true NOT NULL;

-- 3. Sync existing users to profiles (those missing)
INSERT INTO public.profiles (id, email, full_name, is_active)
SELECT id, email, COALESCE(raw_user_meta_data->>'full_name', ''), true
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.profiles)
ON CONFLICT (id) DO NOTHING;

-- 4. Sync existing users to user_roles (those missing)
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'patient'::app_role
FROM auth.users
WHERE id NOT IN (SELECT user_id FROM public.user_roles);

-- 5. Set admin role for wyvernwwave@gmail.com
UPDATE public.user_roles
SET role = 'admin'
WHERE user_id = (SELECT id FROM public.profiles WHERE email = 'wyvernwwave@gmail.com');