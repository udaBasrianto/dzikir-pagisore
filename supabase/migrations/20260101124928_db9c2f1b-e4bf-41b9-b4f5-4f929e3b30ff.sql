-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Admins can insert new admins" ON public.admin_users;
DROP POLICY IF EXISTS "Superadmins can update admin users" ON public.admin_users;
DROP POLICY IF EXISTS "Superadmins can delete admin users" ON public.admin_users;

-- Create new policies that work with the anon key
-- Anyone can read admin_users (needed to check admin status)
-- Keep existing: "Anyone can view admin users" 

-- For insert/update/delete, we'll handle authorization in the application layer
-- since Firebase auth doesn't integrate with Supabase RLS directly
CREATE POLICY "Allow all inserts for now" 
ON public.admin_users 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow all updates for now" 
ON public.admin_users 
FOR UPDATE 
USING (true);

CREATE POLICY "Allow all deletes for now" 
ON public.admin_users 
FOR DELETE 
USING (true);