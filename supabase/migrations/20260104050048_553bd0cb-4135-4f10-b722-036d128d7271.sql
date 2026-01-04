-- Rename firebase_uid to supabase_user_id
ALTER TABLE public.admin_users 
RENAME COLUMN firebase_uid TO supabase_user_id;

-- Allow null temporarily for registration flow
ALTER TABLE public.admin_users 
ALTER COLUMN supabase_user_id DROP NOT NULL;

-- Set default to empty string for new records
ALTER TABLE public.admin_users 
ALTER COLUMN supabase_user_id SET DEFAULT '';