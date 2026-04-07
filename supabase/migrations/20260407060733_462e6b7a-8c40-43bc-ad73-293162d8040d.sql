CREATE POLICY "Anyone can delete autographs"
ON public.autograph_messages
FOR DELETE
TO public
USING (true);