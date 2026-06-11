/*
  # Create product-images storage bucket and policies

  1. Storage Bucket
    - `product-images` — public bucket for product and avatar image uploads
    - 5MB file size limit
    - Only image MIME types allowed

  2. Storage Policies
    - Anyone can view product images (public read)
    - Authenticated users can upload images to their own folder
    - Users can only delete their own uploaded images

  3. Important Notes
    - Images are stored under `{user_id}/` prefix for ownership tracking
    - The bucket is public so product images are accessible without authentication
    - Upload policy restricts paths to the uploader's own folder
*/

-- Create the product-images bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images',
  'product-images',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

-- Policy: Anyone can view images (public read)
CREATE POLICY "Public can view product images"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'product-images');

-- Policy: Authenticated users can upload to their own folder
CREATE POLICY "Users can upload own product images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'product-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Policy: Users can delete their own images
CREATE POLICY "Users can delete own product images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'product-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Policy: Users can update their own images
CREATE POLICY "Users can update own product images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'product-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  )
  WITH CHECK (
    bucket_id = 'product-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
