ALTER TABLE public.confessions ADD COLUMN IF NOT EXISTS category text NOT NULL DEFAULT 'secret';
ALTER TABLE public.confessions ADD COLUMN IF NOT EXISTS reactions_heart integer NOT NULL DEFAULT 0;
ALTER TABLE public.confessions ADD COLUMN IF NOT EXISTS reactions_laugh integer NOT NULL DEFAULT 0;
ALTER TABLE public.confessions ADD COLUMN IF NOT EXISTS reactions_wow integer NOT NULL DEFAULT 0;