-- Allow anyone to read pending confessions (needed for frontend-only admin)
CREATE POLICY "Anyone can read pending confessions"
ON public.confessions
FOR SELECT
USING (status = 'pending');

-- Allow anyone to update confession status (for frontend admin approve)
CREATE POLICY "Anyone can update confession status"
ON public.confessions
FOR UPDATE
USING (true)
WITH CHECK (true);

-- Allow anyone to delete confessions (for frontend admin delete)
CREATE POLICY "Anyone can delete confessions"
ON public.confessions
FOR DELETE
USING (true);