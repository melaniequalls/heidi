/*
  # Add notes field to diagnoses table

  1. Changes
    - Add `notes` column to `diagnoses` table
      - Type: text (nullable)
      - Allows users to add detailed notes to each diagnosis
  
  2. Purpose
    - Enable rich note-taking for diagnosis entries
    - Match functionality available in conditions table
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'diagnoses' AND column_name = 'notes'
  ) THEN
    ALTER TABLE diagnoses ADD COLUMN notes text;
  END IF;
END $$;