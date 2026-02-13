
-- Create public storage bucket for doctor avatars
INSERT INTO storage.buckets (id, name, public)
VALUES ('doctor-avatars', 'doctor-avatars', true);

-- RLS: Anyone can view doctor avatars
CREATE POLICY "Anyone can view doctor avatars"
ON storage.objects FOR SELECT
USING (bucket_id = 'doctor-avatars');

-- RLS: Doctors can upload to their own folder
CREATE POLICY "Doctors can upload own avatar"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'doctor-avatars'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- RLS: Doctors can update their own avatar
CREATE POLICY "Doctors can update own avatar"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'doctor-avatars'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- RLS: Doctors can delete their own avatar
CREATE POLICY "Doctors can delete own avatar"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'doctor-avatars'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Add photo_url column to doctor_profiles
ALTER TABLE public.doctor_profiles
ADD COLUMN photo_url TEXT NOT NULL DEFAULT '';
