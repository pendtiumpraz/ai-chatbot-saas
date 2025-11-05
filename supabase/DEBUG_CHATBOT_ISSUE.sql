-- ============================================
-- DEBUG: "Chatbot not found or already deleted"
-- ============================================

-- Step 1: Check if chatbots table exists
SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as separator;
SELECT '📋 Step 1: Checking Chatbots Table' as step;
SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as separator;

SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'chatbots'
ORDER BY ordinal_position;

-- Step 2: Check all chatbots
SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as separator;
SELECT '🤖 Step 2: Listing All Chatbots' as step;
SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as separator;

SELECT 
  id,
  workspace_id,
  name,
  is_active,
  deleted_at,
  CASE 
    WHEN deleted_at IS NULL THEN '✅ Active'
    ELSE '❌ Deleted'
  END as status,
  created_at
FROM chatbots
ORDER BY created_at DESC;

-- Step 3: Check deleted chatbots
SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as separator;
SELECT '🗑️  Step 3: Checking Deleted Chatbots' as step;
SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as separator;

SELECT 
  COUNT(*) FILTER (WHERE deleted_at IS NULL) as active_count,
  COUNT(*) FILTER (WHERE deleted_at IS NOT NULL) as deleted_count,
  COUNT(*) as total_count
FROM chatbots;

-- Step 4: Check if max_tokens column exists
SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as separator;
SELECT '🔍 Step 4: Checking Required Columns' as step;
SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as separator;

SELECT 
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'chatbots' AND column_name = 'max_tokens'
    ) THEN '✅ max_tokens exists'
    ELSE '❌ max_tokens missing'
  END as max_tokens_status,
  
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'chatbots' AND column_name = 'deleted_at'
    ) THEN '✅ deleted_at exists'
    ELSE '❌ deleted_at missing'
  END as deleted_at_status,
  
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'chatbots' AND column_name = 'ai_provider'
    ) THEN '✅ ai_provider exists'
    ELSE '❌ ai_provider missing'
  END as ai_provider_status;

-- Step 5: Test update query
SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as separator;
SELECT '🧪 Step 5: Testing Update Logic' as step;
SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as separator;

-- Check if we can find chatbots with the query used by API
SELECT 
  id,
  name,
  workspace_id,
  deleted_at
FROM chatbots
WHERE deleted_at IS NULL
ORDER BY created_at DESC;

-- Step 6: Check workspace exists
SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as separator;
SELECT '🏢 Step 6: Checking Workspaces' as step;
SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as separator;

SELECT 
  w.id as workspace_id,
  w.name as workspace_name,
  COUNT(c.id) as chatbot_count,
  COUNT(c.id) FILTER (WHERE c.deleted_at IS NULL) as active_chatbots
FROM workspaces w
LEFT JOIN chatbots c ON c.workspace_id = w.id
GROUP BY w.id, w.name
ORDER BY w.created_at DESC;

-- Step 7: Check user permissions
SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as separator;
SELECT '👤 Step 7: Checking User Permissions' as step;
SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as separator;

SELECT 
  au.email,
  r.name as role,
  ur.workspace_id,
  w.name as workspace_name
FROM auth.users au
LEFT JOIN user_roles ur ON ur.user_id = au.id
LEFT JOIN roles r ON r.id = ur.role_id
LEFT JOIN workspaces w ON w.id = ur.workspace_id
ORDER BY au.created_at DESC;

-- ============================================
-- SOLUTION: Fix Any Issues
-- ============================================

SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as separator;
SELECT '🔧 Step 8: Auto-Fix Issues' as step;
SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as separator;

DO $$
DECLARE
  v_missing_columns TEXT[] := ARRAY[]::TEXT[];
  v_chatbot_count INTEGER;
BEGIN
  -- Check for missing columns
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'chatbots' AND column_name = 'max_tokens'
  ) THEN
    v_missing_columns := array_append(v_missing_columns, 'max_tokens');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'chatbots' AND column_name = 'deleted_at'
  ) THEN
    v_missing_columns := array_append(v_missing_columns, 'deleted_at');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'chatbots' AND column_name = 'ai_provider'
  ) THEN
    v_missing_columns := array_append(v_missing_columns, 'ai_provider');
  END IF;

  -- Report missing columns
  IF array_length(v_missing_columns, 1) > 0 THEN
    RAISE NOTICE '❌ Missing columns: %', array_to_string(v_missing_columns, ', ');
    RAISE NOTICE '⚠️  Please run: FIX_CHATBOT_SCHEMA.sql';
  ELSE
    RAISE NOTICE '✅ All required columns exist';
  END IF;

  -- Check chatbot count
  SELECT COUNT(*) INTO v_chatbot_count 
  FROM chatbots 
  WHERE deleted_at IS NULL;

  IF v_chatbot_count = 0 THEN
    RAISE NOTICE '⚠️  No active chatbots found';
    RAISE NOTICE '💡 Create a chatbot first before trying to edit';
  ELSE
    RAISE NOTICE '✅ Found % active chatbot(s)', v_chatbot_count;
  END IF;

END $$;

-- ============================================
-- RECOMMENDATIONS
-- ============================================

SELECT '
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 RECOMMENDATIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

If you see missing columns:
→ Run: FIX_CHATBOT_SCHEMA.sql

If you see no active chatbots:
→ Create a new chatbot first
→ Then try editing

If chatbot exists but update fails:
→ Check browser console (F12)
→ Check Network tab for actual error
→ Verify chatbot ID is correct

Common Issues:
1. max_tokens column missing → Run FIX_CHATBOT_SCHEMA.sql
2. No workspace → Run FIX_API_KEY_ERROR.sql
3. No permission → Check user_roles table
4. Chatbot soft-deleted → Check deleted_at column

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
' as recommendations;
