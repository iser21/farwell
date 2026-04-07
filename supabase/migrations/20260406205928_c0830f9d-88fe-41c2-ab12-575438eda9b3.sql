
-- Drop existing admin policies first to avoid conflicts
DROP POLICY IF EXISTS "Admins can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view images" ON storage.objects;

-- Recreate admin-only storage policies for images bucket
CREATE POLICY "Admins can upload images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update images"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete images"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can view images"
ON storage.objects FOR SELECT
USING (bucket_id = 'images');
