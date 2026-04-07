
CREATE TABLE public.students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  roll_number text UNIQUE NOT NULL,
  name text NOT NULL,
  phone text,
  first_year_image text,
  final_year_image text,
  description text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

-- Anyone can read students
CREATE POLICY "Anyone can read students" ON public.students
  FOR SELECT TO public USING (true);

-- Only admins can insert/update/delete
CREATE POLICY "Admins can insert students" ON public.students
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update students" ON public.students
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete students" ON public.students
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Add unique constraint on key for site_content if missing
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'site_content_key_unique') THEN
    CREATE UNIQUE INDEX site_content_key_unique ON public.site_content (key);
  END IF;
END $$;
