-- Allow anyone to upload to images bucket (for frontend admin)
CREATE POLICY "Anyone can upload images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'images');

-- Allow anyone to update images
CREATE POLICY "Anyone can update images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'images');

-- Allow anyone to delete images
CREATE POLICY "Anyone can delete images"
ON storage.objects FOR DELETE
USING (bucket_id = 'images');