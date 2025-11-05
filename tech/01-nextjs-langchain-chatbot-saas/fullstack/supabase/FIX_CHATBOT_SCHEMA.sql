-- ============================================
-- FIX CHATBOT SCHEMA - ADD MISSING COLUMNS
-- ============================================
-- This fixes: "Could not find column" errors
-- ============================================

-- Step 1: Show current chatbots schema
SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as separator;
SELECT '📋 Current Chatbots Schema' as step;
SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as separator;

SELECT 
  column_name,
  data_type,
  column_default,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'chatbots'
ORDER BY ordinal_position;

-- ============================================
-- ADD MISSING COLUMNS
-- ============================================

SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as separator;
SELECT '🔧 Adding Missing Columns...' as step;
SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as separator;

-- 1. Add max_tokens column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'chatbots' AND column_name = 'max_tokens'
  ) THEN
    ALTER TABLE chatbots
    ADD COLUMN max_tokens INTEGER DEFAULT 2048 
    CHECK (max_tokens > 0 AND max_tokens <= 128000);
    
    RAISE NOTICE '✅ Added: max_tokens (INTEGER, default: 2048)';
  ELSE
    RAISE NOTICE '⚠️  max_tokens already exists';
  END IF;
END $$;

-- 2. Add ai_provider column (for multi-AI support)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'chatbots' AND column_name = 'ai_provider'
  ) THEN
    ALTER TABLE chatbots
    ADD COLUMN ai_provider VARCHAR(50) DEFAULT 'openai'
    CHECK (ai_provider IN ('openai', 'anthropic', 'google', 'custom'));
    
    RAISE NOTICE '✅ Added: ai_provider (VARCHAR, default: openai)';
  ELSE
    RAISE NOTICE '⚠️  ai_provider already exists';
  END IF;
END $$;

-- 3. Add top_p column (for advanced AI settings)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'chatbots' AND column_name = 'top_p'
  ) THEN
    ALTER TABLE chatbots
    ADD COLUMN top_p REAL DEFAULT 1.0
    CHECK (top_p >= 0 AND top_p <= 1);
    
    RAISE NOTICE '✅ Added: top_p (REAL, default: 1.0)';
  ELSE
    RAISE NOTICE '⚠️  top_p already exists';
  END IF;
END $$;

-- 4. Add frequency_penalty column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'chatbots' AND column_name = 'frequency_penalty'
  ) THEN
    ALTER TABLE chatbots
    ADD COLUMN frequency_penalty REAL DEFAULT 0
    CHECK (frequency_penalty >= -2 AND frequency_penalty <= 2);
    
    RAISE NOTICE '✅ Added: frequency_penalty (REAL, default: 0)';
  ELSE
    RAISE NOTICE '⚠️  frequency_penalty already exists';
  END IF;
END $$;

-- 5. Add presence_penalty column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'chatbots' AND column_name = 'presence_penalty'
  ) THEN
    ALTER TABLE chatbots
    ADD COLUMN presence_penalty REAL DEFAULT 0
    CHECK (presence_penalty >= -2 AND presence_penalty <= 2);
    
    RAISE NOTICE '✅ Added: presence_penalty (REAL, default: 0)';
  ELSE
    RAISE NOTICE '⚠️  presence_penalty already exists';
  END IF;
END $$;

-- 6. Ensure deleted_at exists (soft delete)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'chatbots' AND column_name = 'deleted_at'
  ) THEN
    ALTER TABLE chatbots
    ADD COLUMN deleted_at TIMESTAMPTZ,
    ADD COLUMN deleted_by UUID REFERENCES auth.users(id);
    
    CREATE INDEX IF NOT EXISTS idx_chatbots_deleted_at ON chatbots(deleted_at);
    
    RAISE NOTICE '✅ Added: deleted_at, deleted_by (soft delete)';
  ELSE
    RAISE NOTICE '⚠️  deleted_at already exists';
  END IF;
END $$;

-- ============================================
-- ADD COMMENTS
-- ============================================

COMMENT ON COLUMN chatbots.max_tokens IS 'Maximum tokens for AI response (1-128000)';
COMMENT ON COLUMN chatbots.ai_provider IS 'AI provider: openai, anthropic, google, custom';
COMMENT ON COLUMN chatbots.top_p IS 'Nucleus sampling parameter (0-1)';
COMMENT ON COLUMN chatbots.frequency_penalty IS 'Frequency penalty (-2 to 2)';
COMMENT ON COLUMN chatbots.presence_penalty IS 'Presence penalty (-2 to 2)';

-- ============================================
-- UPDATE EXISTING RECORDS
-- ============================================

SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as separator;
SELECT '🔄 Updating Existing Records...' as step;
SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as separator;

-- Set default values for existing chatbots
UPDATE chatbots 
SET 
  max_tokens = COALESCE(max_tokens, 2048),
  ai_provider = COALESCE(ai_provider, 'openai'),
  top_p = COALESCE(top_p, 1.0),
  frequency_penalty = COALESCE(frequency_penalty, 0),
  presence_penalty = COALESCE(presence_penalty, 0)
WHERE 
  max_tokens IS NULL 
  OR ai_provider IS NULL 
  OR top_p IS NULL 
  OR frequency_penalty IS NULL 
  OR presence_penalty IS NULL;

-- ============================================
-- VERIFICATION
-- ============================================

SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as separator;
SELECT '✅ Updated Schema' as step;
SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as separator;

SELECT 
  column_name,
  data_type,
  column_default,
  is_nullable,
  CASE 
    WHEN column_name IN ('max_tokens', 'ai_provider', 'top_p', 'frequency_penalty', 'presence_penalty', 'deleted_at')
    THEN '✅ NEW'
    ELSE '  '
  END as status
FROM information_schema.columns
WHERE table_name = 'chatbots'
ORDER BY ordinal_position;

-- Check constraints
SELECT 
  '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as separator,
  '🔒 Column Constraints' as step,
  '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as separator;

SELECT 
  constraint_name,
  constraint_type
FROM information_schema.table_constraints
WHERE table_name = 'chatbots'
ORDER BY constraint_type;

-- ============================================
-- TEST INSERT
-- ============================================

SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as separator;
SELECT '🧪 Testing Insert...' as step;
SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as separator;

-- Test if we can reference all columns
DO $$
DECLARE
  test_columns TEXT[];
BEGIN
  SELECT array_agg(column_name) INTO test_columns
  FROM information_schema.columns
  WHERE table_name = 'chatbots'
  AND column_name IN ('max_tokens', 'ai_provider', 'top_p', 'frequency_penalty', 'presence_penalty');
  
  IF array_length(test_columns, 1) >= 5 THEN
    RAISE NOTICE '✅ All required columns exist';
    RAISE NOTICE '✅ Ready to create chatbots!';
  ELSE
    RAISE NOTICE '⚠️  Some columns missing: %', test_columns;
  END IF;
END $$;

-- ============================================
-- FINAL MESSAGE
-- ============================================

SELECT '
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ CHATBOT SCHEMA FIXED!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Columns Added:
✅ max_tokens          → AI response length (default: 2048)
✅ ai_provider         → Multi-AI support (openai/anthropic/google)
✅ top_p               → Nucleus sampling (default: 1.0)
✅ frequency_penalty   → Repetition control (default: 0)
✅ presence_penalty    → Topic diversity (default: 0)
✅ deleted_at          → Soft delete support
✅ deleted_by          → Audit trail

Now you can:
1. Create chatbots ✅
2. Configure AI settings ✅
3. Use multiple AI providers ✅
4. Fine-tune responses ✅

Refresh browser and try again! 🚀
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
' as result;
