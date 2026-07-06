-- Add media_type column to photos table to support both images and videos
ALTER TABLE photos ADD COLUMN IF NOT EXISTS media_type text NOT NULL DEFAULT 'image';

-- Add constraint to ensure valid media types
ALTER TABLE photos ADD CONSTRAINT valid_media_type CHECK (media_type IN ('image', 'video'));

-- Create index for faster queries by media type
CREATE INDEX IF NOT EXISTS photos_media_type_idx ON photos (media_type);
