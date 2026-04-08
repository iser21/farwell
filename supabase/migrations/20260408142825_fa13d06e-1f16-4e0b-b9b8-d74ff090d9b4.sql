
CREATE TABLE public.batch_votes (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  award_id text NOT NULL,
  student_name text NOT NULL,
  voter_id text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- One vote per award per voter
CREATE UNIQUE INDEX batch_votes_voter_award ON public.batch_votes (voter_id, award_id);

ALTER TABLE public.batch_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read batch votes" ON public.batch_votes FOR SELECT TO public USING (true);
CREATE POLICY "Anyone can insert batch votes" ON public.batch_votes FOR INSERT TO public WITH CHECK (true);
