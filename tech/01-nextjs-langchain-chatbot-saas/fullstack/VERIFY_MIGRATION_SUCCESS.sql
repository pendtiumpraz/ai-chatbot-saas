-- ============================================
-- 🔍 VERIFICATION SCRIPT - CHECK IF MIGRATION SUCCESS
-- ============================================
-- Run this to verify everything is working!
-- ============================================

-- Show header
SELECT '========================================' as result
UNION ALL SELECT '🔍 CHECKING MIGRATION SUCCESS'
UNION ALL SELECT '========================================';

-- ============================================
-- CHECK 1: Soft Delete Columns
-- ============================================
SELECT '
✅ CHECK 1: Soft Delete Columns' as check_name;

SELECT 
  table_name,
  column_name,
  data_type
FROM information_schema.columns
WHERE column_name IN ('deleted_at', 'deleted_by')
  AND table_schema = 'public'
ORDER BY table_name, column_name;

-- Count
SELECT 
  '📊 Total Tables with Soft Delete: ' || COUNT(DISTINCT table_name)::text as result
FROM information_schema.columns
WHERE column_name = 'deleted_at' AND table_schema = 'public';

-- ============================================
-- CHECK 2: RBAC Tables
-- ============================================
SELECT '
✅ CHECK 2: RBAC Tables' as check_name;

SELECT table_name, 
  (SELECT COUNT(*) FROM information_schema.tables t WHERE t.table_name = tables.table_name) as exists
FROM (VALUES 
  ('roles'),
  ('permissions'), 
  ('role_permissions'),
  ('user_roles')
) AS tables(table_name);

-- Count roles
SELECT '📊 Total Roles: ' || COUNT(*)::text as result FROM roles;

-- Show roles
SELECT '
🔐 Available Roles:' as info;
SELECT name, description, hierarchy FROM roles ORDER BY hierarchy;

-- Count permissions
SELECT '
📊 Total Permissions: ' || COUNT(*)::text as result FROM permissions;

-- Show first 10 permissions
SELECT '
🔑 Sample Permissions (first 10):' as info;
SELECT name, resource, action FROM permissions LIMIT 10;

-- ============================================
-- CHECK 3: Audit Tables
-- ============================================
SELECT '
✅ CHECK 3: Audit Tables' as check_name;

SELECT table_name,
  (SELECT COUNT(*) FROM information_schema.tables t WHERE t.table_name = tables.table_name) as exists
FROM (VALUES 
  ('audit_logs'),
  ('security_events'),
  ('activity_feed')
) AS tables(table_name);

-- ============================================
-- CHECK 4: Functions
-- ============================================
SELECT '
✅ CHECK 4: Functions Created' as check_name;

SELECT 
  routine_name,
  routine_type
FROM information_schema.routines
WHERE routine_name IN (
  'restore_workspace',
  'restore_chatbot',
  'user_has_permission',
  'is_super_admin'
)
  AND routine_schema = 'public'
ORDER BY routine_name;

SELECT '📊 Total Restore Functions: ' || COUNT(*)::text as result
FROM information_schema.routines
WHERE routine_name LIKE 'restore_%' AND routine_schema = 'public';

-- ============================================
-- CHECK 5: Views
-- ============================================
SELECT '
✅ CHECK 5: Views for Active Records' as check_name;

SELECT 
  table_name as view_name
FROM information_schema.views
WHERE table_name LIKE 'active_%'
  AND table_schema = 'public'
ORDER BY table_name;

SELECT '📊 Total Active Views: ' || COUNT(*)::text as result
FROM information_schema.views
WHERE table_name LIKE 'active_%' AND table_schema = 'public';

-- ============================================
-- CHECK 6: Indexes
-- ============================================
SELECT '
✅ CHECK 6: Indexes Created' as check_name;

SELECT 
  tablename,
  indexname
FROM pg_indexes
WHERE indexname LIKE '%deleted%'
  AND schemaname = 'public'
ORDER BY tablename, indexname
LIMIT 10;

-- ============================================
-- FINAL SUMMARY
-- ============================================
SELECT '
========================================' as summary
UNION ALL SELECT '🎉 MIGRATION VERIFICATION SUMMARY'
UNION ALL SELECT '========================================';

-- Create summary
WITH summary AS (
  SELECT 
    'Soft Delete Columns' as feature,
    (SELECT COUNT(DISTINCT table_name) FROM information_schema.columns 
     WHERE column_name = 'deleted_at' AND table_schema = 'public')::text || ' tables' as status
  UNION ALL
  SELECT 
    'RBAC Roles',
    (SELECT COUNT(*)::text FROM roles) || ' roles' as status
  UNION ALL
  SELECT 
    'RBAC Permissions',
    (SELECT COUNT(*)::text FROM permissions) || ' permissions' as status
  UNION ALL
  SELECT 
    'Audit Tables',
    (SELECT COUNT(*)::text FROM information_schema.tables 
     WHERE table_name IN ('audit_logs', 'security_events', 'activity_feed') 
     AND table_schema = 'public') || ' tables' as status
  UNION ALL
  SELECT 
    'Restore Functions',
    (SELECT COUNT(*)::text FROM information_schema.routines 
     WHERE routine_name LIKE 'restore_%' AND routine_schema = 'public') || ' functions' as status
  UNION ALL
  SELECT 
    'Active Record Views',
    (SELECT COUNT(*)::text FROM information_schema.views 
     WHERE table_name LIKE 'active_%' AND table_schema = 'public') || ' views' as status
)
SELECT 
  '✅ ' || feature || ': ' || status as result
FROM summary;

SELECT '
========================================' as footer
UNION ALL SELECT '🚀 NEXT STEPS:'
UNION ALL SELECT '========================================'
UNION ALL SELECT '1. Add ENCRYPTION_SECRET to .env.local'
UNION ALL SELECT '2. Restart dev server: npm run dev'
UNION ALL SELECT '3. Open: http://localhost:3000/dashboard'
UNION ALL SELECT '4. Test create/update/delete chatbot'
UNION ALL SELECT '5. Check audit_logs table for entries'
UNION ALL SELECT '========================================'
UNION ALL SELECT '✨ YOU ARE READY TO GO!'
UNION ALL SELECT '========================================';
