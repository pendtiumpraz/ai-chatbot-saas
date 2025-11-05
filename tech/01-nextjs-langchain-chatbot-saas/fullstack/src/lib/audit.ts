// ============================================
// AUDIT LOGGING LIBRARY
// ============================================
// Purpose: Track all user actions for security and compliance
// Author: AI Assistant

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { headers } from 'next/headers'

// ============================================
// TYPES
// ============================================

export type AuditAction =
  // Workspace actions
  | 'create_workspace'
  | 'update_workspace'
  | 'delete_workspace'
  | 'restore_workspace'
  // Chatbot actions
  | 'create_chatbot'
  | 'update_chatbot'
  | 'delete_chatbot'
  | 'restore_chatbot'
  | 'toggle_chatbot_status'
  // Document actions
  | 'upload_document'
  | 'update_document'
  | 'delete_document'
  | 'download_document'
  // Conversation actions
  | 'create_conversation'
  | 'update_conversation'
  | 'delete_conversation'
  | 'export_conversation'
  // API Key actions
  | 'create_api_key'
  | 'update_api_key'
  | 'delete_api_key'
  | 'rotate_api_key'
  // Credit actions
  | 'purchase_credits'
  | 'use_credits'
  | 'refund_credits'
  // Team actions
  | 'invite_member'
  | 'remove_member'
  | 'update_member_role'
  | 'accept_invitation'
  // Auth actions
  | 'login'
  | 'logout'
  | 'signup'
  | 'password_reset'
  | 'email_change'
  // Settings actions
  | 'update_profile'
  | 'enable_2fa'
  | 'disable_2fa'
  | 'update_notification_settings'
  // Admin actions
  | 'ban_user'
  | 'unban_user'
  | 'impersonate_user'
  | 'view_user_details'
  | 'export_data'

export type ResourceType =
  | 'workspace'
  | 'chatbot'
  | 'document'
  | 'conversation'
  | 'message'
  | 'api_key'
  | 'credit'
  | 'user'
  | 'team'
  | 'invitation'
  | 'setting'

export type SecurityEventType =
  | 'login_success'
  | 'login_failed'
  | 'logout'
  | 'signup'
  | 'password_reset_request'
  | 'password_reset_complete'
  | 'email_change'
  | 'email_verification'
  | '2fa_enabled'
  | '2fa_disabled'
  | '2fa_failed'
  | 'suspicious_activity'
  | 'rate_limit_exceeded'
  | 'unauthorized_access'
  | 'token_expired'
  | 'session_hijack_attempt'

export type SecuritySeverity = 'low' | 'medium' | 'high' | 'critical'

export interface AuditLogEntry {
  userId?: string
  workspaceId?: string
  action: AuditAction
  resourceType: ResourceType
  resourceId?: string
  oldValues?: any
  newValues?: any
  ipAddress?: string
  userAgent?: string
  status?: 'success' | 'failed' | 'error'
  errorMessage?: string
  metadata?: Record<string, any>
}

export interface SecurityEventEntry {
  userId?: string
  eventType: SecurityEventType
  severity: SecuritySeverity
  ipAddress?: string
  userAgent?: string
  location?: {
    country?: string
    city?: string
    region?: string
  }
  details?: Record<string, any>
}

export interface ActivityFeedEntry {
  userId: string
  workspaceId: string
  actorId: string
  action: AuditAction
  resourceType: ResourceType
  resourceId?: string
  resourceName?: string
  description?: string
  metadata?: Record<string, any>
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get client IP address from headers
 */
export function getClientIP(): string | null {
  const headersList = headers()
  
  // Try different headers (depends on your hosting)
  const forwardedFor = headersList.get('x-forwarded-for')
  const realIP = headersList.get('x-real-ip')
  const cfConnectingIP = headersList.get('cf-connecting-ip') // Cloudflare
  
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim()
  }
  
  if (realIP) {
    return realIP
  }
  
  if (cfConnectingIP) {
    return cfConnectingIP
  }
  
  return null
}

/**
 * Get user agent from headers
 */
export function getUserAgent(): string | null {
  const headersList = headers()
  return headersList.get('user-agent')
}

/**
 * Sanitize sensitive data before logging
 */
function sanitizeData(data: any): any {
  if (!data) return data
  
  const sensitiveKeys = [
    'password',
    'api_key',
    'encrypted_key',
    'secret',
    'token',
    'private_key',
    'credit_card',
    'ssn'
  ]
  
  if (typeof data === 'object') {
    const sanitized = { ...data }
    
    for (const key of Object.keys(sanitized)) {
      const lowerKey = key.toLowerCase()
      
      if (sensitiveKeys.some(sk => lowerKey.includes(sk))) {
        sanitized[key] = '[REDACTED]'
      } else if (typeof sanitized[key] === 'object') {
        sanitized[key] = sanitizeData(sanitized[key])
      }
    }
    
    return sanitized
  }
  
  return data
}

// ============================================
// MAIN LOGGING FUNCTIONS
// ============================================

/**
 * Log audit event
 */
export async function logAudit(entry: AuditLogEntry): Promise<string | null> {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    const { data, error } = await supabase.rpc('log_audit_event', {
      p_user_id: entry.userId || null,
      p_workspace_id: entry.workspaceId || null,
      p_action: entry.action,
      p_resource_type: entry.resourceType,
      p_resource_id: entry.resourceId || null,
      p_old_values: sanitizeData(entry.oldValues) || null,
      p_new_values: sanitizeData(entry.newValues) || null,
      p_ip_address: entry.ipAddress || getClientIP(),
      p_user_agent: entry.userAgent || getUserAgent(),
      p_metadata: entry.metadata || null
    })
    
    if (error) {
      console.error('Failed to log audit event:', error)
      return null
    }
    
    return data
  } catch (error) {
    console.error('Error logging audit:', error)
    return null
  }
}

/**
 * Log security event
 */
export async function logSecurityEvent(entry: SecurityEventEntry): Promise<string | null> {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    const { data, error } = await supabase.rpc('log_security_event', {
      p_user_id: entry.userId || null,
      p_event_type: entry.eventType,
      p_severity: entry.severity,
      p_ip_address: entry.ipAddress || getClientIP(),
      p_user_agent: entry.userAgent || getUserAgent(),
      p_details: entry.details ? {
        ...entry.details,
        location: entry.location
      } : null
    })
    
    if (error) {
      console.error('Failed to log security event:', error)
      return null
    }
    
    return data
  } catch (error) {
    console.error('Error logging security event:', error)
    return null
  }
}

/**
 * Add activity to feed
 */
export async function addActivity(entry: ActivityFeedEntry): Promise<string | null> {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    const { data, error } = await supabase.rpc('add_activity_feed', {
      p_user_id: entry.userId,
      p_workspace_id: entry.workspaceId,
      p_actor_id: entry.actorId,
      p_action: entry.action,
      p_resource_type: entry.resourceType,
      p_resource_id: entry.resourceId || null,
      p_resource_name: entry.resourceName || null,
      p_description: entry.description || null,
      p_metadata: entry.metadata || null
    })
    
    if (error) {
      console.error('Failed to add activity:', error)
      return null
    }
    
    return data
  } catch (error) {
    console.error('Error adding activity:', error)
    return null
  }
}

// ============================================
// CONVENIENCE FUNCTIONS
// ============================================

/**
 * Log create action
 */
export async function logCreate(
  userId: string,
  workspaceId: string,
  resourceType: ResourceType,
  resourceId: string,
  resourceName: string,
  newValues?: any
) {
  await logAudit({
    userId,
    workspaceId,
    action: `create_${resourceType}` as AuditAction,
    resourceType,
    resourceId,
    newValues,
    status: 'success'
  })
  
  await addActivity({
    userId,
    workspaceId,
    actorId: userId,
    action: `create_${resourceType}` as AuditAction,
    resourceType,
    resourceId,
    resourceName,
    description: `Created ${resourceType}: ${resourceName}`
  })
}

/**
 * Log update action
 */
export async function logUpdate(
  userId: string,
  workspaceId: string,
  resourceType: ResourceType,
  resourceId: string,
  resourceName: string,
  oldValues?: any,
  newValues?: any
) {
  await logAudit({
    userId,
    workspaceId,
    action: `update_${resourceType}` as AuditAction,
    resourceType,
    resourceId,
    oldValues,
    newValues,
    status: 'success'
  })
  
  await addActivity({
    userId,
    workspaceId,
    actorId: userId,
    action: `update_${resourceType}` as AuditAction,
    resourceType,
    resourceId,
    resourceName,
    description: `Updated ${resourceType}: ${resourceName}`
  })
}

/**
 * Log delete action
 */
export async function logDelete(
  userId: string,
  workspaceId: string,
  resourceType: ResourceType,
  resourceId: string,
  resourceName: string,
  oldValues?: any
) {
  await logAudit({
    userId,
    workspaceId,
    action: `delete_${resourceType}` as AuditAction,
    resourceType,
    resourceId,
    oldValues,
    status: 'success'
  })
  
  await addActivity({
    userId,
    workspaceId,
    actorId: userId,
    action: `delete_${resourceType}` as AuditAction,
    resourceType,
    resourceId,
    resourceName,
    description: `Deleted ${resourceType}: ${resourceName}`
  })
}

/**
 * Log failed action
 */
export async function logFailed(
  userId: string | undefined,
  action: AuditAction,
  resourceType: ResourceType,
  errorMessage: string
) {
  await logAudit({
    userId,
    action,
    resourceType,
    status: 'failed',
    errorMessage
  })
}

/**
 * Log login attempt
 */
export async function logLogin(userId: string, success: boolean) {
  await logSecurityEvent({
    userId,
    eventType: success ? 'login_success' : 'login_failed',
    severity: success ? 'low' : 'medium'
  })
}

/**
 * Log suspicious activity
 */
export async function logSuspicious(
  userId: string | undefined,
  details: Record<string, any>
) {
  await logSecurityEvent({
    userId,
    eventType: 'suspicious_activity',
    severity: 'high',
    details
  })
}

// ============================================
// QUERY FUNCTIONS
// ============================================

/**
 * Get recent audit logs for user
 */
export async function getUserAuditLogs(
  userId: string,
  limit: number = 50
) {
  const supabase = createRouteHandlerClient({ cookies })
  
  const { data, error } = await supabase
    .from('audit_logs')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)
  
  if (error) {
    console.error('Error fetching audit logs:', error)
    return []
  }
  
  return data
}

/**
 * Get recent security events for user
 */
export async function getUserSecurityEvents(
  userId: string,
  limit: number = 50
) {
  const supabase = createRouteHandlerClient({ cookies })
  
  const { data, error } = await supabase
    .from('security_events')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)
  
  if (error) {
    console.error('Error fetching security events:', error)
    return []
  }
  
  return data
}

/**
 * Get activity feed for workspace
 */
export async function getWorkspaceActivity(
  workspaceId: string,
  limit: number = 50
) {
  const supabase = createRouteHandlerClient({ cookies })
  
  const { data, error } = await supabase
    .from('activity_feed')
    .select('*')
    .eq('workspace_id', workspaceId)
    .order('created_at', { ascending: false })
    .limit(limit)
  
  if (error) {
    console.error('Error fetching activity feed:', error)
    return []
  }
  
  return data
}

/**
 * Detect suspicious activity for user
 */
export async function detectSuspiciousActivity(userId: string) {
  const supabase = createRouteHandlerClient({ cookies })
  
  const { data, error } = await supabase.rpc('detect_suspicious_activity', {
    p_user_id: userId,
    p_time_window: '1 hour'
  })
  
  if (error) {
    console.error('Error detecting suspicious activity:', error)
    return []
  }
  
  return data
}

// ============================================
// EXPORT
// ============================================

export default {
  logAudit,
  logSecurityEvent,
  addActivity,
  logCreate,
  logUpdate,
  logDelete,
  logFailed,
  logLogin,
  logSuspicious,
  getUserAuditLogs,
  getUserSecurityEvents,
  getWorkspaceActivity,
  detectSuspiciousActivity
}
