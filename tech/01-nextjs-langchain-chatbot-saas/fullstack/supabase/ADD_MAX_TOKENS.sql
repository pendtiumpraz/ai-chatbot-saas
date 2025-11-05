-- ============================================
-- ADD MAX_TOKENS COLUMN TO CHATBOTS
-- ============================================
-- This fixes: "Could not find the 'max_tokens' column"
-- ============================================

-- Step 1: Check if column already exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'chatbots' 
    AND column_name = 'max_tokens'
  ) THEN
    -- Add max_tokens column
    ALTER TABLE chatbots
    ADD COLUMN max_tokens INTEGER DEFAULT 2048 CHECK (max_tokens > 0 AND max_tokens <= 128000);

    RAISE NOTICE '✅ Added max_tokens column to chatbots table';
  ELSE
    RAISE NOTICE '⚠️  max_tokens column already exists';
  END IF;
END $$;

-- Step 2: Add comment
COMMENT ON COLUMN chatbots.max_tokens IS 'Maximum tokens for AI response (default: 2048)';

-- Step 3: Update existing chatbots with default value if NULL
UPDATE chatbots 
SET max_tokens = 2048 
WHERE max_tokens IS NULL;

-- Step 4: Verify
SELECT 
  '✅ Verification' as step,
  column_name,
  data_type,
  column_default,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'chatbots' 
AND column_name = 'max_tokens';

-- ============================================
-- DONE!
-- ============================================
SELECT '
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ MAX_TOKENS COLUMN ADDED!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Column Details:
- Name: max_tokens
- Type: INTEGER
- Default: 2048
- Range: 1 to 128,000
- Constraint: Must be positive

Now you can create chatbots! 🚀
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
' as result;
