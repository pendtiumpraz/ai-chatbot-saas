-- ============================================
-- ENABLE RLS - CLEAN VERSION
-- ============================================
-- Run this to enable Row Level Security
-- ============================================

-- Step 1: Enable RLS on all tables
ALTER TABLE IF EXISTS workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS chatbots ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS audit_logs ENABLE ROW LEVEL SECURITY;

-- Step 2: Drop old policies if exist
DROP POLICY IF EXISTS "Users can manage chatbots in their workspace" ON chatbots;
DROP POLICY IF EXISTS "Users can manage their workspace chatbots" ON chatbots;
DROP POLICY IF EXISTS "workspace_chatbots_policy" ON chatbots;
DROP POLICY IF EXISTS "chatbot_workspace_policy" ON chatbots;

-- Step 3: Create simple chatbot policy
CREATE POLICY "chatbot_access"
ON chatbots FOR ALL
USING (
  workspace_id IN (
    SELECT workspace_id 
    FROM user_roles 
    WHERE user_id = auth.uid()
  )
)
WITH CHECK (
  workspace_id IN (
    SELECT workspace_id 
    FROM user_roles 
    WHERE user_id = auth.uid()
  )
);

-- Step 4: Verify
SELECT 
  tablename,
  policyname,
  cmd
FROM pg_policies
WHERE tablename = 'chatbots'
AND schemaname = 'public';

-- Success message
SELECT 'RLS Enabled Successfully!' as result;
