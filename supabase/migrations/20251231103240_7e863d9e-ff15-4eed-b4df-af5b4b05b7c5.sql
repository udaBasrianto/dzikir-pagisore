-- Create admin_users table to store admin Firebase UIDs
CREATE TABLE public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  firebase_uid TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('superadmin', 'admin')),
  created_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read admin_users (needed for role checking)
CREATE POLICY "Anyone can view admin users"
ON public.admin_users
FOR SELECT
USING (true);

-- Only existing admins can insert new admins
CREATE POLICY "Admins can insert new admins"
ON public.admin_users
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE firebase_uid = current_setting('request.headers', true)::json->>'x-firebase-uid'
  )
);

-- Only superadmins can update roles
CREATE POLICY "Superadmins can update admin users"
ON public.admin_users
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE firebase_uid = current_setting('request.headers', true)::json->>'x-firebase-uid'
    AND role = 'superadmin'
  )
);

-- Only superadmins can delete admins
CREATE POLICY "Superadmins can delete admin users"
ON public.admin_users
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE firebase_uid = current_setting('request.headers', true)::json->>'x-firebase-uid'
    AND role = 'superadmin'
  )
);

-- Create trigger for updated_at
CREATE TRIGGER update_admin_users_updated_at
BEFORE UPDATE ON public.admin_users
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial superadmin (will be populated when user first logs in)
-- This uses email as identifier initially
INSERT INTO public.admin_users (firebase_uid, email, role, created_by)
VALUES ('initial_superadmin', 'id.basrianto@gmail.com', 'superadmin', 'system');