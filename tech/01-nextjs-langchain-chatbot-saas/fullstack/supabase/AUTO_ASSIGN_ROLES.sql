-- ============================================
-- AUTO ASSIGN WORKSPACE & ROLE ON SIGNUP
-- ============================================
-- This creates workspace and assigns owner role
-- automatically when user signs up
-- ============================================

-- Function: Auto-create workspace and assign owner role
CREATE OR REPLACE FUNCTION auto_setup_user_workspace()
RETURNS TRIGGER AS $$
DECLARE
  v_workspace_id UUID;
  v_owner_role_id UUID;
  v_workspace_name TEXT;
BEGIN
  -- Get workspace owner role ID
  SELECT id INTO v_owner_role_id
  FROM roles
  WHERE name = 'workspace_owner'
  LIMIT 1;

  -- Generate workspace name from email
  v_workspace_name := SPLIT_PART(NEW.email, '@', 1) || '''s Workspace';

  -- Create workspace with user ID
  INSERT INTO workspaces (id, name, slug, plan)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'company_name', v_workspace_name),
    LOWER(REGEXP_REPLACE(COALESCE(NEW.raw_user_meta_data->>'company_name', NEW.email), '[^a-zA-Z0-9]+', '-', 'g')),
    'free'
  )
  ON CONFLICT (id) DO NOTHING
  RETURNING id INTO v_workspace_id;

  -- Assign owner role to user
  IF v_workspace_id IS NOT NULL AND v_owner_role_id IS NOT NULL THEN
    INSERT INTO user_roles (user_id, role_id, workspace_id)
    VALUES (NEW.id, v_owner_role_id, v_workspace_id)
    ON CONFLICT (user_id, role_id, workspace_id) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION auto_setup_user_workspace();

-- Test: Check if trigger exists
SELECT 
  'Trigger Status:' as check_type,
  tgname as trigger_name,
  '✅ ACTIVE' as status
FROM pg_trigger
WHERE tgname = 'on_auth_user_created';

-- Verify function exists
SELECT 
  'Function Status:' as check_type,
  proname as function_name,
  '✅ ACTIVE' as status
FROM pg_proc
WHERE proname = 'auto_setup_user_workspace';

-- Success message
SELECT '
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ AUTO WORKSPACE SETUP ENABLED!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

What happens on signup:
1. User creates account
2. Workspace auto-created (user_id = workspace_id)
3. Owner role auto-assigned
4. User ready to create chatbots!

How it works:
✅ Trigger: on_auth_user_created
✅ Function: auto_setup_user_workspace()
✅ Executes: After INSERT on auth.users
✅ Creates: Workspace + User Role

Test it:
1. Sign up new account
2. Check workspaces table → Should have entry
3. Check user_roles table → Should have owner role
4. Create chatbot → Should work! ✅

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
' as result;
