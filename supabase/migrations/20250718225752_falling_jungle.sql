/*
  # Create capsules table for PastTime app (without authentication)

  1. New Tables
    - `capsules`
      - `id` (uuid, primary key)
      - `user_id` (text, email address as identifier)
      - `title` (text, capsule title)
      - `body` (text, message content)
      - `unlock_date` (timestamptz, when capsule unlocks)
      - `created_at` (timestamptz, when capsule was created)
      - `media_url` (text, optional media attachment URL)

  2. Security
    - Enable RLS on `capsules` table
    - Add policy for public access since no authentication

  3. Changes
    - Create indexes for better query performance
    - Use email as user identifier instead of auth.users reference
*/

CREATE TABLE IF NOT EXISTS capsules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  title text NOT NULL,
  body text NOT NULL,
  unlock_date timestamptz NOT NULL,
  created_at timestamptz DEFAULT now(),
  media_url text
);

-- Enable Row Level Security
ALTER TABLE capsules ENABLE ROW LEVEL SECURITY;

-- Create policy for public access (since no authentication)
CREATE POLICY "Allow all operations on capsules"
  ON capsules
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_capsules_user_id ON capsules(user_id);
CREATE INDEX IF NOT EXISTS idx_capsules_unlock_date ON capsules(unlock_date);
CREATE INDEX IF NOT EXISTS idx_capsules_created_at ON capsules(created_at);