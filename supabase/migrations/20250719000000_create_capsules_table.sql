-- Create the capsules table
CREATE TABLE IF NOT EXISTS public.capsules (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    unlock_date TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    sent_at TIMESTAMP WITH TIME ZONE,
    media_url TEXT,
    timezone TEXT
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS capsules_user_id_idx ON public.capsules(user_id);
CREATE INDEX IF NOT EXISTS capsules_unlock_date_idx ON public.capsules(unlock_date);

-- Set up Row Level Security (RLS)
ALTER TABLE public.capsules ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows users to insert their own capsules
CREATE POLICY "Users can insert their own capsules"
ON public.capsules FOR INSERT
TO anon
WITH CHECK (true);

-- Create a policy that allows users to view their own capsules
CREATE POLICY "Users can view their own capsules"
ON public.capsules FOR SELECT
TO anon
USING (true);

-- Create a policy that allows users to update their own capsules
CREATE POLICY "Users can update their own capsules"
ON public.capsules FOR UPDATE
TO anon
USING (true);

-- Create a policy that allows users to delete their own capsules
CREATE POLICY "Users can delete their own capsules"
ON public.capsules FOR DELETE
TO anon
USING (true); 