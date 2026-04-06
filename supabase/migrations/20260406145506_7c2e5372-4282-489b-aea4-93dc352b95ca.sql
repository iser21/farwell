
-- Create autograph_messages table
CREATE TABLE public.autograph_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  message text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.autograph_messages ENABLE ROW LEVEL SECURITY;

-- Anyone can read autographs
CREATE POLICY "Anyone can read autographs"
  ON public.autograph_messages FOR SELECT
  USING (true);

-- Anyone can insert autographs
CREATE POLICY "Anyone can insert autographs"
  ON public.autograph_messages FOR INSERT
  WITH CHECK (true);

-- Create confessions table
CREATE TABLE public.confessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.confessions ENABLE ROW LEVEL SECURITY;

-- Anyone can read approved confessions
CREATE POLICY "Anyone can read approved confessions"
  ON public.confessions FOR SELECT
  USING (status = 'approved');

-- Admins can read all confessions
CREATE POLICY "Admins can read all confessions"
  ON public.confessions FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Anyone can insert confessions
CREATE POLICY "Anyone can insert confessions"
  ON public.confessions FOR INSERT
  WITH CHECK (true);

-- Only admins can update confessions (approve/reject)
CREATE POLICY "Admins can update confessions"
  ON public.confessions FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can delete confessions
CREATE POLICY "Admins can delete confessions"
  ON public.confessions FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Enable realtime for both tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.autograph_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.confessions;
