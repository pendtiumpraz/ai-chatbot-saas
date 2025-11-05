-- ============================================
-- CHECK WHICH TABLES EXIST IN YOUR DATABASE
-- ============================================
-- Run this FIRST to see what tables you have
-- ============================================

SELECT 
  table_name,
  table_type
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- This will show all your tables
-- Common tables in this project:
-- - workspaces
-- - chatbots
-- - documents
-- - conversations
-- - api_keys
-- - credit_accounts
-- - credit_transactions
-- - usage_logs
-- - messages (if it exists)
