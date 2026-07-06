-- Make gift_ideas title nullable to allow optional entries
ALTER TABLE gift_ideas ALTER COLUMN title DROP NOT NULL;
