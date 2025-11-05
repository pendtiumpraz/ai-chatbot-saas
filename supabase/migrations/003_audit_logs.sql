-- ============================================
-- MIGRATION 003: AUDIT LOGS & ACTIVITY TRACKING
-- ============================================
-- Purpose: Track all user actions for security and compliance
-- Author: AI Assistant
-- Date: 2025-01-05

-- ============================================
-- 1. AUDIT_LOGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  workspace_id UUID REFERENCES workspaces(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL, -- e.g., 'create_chatbot', 'delete_document'
  resource_type VARCHAR(50) NOT NULL, -- e.g., 'chatbot', 'document', 'user'
  resource_id UUID, -- ID of the affected resource
  old_values JSONB, -- Previous state (for updates/deletes)
  new_values JSONB, -- New state (for creates/updates)
  ip_address INET,
  user_agent TEXT,
  status VARCHAR(20) DEFAULT 'success', -- success, failed, error
  error_message TEXT,
  metadata JSONB, -- Additional context
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for fast queries
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id, created_at DESC);
CREATE INDEX idx_audit_logs_workspace ON audit_logs(workspace_id, created_at DESC);
CREATE INDEX idx_audit_logs_action ON audit_logs(action, created_at DESC);
CREATE INDEX idx_audit_logs_resource ON audit_logs(resource_type, resource_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);
CREATE INDEX idx_audit_logs_ip ON audit_logs(ip_address);

COMMENT ON TABLE audit_logs IS 'Comprehensive audit trail of all user actions';

-- ============================================
-- 2. SECURITY_EVENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS security_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  event_type VARCHAR(50) NOT NULL, -- login_success, login_failed, password_reset, etc.
  severity VARCHAR(20) NOT NULL, -- low, medium, high, critical
  ip_address INET,
  user_agent TEXT,
  location JSONB, -- { country, city, etc. }
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_security_events_user ON security_events(user_id, created_at DESC);
CREATE INDEX idx_security_events_type ON security_events(event_type, created_at DESC);
CREATE INDEX idx_security_events_severity ON security_events(severity, created_at DESC);
CREATE INDEX idx_security_events_ip ON security_events(ip_address);
CREATE INDEX idx_security_events_created_at ON security_events(created_at DESC);

COMMENT ON TABLE security_events IS 'Security-related events for monitoring';

-- ============================================
-- 3. ACTIVITY_FEED TABLE (User-facing)
-- ============================================
CREATE TABLE IF NOT EXISTS activity_feed (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Who did it
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(50) NOT NULL,
  resource_id UUID,
  resource_name VARCHAR(255), -- Human-readable name
  description TEXT, -- User-friendly description
  is_read BOOLEAN DEFAULT false,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_activity_feed_user ON activity_feed(user_id, created_at DESC);
CREATE INDEX idx_activity_feed_workspace ON activity_feed(workspace_id, created_at DESC);
CREATE INDEX idx_activity_feed_read ON activity_feed(is_read, created_at DESC);

COMMENT ON TABLE activity_feed IS 'User-friendly activity feed for dashboard';

-- ============================================
-- 4. RATE_LIMIT_LOGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS rate_limit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ip_address INET NOT NULL,
  endpoint VARCHAR(255) NOT NULL,
  method VARCHAR(10) NOT NULL,
  rate_limit_key VARCHAR(255) NOT NULL, -- e.g., 'api:user:123'
  hits_count INTEGER DEFAULT 1,
  limit_exceeded BOOLEAN DEFAULT false,
  window_start TIMESTAMP WITH TIME ZONE NOT NULL,
  window_end TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_rate_limit_user ON rate_limit_logs(user_id, created_at DESC);
CREATE INDEX idx_rate_limit_ip ON rate_limit_logs(ip_address, created_at DESC);
CREATE INDEX idx_rate_limit_key ON rate_limit_logs(rate_limit_key, window_start);
CREATE INDEX idx_rate_limit_exceeded ON rate_limit_logs(limit_exceeded, created_at DESC);

COMMENT ON TABLE rate_limit_logs IS 'Track rate limiting for abuse prevention';

-- ============================================
-- 5. HELPER FUNCTIONS
-- ============================================

-- Function to log audit event
CREATE OR REPLACE FUNCTION log_audit_event(
  p_user_id UUID,
  p_workspace_id UUID,
  p_action VARCHAR,
  p_resource_type VARCHAR,
  p_resource_id UUID DEFAULT NULL,
  p_old_values JSONB DEFAULT NULL,
  p_new_values JSONB DEFAULT NULL,
  p_ip_address INET DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  log_id UUID;
BEGIN
  INSERT INTO audit_logs (
    user_id, workspace_id, action, resource_type, resource_id,
    old_values, new_values, ip_address, user_agent, metadata
  ) VALUES (
    p_user_id, p_workspace_id, p_action, p_resource_type, p_resource_id,
    p_old_values, p_new_values, p_ip_address, p_user_agent, p_metadata
  )
  RETURNING id INTO log_id;
  
  RETURN log_id;
END;
$$ LANGUAGE plpgsql;

-- Function to log security event
CREATE OR REPLACE FUNCTION log_security_event(
  p_user_id UUID,
  p_event_type VARCHAR,
  p_severity VARCHAR DEFAULT 'low',
  p_ip_address INET DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL,
  p_details JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  event_id UUID;
BEGIN
  INSERT INTO security_events (
    user_id, event_type, severity, ip_address, user_agent, details
  ) VALUES (
    p_user_id, p_event_type, p_severity, p_ip_address, p_user_agent, p_details
  )
  RETURNING id INTO event_id;
  
  RETURN event_id;
END;
$$ LANGUAGE plpgsql;

-- Function to add activity to feed
CREATE OR REPLACE FUNCTION add_activity_feed(
  p_user_id UUID,
  p_workspace_id UUID,
  p_actor_id UUID,
  p_action VARCHAR,
  p_resource_type VARCHAR,
  p_resource_id UUID DEFAULT NULL,
  p_resource_name VARCHAR DEFAULT NULL,
  p_description TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  activity_id UUID;
BEGIN
  INSERT INTO activity_feed (
    user_id, workspace_id, actor_id, action, resource_type,
    resource_id, resource_name, description, metadata
  ) VALUES (
    p_user_id, p_workspace_id, p_actor_id, p_action, p_resource_type,
    p_resource_id, p_resource_name, p_description, p_metadata
  )
  RETURNING id INTO activity_id;
  
  RETURN activity_id;
END;
$$ LANGUAGE plpgsql;

-- Function to detect suspicious activity
CREATE OR REPLACE FUNCTION detect_suspicious_activity(
  p_user_id UUID,
  p_time_window INTERVAL DEFAULT '1 hour'
)
RETURNS TABLE(
  issue_type VARCHAR,
  severity VARCHAR,
  count BIGINT,
  details JSONB
) AS $$
BEGIN
  -- Check for too many failed logins
  RETURN QUERY
  SELECT 
    'failed_logins'::VARCHAR,
    'high'::VARCHAR,
    COUNT(*)::BIGINT,
    jsonb_build_object(
      'user_id', p_user_id,
      'time_window', p_time_window,
      'ip_addresses', jsonb_agg(DISTINCT ip_address)
    )
  FROM security_events
  WHERE user_id = p_user_id
    AND event_type = 'login_failed'
    AND created_at > NOW() - p_time_window
  HAVING COUNT(*) > 5;
  
  -- Check for unusual number of API calls
  RETURN QUERY
  SELECT 
    'high_api_usage'::VARCHAR,
    'medium'::VARCHAR,
    COUNT(*)::BIGINT,
    jsonb_build_object(
      'user_id', p_user_id,
      'actions', jsonb_agg(DISTINCT action)
    )
  FROM audit_logs
  WHERE user_id = p_user_id
    AND created_at > NOW() - p_time_window
  HAVING COUNT(*) > 1000;
  
  -- Check for access from multiple IPs
  RETURN QUERY
  SELECT 
    'multiple_ip_addresses'::VARCHAR,
    'medium'::VARCHAR,
    COUNT(DISTINCT ip_address)::BIGINT,
    jsonb_build_object(
      'user_id', p_user_id,
      'ip_addresses', jsonb_agg(DISTINCT ip_address)
    )
  FROM audit_logs
  WHERE user_id = p_user_id
    AND created_at > NOW() - p_time_window
  HAVING COUNT(DISTINCT ip_address) > 5;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 6. AUTOMATIC TRIGGERS FOR AUDIT LOGGING
-- ============================================

-- Trigger function for workspaces
CREATE OR REPLACE FUNCTION audit_workspaces()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM log_audit_event(
      NEW.user_id,
      NEW.id,
      'create_workspace',
      'workspace',
      NEW.id,
      NULL,
      row_to_json(NEW)::jsonb
    );
  ELSIF TG_OP = 'UPDATE' THEN
    PERFORM log_audit_event(
      NEW.user_id,
      NEW.id,
      'update_workspace',
      'workspace',
      NEW.id,
      row_to_json(OLD)::jsonb,
      row_to_json(NEW)::jsonb
    );
  ELSIF TG_OP = 'DELETE' THEN
    PERFORM log_audit_event(
      OLD.user_id,
      OLD.id,
      'delete_workspace',
      'workspace',
      OLD.id,
      row_to_json(OLD)::jsonb,
      NULL
    );
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_audit_workspaces
  AFTER INSERT OR UPDATE OR DELETE ON workspaces
  FOR EACH ROW
  EXECUTE FUNCTION audit_workspaces();

-- Trigger function for chatbots
CREATE OR REPLACE FUNCTION audit_chatbots()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM log_audit_event(
      (SELECT user_id FROM workspaces WHERE id = NEW.workspace_id),
      NEW.workspace_id,
      'create_chatbot',
      'chatbot',
      NEW.id,
      NULL,
      to_jsonb(NEW) - 'system_prompt' -- Don't log full prompt
    );
  ELSIF TG_OP = 'UPDATE' THEN
    PERFORM log_audit_event(
      (SELECT user_id FROM workspaces WHERE id = NEW.workspace_id),
      NEW.workspace_id,
      'update_chatbot',
      'chatbot',
      NEW.id,
      to_jsonb(OLD) - 'system_prompt',
      to_jsonb(NEW) - 'system_prompt'
    );
  ELSIF TG_OP = 'DELETE' THEN
    PERFORM log_audit_event(
      (SELECT user_id FROM workspaces WHERE id = OLD.workspace_id),
      OLD.workspace_id,
      'delete_chatbot',
      'chatbot',
      OLD.id,
      to_jsonb(OLD) - 'system_prompt',
      NULL
    );
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_audit_chatbots
  AFTER INSERT OR UPDATE OR DELETE ON chatbots
  FOR EACH ROW
  EXECUTE FUNCTION audit_chatbots();

-- ============================================
-- 7. VIEWS FOR REPORTING
-- ============================================

-- Recent activity view
CREATE OR REPLACE VIEW recent_activity AS
SELECT 
  al.id,
  al.user_id,
  al.workspace_id,
  al.action,
  al.resource_type,
  al.resource_id,
  al.created_at,
  al.ip_address,
  w.name as workspace_name
FROM audit_logs al
LEFT JOIN workspaces w ON al.workspace_id = w.id
ORDER BY al.created_at DESC
LIMIT 100;

-- Security alerts view
CREATE OR REPLACE VIEW security_alerts AS
SELECT 
  se.id,
  se.user_id,
  se.event_type,
  se.severity,
  se.ip_address,
  se.created_at,
  se.details
FROM security_events se
WHERE se.severity IN ('high', 'critical')
ORDER BY se.created_at DESC;

-- User activity summary
CREATE OR REPLACE VIEW user_activity_summary AS
SELECT 
  user_id,
  COUNT(*) as total_actions,
  COUNT(DISTINCT DATE(created_at)) as active_days,
  COUNT(DISTINCT action) as unique_actions,
  MAX(created_at) as last_activity,
  COUNT(DISTINCT ip_address) as unique_ips
FROM audit_logs
WHERE created_at > NOW() - INTERVAL '30 days'
GROUP BY user_id;

-- ============================================
-- 8. CLEANUP FUNCTIONS
-- ============================================

-- Function to archive old audit logs (move to separate table or delete)
CREATE OR REPLACE FUNCTION archive_old_audit_logs(days_old INTEGER DEFAULT 90)
RETURNS BIGINT AS $$
DECLARE
  archived_count BIGINT;
BEGIN
  -- In production, you might want to move to an archive table instead
  DELETE FROM audit_logs
  WHERE created_at < NOW() - INTERVAL '1 day' * days_old
    AND action NOT IN ('delete_workspace', 'delete_user') -- Keep important deletes
  RETURNING COUNT(*) INTO archived_count;
  
  RETURN archived_count;
END;
$$ LANGUAGE plpgsql;

-- Function to cleanup old security events
CREATE OR REPLACE FUNCTION cleanup_old_security_events(days_old INTEGER DEFAULT 180)
RETURNS BIGINT AS $$
DECLARE
  deleted_count BIGINT;
BEGIN
  DELETE FROM security_events
  WHERE created_at < NOW() - INTERVAL '1 day' * days_old
    AND severity NOT IN ('high', 'critical')
  RETURNING COUNT(*) INTO deleted_count;
  
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- MIGRATION COMPLETE
-- ============================================

-- To verify:
-- SELECT COUNT(*) FROM audit_logs;
-- SELECT * FROM security_events ORDER BY created_at DESC LIMIT 10;
-- SELECT * FROM recent_activity;
-- SELECT * FROM security_alerts;
