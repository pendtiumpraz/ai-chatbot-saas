-- ============================================
-- VERIFICATION SCRIPT FOR SOFT DELETE MIGRATION
-- ============================================
-- Run this AFTER applying 001_add_soft_delete.sql
-- ============================================

-- 1. Check if soft delete columns exist in all tables
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE column_name IN ('deleted_at', 'deleted_by')
  AND table_schema = 'public'
ORDER BY table_name, column_name;

-- Expected output: All main tables should have both columns

-- ============================================

-- 2. Check if indexes were created
SELECT 
  schemaname,
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE indexname LIKE '%deleted%'
  AND schemaname = 'public'
ORDER BY tablename, indexname;

-- Expected output: Indexes for all tables with deleted_at

-- ============================================

-- 3. Check if views were created
SELECT 
  table_name,
  view_definition
FROM information_schema.views
WHERE table_name LIKE 'active_%'
  AND table_schema = 'public'
ORDER BY table_name;

-- Expected output: 6 views (active_workspaces, active_chatbots, etc.)

-- ============================================

-- 4. Check if functions were created
SELECT 
  routine_name,
  routine_type,
  data_type
FROM information_schema.routines
WHERE routine_name IN (
  'restore_workspace',
  'restore_chatbot',
  'restore_document',
  'restore_conversation',
  'permanent_delete_old_records',
  'is_deleted'
)
  AND routine_schema = 'public'
ORDER BY routine_name;

-- Expected output: 6 functions

-- ============================================

-- 5. Test soft delete on a sample workspace (if exists)
-- WARNING: This will soft-delete a real workspace!
-- Uncomment only if you want to test:

-- UPDATE workspaces 
-- SET deleted_at = NOW(), 
--     deleted_by = auth.uid()
-- WHERE id = (SELECT id FROM workspaces LIMIT 1)
-- RETURNING id, name, deleted_at;

-- Then check:
-- SELECT * FROM workspaces WHERE deleted_at IS NOT NULL;
-- SELECT * FROM active_workspaces; -- Should not show deleted workspace

-- ============================================

-- 6. Test restore function (use actual IDs from your database)
-- Uncomment to test:

-- SELECT restore_workspace(
--   'your-workspace-id-here'::UUID,
--   'your-user-id-here'::UUID
-- );

-- Then verify:
-- SELECT id, name, deleted_at FROM workspaces WHERE id = 'your-workspace-id-here';

-- ============================================

-- 7. Count records by deleted status
SELECT 
  'workspaces' as table_name,
  COUNT(*) FILTER (WHERE deleted_at IS NULL) as active_count,
  COUNT(*) FILTER (WHERE deleted_at IS NOT NULL) as deleted_count,
  COUNT(*) as total_count
FROM workspaces
UNION ALL
SELECT 
  'chatbots',
  COUNT(*) FILTER (WHERE deleted_at IS NULL),
  COUNT(*) FILTER (WHERE deleted_at IS NOT NULL),
  COUNT(*)
FROM chatbots
UNION ALL
SELECT 
  'documents',
  COUNT(*) FILTER (WHERE deleted_at IS NULL),
  COUNT(*) FILTER (WHERE deleted_at IS NOT NULL),
  COUNT(*)
FROM documents
UNION ALL
SELECT 
  'conversations',
  COUNT(*) FILTER (WHERE deleted_at IS NULL),
  COUNT(*) FILTER (WHERE deleted_at IS NOT NULL),
  COUNT(*)
FROM conversations
UNION ALL
SELECT 
  'messages',
  COUNT(*) FILTER (WHERE deleted_at IS NULL),
  COUNT(*) FILTER (WHERE deleted_at IS NOT NULL),
  COUNT(*)
FROM messages
UNION ALL
SELECT 
  'api_keys',
  COUNT(*) FILTER (WHERE deleted_at IS NULL),
  COUNT(*) FILTER (WHERE deleted_at IS NOT NULL),
  COUNT(*)
FROM api_keys;

-- ============================================
-- VERIFICATION COMPLETE
-- ============================================

-- If all checks pass:
-- ✅ Soft delete columns exist
-- ✅ Indexes created
-- ✅ Views created
-- ✅ Functions created
-- ✅ Ready to use soft delete!

-- Next steps:
-- 1. Run migration 002_rbac_system.sql
-- 2. Run migration 003_audit_logs.sql
-- 3. Run seeds.sql (optional test data)
