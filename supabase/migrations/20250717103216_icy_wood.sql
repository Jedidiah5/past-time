/*
  # Create capsules table for PastTime app

  1. New Tables
    - `capsules`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `title` (text, capsule title)
      - `body` (text, message content)
      - `unlock_date` (timestamptz, when capsule unlocks)
      - `created_at` (timestamptz, when capsule was created)
      - `media_url` (text, optional media attachment URL)

  2. Security
    - Enable RLS on `capsules` table
    - Add policies for authenticated users to manage their own capsules
    - Users can only see their own capsules
    - Users can only create, read, update, and delete their own capsules

  3. Changes
    - Create indexes for better query performance
    - Add foreign key constraint to auth.users
*/

CREATE TABLE IF NOT EXISTS capsules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  body text NOT NULL,
  unlock_date timestamptz NOT NULL,
  created_at timestamptz DEFAULT now(),
  media_url text
);

-- Enable Row Level Security
ALTER TABLE capsules ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own capsules"
  ON capsules
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own capsules"
  ON capsules
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own capsules"
  ON capsules
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own capsules"
  ON capsules
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_capsules_user_id ON capsules(user_id);
CREATE INDEX IF NOT EXISTS idx_capsules_unlock_date ON capsules(unlock_date);
CREATE INDEX IF NOT EXISTS idx_capsules_created_at ON capsules(created_at);