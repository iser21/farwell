
-- Create images storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('images', 'images', true);

-- Create site_content table
CREATE TABLE public.site_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text,
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

-- Public can read
CREATE POLICY "Anyone can read site content" ON public.site_content
  FOR SELECT TO public USING (true);

-- Only admins can insert
CREATE POLICY "Admins can insert site content" ON public.site_content
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Only admins can update
CREATE POLICY "Admins can update site content" ON public.site_content
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can delete
CREATE POLICY "Admins can delete site content" ON public.site_content
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Storage RLS: public read
CREATE POLICY "Public can read images" ON storage.objects
  FOR SELECT TO public USING (bucket_id = 'images');

-- Storage RLS: admin upload
CREATE POLICY "Admins can upload images" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'images' AND public.has_role(auth.uid(), 'admin'));

-- Storage RLS: admin update
CREATE POLICY "Admins can update images" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'images' AND public.has_role(auth.uid(), 'admin'));

-- Storage RLS: admin delete
CREATE POLICY "Admins can delete images" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'images' AND public.has_role(auth.uid(), 'admin'));
