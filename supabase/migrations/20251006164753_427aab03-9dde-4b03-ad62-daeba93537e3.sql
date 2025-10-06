-- Create user_progress table for gamification
CREATE TABLE IF NOT EXISTS public.user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL UNIQUE,
  nickname TEXT DEFAULT 'Anonymous',
  total_xp INTEGER DEFAULT 0,
  total_reads INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  unlocked_achievements TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own progress
CREATE POLICY "Users can view their own progress"
ON public.user_progress
FOR SELECT
USING (true);

-- Allow users to insert their own progress
CREATE POLICY "Users can insert their own progress"
ON public.user_progress
FOR INSERT
WITH CHECK (true);

-- Allow users to update their own progress
CREATE POLICY "Users can update their own progress"
ON public.user_progress
FOR UPDATE
USING (true);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_progress_updated_at
BEFORE UPDATE ON public.user_progress
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster lookups
CREATE INDEX idx_user_progress_user_id ON public.user_progress(user_id);
CREATE INDEX idx_user_progress_total_xp ON public.user_progress(total_xp DESC);