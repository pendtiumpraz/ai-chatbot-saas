-- ============================================
-- DATABASE SEEDER - AI CHATBOT SAAS PLATFORM
-- ============================================
-- Purpose: Populate database with realistic sample data
-- Run this AFTER running schema.sql and multi-ai-schema.sql

-- ============================================
-- 1. USERS (via auth.users - Supabase Auth)
-- ============================================
-- NOTE: Users must be created via Supabase Auth
-- This is just for reference/documentation
-- Create these users in Supabase Dashboard > Authentication:

-- User 1: john@example.com (password: Password123!)
-- User 2: sarah@example.com (password: Password123!)
-- User 3: admin@example.com (password: Admin123!)

-- For this seed to work, you need actual user IDs from auth.users
-- Replace these UUIDs with actual ones from your Supabase auth.users table

-- ============================================
-- 2. WORKSPACES
-- ============================================
-- NOTE: Replace user_id values with actual UUIDs from auth.users

INSERT INTO workspaces (id, user_id, name, slug, created_at, updated_at, deleted_at)
VALUES 
  -- Workspace 1 (owned by first user)
  ('11111111-1111-1111-1111-111111111111', 
   (SELECT id FROM auth.users LIMIT 1 OFFSET 0), 
   'TechCorp Solutions', 
   'techcorp-solutions',
   NOW() - INTERVAL '30 days',
   NOW() - INTERVAL '5 days',
   NULL),
  
  -- Workspace 2 (owned by second user)
  ('22222222-2222-2222-2222-222222222222',
   (SELECT id FROM auth.users LIMIT 1 OFFSET 1),
   'E-Commerce Plus',
   'ecommerce-plus',
   NOW() - INTERVAL '20 days',
   NOW() - INTERVAL '3 days',
   NULL),
  
  -- Workspace 3 (owned by first user)
  ('33333333-3333-3333-3333-333333333333',
   (SELECT id FROM auth.users LIMIT 1 OFFSET 0),
   'Healthcare Hub',
   'healthcare-hub',
   NOW() - INTERVAL '15 days',
   NOW() - INTERVAL '1 day',
   NULL);

-- ============================================
-- 3. CHATBOTS
-- ============================================
INSERT INTO chatbots (
  id, 
  workspace_id, 
  name, 
  description, 
  system_prompt, 
  model, 
  temperature, 
  max_tokens,
  pinecone_namespace, 
  use_case, 
  is_active, 
  widget_settings,
  created_at,
  updated_at,
  deleted_at
)
VALUES 
  -- Chatbot 1: Customer Support Bot
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    '11111111-1111-1111-1111-111111111111',
    'Customer Support Bot',
    'Handles customer inquiries 24/7 with AI-powered responses',
    'You are a helpful customer support assistant. Your goal is to help customers resolve their issues quickly and professionally. Always be polite, empathetic, and solution-oriented. If you cannot help with something, politely direct them to human support.',
    'gpt-4-turbo-preview',
    0.7,
    2000,
    'techcorp-support-' || extract(epoch from now())::text,
    'customer-support',
    true,
    '{"theme": "light", "primaryColor": "#8B5CF6", "position": "bottom-right", "greetingMessage": "Hi! How can I help you today?", "avatarUrl": ""}'::jsonb,
    NOW() - INTERVAL '25 days',
    NOW() - INTERVAL '2 days',
    NULL
  ),

  -- Chatbot 2: Sales Assistant
  (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    '11111111-1111-1111-1111-111111111111',
    'Sales Assistant AI',
    'Helps customers find the right products and answers pricing questions',
    'You are a knowledgeable sales assistant. Help customers find the right products, answer questions about features and pricing, and guide them through the purchasing process. Be enthusiastic but not pushy.',
    'gpt-3.5-turbo',
    0.8,
    1500,
    'techcorp-sales-' || extract(epoch from now())::text,
    'sales-assistant',
    true,
    '{"theme": "light", "primaryColor": "#10B981", "position": "bottom-right", "greetingMessage": "Looking for something? I can help!", "avatarUrl": ""}'::jsonb,
    NOW() - INTERVAL '20 days',
    NOW() - INTERVAL '1 day',
    NULL
  ),

  -- Chatbot 3: E-Commerce Help
  (
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    '22222222-2222-2222-2222-222222222222',
    'ShopBot Assistant',
    'Product recommendations and order tracking for e-commerce store',
    'You are a helpful e-commerce assistant. Help customers find products, track orders, handle returns, and answer questions about shipping and policies. Be friendly and efficient.',
    'gpt-4',
    0.7,
    2000,
    'ecommerce-shopbot-' || extract(epoch from now())::text,
    'sales-assistant',
    true,
    '{"theme": "dark", "primaryColor": "#F59E0B", "position": "bottom-left", "greetingMessage": "Welcome! Need help shopping?", "avatarUrl": ""}'::jsonb,
    NOW() - INTERVAL '18 days',
    NOW() - INTERVAL '6 hours',
    NULL
  ),

  -- Chatbot 4: HR Assistant (Paused)
  (
    'dddddddd-dddd-dddd-dddd-dddddddddddd',
    '11111111-1111-1111-1111-111111111111',
    'HR Helper Bot',
    'Employee self-service for HR queries and policies',
    'You are an HR assistant helping employees with HR-related questions. Provide accurate information about policies, benefits, leave requests, and other HR topics while maintaining confidentiality.',
    'claude-3-sonnet-20240229',
    0.6,
    2000,
    'techcorp-hr-' || extract(epoch from now())::text,
    'hr-assistant',
    false,
    '{"theme": "light", "primaryColor": "#3B82F6", "position": "bottom-right", "greetingMessage": "Hi! How can I help with HR matters?", "avatarUrl": ""}'::jsonb,
    NOW() - INTERVAL '10 days',
    NOW() - INTERVAL '3 days',
    NULL
  ),

  -- Chatbot 5: Healthcare Info
  (
    'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
    '33333333-3333-3333-3333-333333333333',
    'MediBot Assistant',
    'Provides general healthcare information and appointment scheduling',
    'You are a healthcare information assistant. Provide general health information and guidance. Always remind users to consult healthcare professionals for medical advice and never provide diagnoses. Help with appointment scheduling and general questions.',
    'gpt-4-turbo-preview',
    0.5,
    2000,
    'healthcare-medibot-' || extract(epoch from now())::text,
    'healthcare-info',
    true,
    '{"theme": "light", "primaryColor": "#EF4444", "position": "bottom-right", "greetingMessage": "Hello! I can help with health information.", "avatarUrl": ""}'::jsonb,
    NOW() - INTERVAL '12 days',
    NOW() - INTERVAL '8 hours',
    NULL
  );

-- ============================================
-- 4. DOCUMENTS
-- ============================================
INSERT INTO documents (
  id,
  chatbot_id,
  filename,
  file_url,
  file_size,
  mime_type,
  chunk_count,
  status,
  error_message,
  created_at,
  updated_at,
  deleted_at
)
VALUES
  -- Documents for Customer Support Bot
  (
    'doc-1111-1111-1111-1111',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'FAQ-General.pdf',
    'https://placeholder-docs.example.com/faq-general.pdf',
    245600,
    'application/pdf',
    45,
    'completed',
    NULL,
    NOW() - INTERVAL '20 days',
    NOW() - INTERVAL '20 days',
    NULL
  ),
  (
    'doc-2222-2222-2222-2222',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'Return-Policy.docx',
    'https://placeholder-docs.example.com/return-policy.docx',
    89600,
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    12,
    'completed',
    NULL,
    NOW() - INTERVAL '18 days',
    NOW() - INTERVAL '18 days',
    NULL
  ),
  (
    'doc-3333-3333-3333-3333',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'Shipping-Information.txt',
    'https://placeholder-docs.example.com/shipping-info.txt',
    15400,
    'text/plain',
    3,
    'completed',
    NULL,
    NOW() - INTERVAL '15 days',
    NOW() - INTERVAL '15 days',
    NULL
  ),

  -- Documents for Sales Bot
  (
    'doc-4444-4444-4444-4444',
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    'Product-Catalog-2024.pdf',
    'https://placeholder-docs.example.com/catalog-2024.pdf',
    1456000,
    'application/pdf',
    230,
    'completed',
    NULL,
    NOW() - INTERVAL '16 days',
    NOW() - INTERVAL '16 days',
    NULL
  ),
  (
    'doc-5555-5555-5555-5555',
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    'Pricing-Guide.pdf',
    'https://placeholder-docs.example.com/pricing.pdf',
    567000,
    'application/pdf',
    78,
    'completed',
    NULL,
    NOW() - INTERVAL '14 days',
    NOW() - INTERVAL '14 days',
    NULL
  ),

  -- Documents for E-Commerce Bot
  (
    'doc-6666-6666-6666-6666',
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    'Store-Policies.pdf',
    'https://placeholder-docs.example.com/policies.pdf',
    234000,
    'application/pdf',
    42,
    'completed',
    NULL,
    NOW() - INTERVAL '10 days',
    NOW() - INTERVAL '10 days',
    NULL
  ),

  -- Document processing
  (
    'doc-7777-7777-7777-7777',
    'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
    'Medical-Guidelines.pdf',
    'https://placeholder-docs.example.com/medical-guidelines.pdf',
    892000,
    'application/pdf',
    0,
    'processing',
    NULL,
    NOW() - INTERVAL '1 hour',
    NOW() - INTERVAL '1 hour',
    NULL
  ),

  -- Failed document
  (
    'doc-8888-8888-8888-8888',
    'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
    'Corrupted-File.pdf',
    'https://placeholder-docs.example.com/corrupted.pdf',
    0,
    'application/pdf',
    0,
    'failed',
    'File corrupted or unreadable',
    NOW() - INTERVAL '2 days',
    NOW() - INTERVAL '2 days',
    NULL
  );

-- ============================================
-- 5. CONVERSATIONS
-- ============================================
INSERT INTO conversations (
  id,
  chatbot_id,
  visitor_id,
  metadata,
  created_at,
  updated_at,
  deleted_at
)
VALUES
  -- Conversations for Support Bot
  (
    'conv-1111-1111-1111-1111',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'visitor-' || md5(random()::text),
    '{"ip": "192.168.1.100", "user_agent": "Mozilla/5.0", "notes": "Customer asking about refund process", "tags": ["refund", "payment"]}'::jsonb,
    NOW() - INTERVAL '5 days',
    NOW() - INTERVAL '5 days',
    NULL
  ),
  (
    'conv-2222-2222-2222-2222',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'visitor-' || md5(random()::text),
    '{"ip": "192.168.1.101", "user_agent": "Chrome/120.0", "notes": "Shipping delay inquiry", "tags": ["shipping", "delay"]}'::jsonb,
    NOW() - INTERVAL '3 days',
    NOW() - INTERVAL '3 days',
    NULL
  ),
  (
    'conv-3333-3333-3333-3333',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'visitor-' || md5(random()::text),
    '{"ip": "192.168.1.102", "user_agent": "Safari/17.0", "notes": "Product compatibility question"}'::jsonb,
    NOW() - INTERVAL '1 day',
    NOW() - INTERVAL '1 day',
    NULL
  ),

  -- Conversations for Sales Bot
  (
    'conv-4444-4444-4444-4444',
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    'visitor-' || md5(random()::text),
    '{"ip": "192.168.1.103", "user_agent": "Firefox/121.0", "notes": "Looking for enterprise pricing", "tags": ["enterprise", "pricing"]}'::jsonb,
    NOW() - INTERVAL '2 days',
    NOW() - INTERVAL '2 days',
    NULL
  ),
  (
    'conv-5555-5555-5555-5555',
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    'visitor-' || md5(random()::text),
    '{"ip": "192.168.1.104", "user_agent": "Edge/120.0"}'::jsonb,
    NOW() - INTERVAL '6 hours',
    NOW() - INTERVAL '6 hours',
    NULL
  ),

  -- Conversations for E-Commerce Bot
  (
    'conv-6666-6666-6666-6666',
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    'visitor-' || md5(random()::text),
    '{"ip": "192.168.1.105", "user_agent": "Chrome/120.0", "notes": "Order tracking #12345", "tags": ["order", "tracking"]}'::jsonb,
    NOW() - INTERVAL '12 hours',
    NOW() - INTERVAL '12 hours',
    NULL
  ),

  -- Recent conversation
  (
    'conv-7777-7777-7777-7777',
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    'visitor-' || md5(random()::text),
    '{"ip": "192.168.1.106", "user_agent": "Mobile Safari/17.0"}'::jsonb,
    NOW() - INTERVAL '30 minutes',
    NOW() - INTERVAL '30 minutes',
    NULL
  );

-- ============================================
-- 6. MESSAGES (for conversations)
-- ============================================
INSERT INTO messages (
  id,
  conversation_id,
  role,
  content,
  created_at
)
VALUES
  -- Conversation 1 messages
  ('msg-1-1', 'conv-1111-1111-1111-1111', 'user', 'Hi, I need help with a refund', NOW() - INTERVAL '5 days'),
  ('msg-1-2', 'conv-1111-1111-1111-1111', 'assistant', 'Hello! I''d be happy to help you with your refund. Can you please provide me with your order number?', NOW() - INTERVAL '5 days' + INTERVAL '2 seconds'),
  ('msg-1-3', 'conv-1111-1111-1111-1111', 'user', 'Order #12345', NOW() - INTERVAL '5 days' + INTERVAL '30 seconds'),
  ('msg-1-4', 'conv-1111-1111-1111-1111', 'assistant', 'Thank you. Let me look up your order. According to our refund policy, you can request a refund within 30 days of purchase. I''ll process this for you right away.', NOW() - INTERVAL '5 days' + INTERVAL '35 seconds'),

  -- Conversation 2 messages
  ('msg-2-1', 'conv-2222-2222-2222-2222', 'user', 'Where is my order? It''s been 5 days', NOW() - INTERVAL '3 days'),
  ('msg-2-2', 'conv-2222-2222-2222-2222', 'assistant', 'I understand your concern. Let me check the shipping status for you. Could you please provide your order number?', NOW() - INTERVAL '3 days' + INTERVAL '3 seconds'),
  ('msg-2-3', 'conv-2222-2222-2222-2222', 'user', 'ORD-789456', NOW() - INTERVAL '3 days' + INTERVAL '20 seconds'),
  ('msg-2-4', 'conv-2222-2222-2222-2222', 'assistant', 'Thank you. Your order is currently in transit and should arrive within 2-3 business days. Here''s your tracking number: TRK123456789', NOW() - INTERVAL '3 days' + INTERVAL '25 seconds'),

  -- Conversation 3 messages
  ('msg-3-1', 'conv-3333-3333-3333-3333', 'user', 'Is Product X compatible with Product Y?', NOW() - INTERVAL '1 day'),
  ('msg-3-2', 'conv-3333-3333-3333-3333', 'assistant', 'Yes! Product X is fully compatible with Product Y. They work together seamlessly. Would you like to know more about the features?', NOW() - INTERVAL '1 day' + INTERVAL '2 seconds'),

  -- Conversation 4 messages
  ('msg-4-1', 'conv-4444-4444-4444-4444', 'user', 'I need enterprise pricing for 100+ users', NOW() - INTERVAL '2 days'),
  ('msg-4-2', 'conv-4444-4444-4444-4444', 'assistant', 'Great! For enterprise pricing with 100+ users, we offer custom packages with significant discounts. Our Enterprise plan starts at $999/month and includes priority support, dedicated account manager, and advanced features. Would you like me to connect you with our sales team?', NOW() - INTERVAL '2 days' + INTERVAL '5 seconds'),

  -- Conversation 5 messages (short)
  ('msg-5-1', 'conv-5555-5555-5555-5555', 'user', 'Do you offer free trial?', NOW() - INTERVAL '6 hours'),
  ('msg-5-2', 'conv-5555-5555-5555-5555', 'assistant', 'Yes! We offer a 14-day free trial with full access to all features. No credit card required. Would you like to start your trial now?', NOW() - INTERVAL '6 hours' + INTERVAL '2 seconds'),

  -- Conversation 6 messages
  ('msg-6-1', 'conv-6666-6666-6666-6666', 'user', 'Track order #12345', NOW() - INTERVAL '12 hours'),
  ('msg-6-2', 'conv-6666-6666-6666-6666', 'assistant', 'Let me check that for you. Order #12345 was shipped yesterday and is currently in transit. Expected delivery: Tomorrow by 5 PM. Tracking: TRK987654321', NOW() - INTERVAL '12 hours' + INTERVAL '3 seconds'),

  -- Conversation 7 messages (recent, ongoing)
  ('msg-7-1', 'conv-7777-7777-7777-7777', 'user', 'Hi', NOW() - INTERVAL '30 minutes'),
  ('msg-7-2', 'conv-7777-7777-7777-7777', 'assistant', 'Hello! Welcome to our store. How can I help you today?', NOW() - INTERVAL '30 minutes' + INTERVAL '2 seconds'),
  ('msg-7-3', 'conv-7777-7777-7777-7777', 'user', 'Looking for wireless headphones', NOW() - INTERVAL '29 minutes'),
  ('msg-7-4', 'conv-7777-7777-7777-7777', 'assistant', 'Great choice! We have several excellent wireless headphones available. What''s your budget and what features are most important to you?', NOW() - INTERVAL '29 minutes' + INTERVAL '2 seconds');

-- ============================================
-- 7. API KEYS (Multi-AI Provider)
-- ============================================
-- NOTE: In production, API keys should be encrypted!
-- These are just examples - NEVER use real API keys in seeds!

INSERT INTO api_keys (
  id,
  workspace_id,
  provider,
  key_name,
  encrypted_key,
  is_active,
  usage_count,
  last_used_at,
  monthly_limit,
  created_at,
  updated_at,
  deleted_at
)
VALUES
  (
    'key-1111-1111-1111-1111',
    '11111111-1111-1111-1111-111111111111',
    'openai',
    'Production OpenAI Key',
    'encrypted_sk-proj-xxxxxxxxxxxxxxxxxx', -- This should be encrypted in real app!
    true,
    1847,
    NOW() - INTERVAL '2 hours',
    100.00,
    NOW() - INTERVAL '25 days',
    NOW() - INTERVAL '2 hours',
    NULL
  ),
  (
    'key-2222-2222-2222-2222',
    '11111111-1111-1111-1111-111111111111',
    'anthropic',
    'Claude API Key',
    'encrypted_sk-ant-yyyyyyyyyyyyyyyyyyyy',
    true,
    523,
    NOW() - INTERVAL '1 day',
    50.00,
    NOW() - INTERVAL '20 days',
    NOW() - INTERVAL '1 day',
    NULL
  ),
  (
    'key-3333-3333-3333-3333',
    '22222222-2222-2222-2222-222222222222',
    'openai',
    'E-Commerce Bot Key',
    'encrypted_sk-proj-zzzzzzzzzzzzzzzzzz',
    true,
    2341,
    NOW() - INTERVAL '4 hours',
    200.00,
    NOW() - INTERVAL '18 days',
    NOW() - INTERVAL '4 hours',
    NULL
  ),
  (
    'key-4444-4444-4444-4444',
    '33333333-3333-3333-3333-333333333333',
    'google',
    'Gemini API Key',
    'encrypted_AIzaSyDxxxxxxxxxxxxxxxxxxxxxxx',
    false,
    89,
    NOW() - INTERVAL '5 days',
    30.00,
    NOW() - INTERVAL '10 days',
    NOW() - INTERVAL '5 days',
    NULL
  );

-- ============================================
-- 8. CREDITS
-- ============================================
INSERT INTO credits (
  id,
  workspace_id,
  balance,
  total_purchased,
  total_used,
  created_at,
  updated_at
)
VALUES
  (
    'credit-1111-1111-1111',
    '11111111-1111-1111-1111-111111111111',
    15.50,
    100.00,
    84.50,
    NOW() - INTERVAL '30 days',
    NOW() - INTERVAL '1 hour'
  ),
  (
    'credit-2222-2222-2222',
    '22222222-2222-2222-2222-222222222222',
    42.30,
    50.00,
    7.70,
    NOW() - INTERVAL '20 days',
    NOW() - INTERVAL '3 hours'
  ),
  (
    'credit-3333-3333-3333',
    '33333333-3333-3333-3333-333333333333',
    8.75,
    25.00,
    16.25,
    NOW() - INTERVAL '15 days',
    NOW() - INTERVAL '30 minutes'
  );

-- ============================================
-- 9. CREDIT TRANSACTIONS
-- ============================================
INSERT INTO credit_transactions (
  id,
  workspace_id,
  amount,
  type,
  description,
  created_at
)
VALUES
  -- TechCorp transactions
  ('trans-1', '11111111-1111-1111-1111-111111111111', 50.00, 'purchase', 'Credit purchase - $50 package', NOW() - INTERVAL '30 days'),
  ('trans-2', '11111111-1111-1111-1111-111111111111', -12.50, 'usage', 'ChatGPT API usage - Customer Support Bot', NOW() - INTERVAL '28 days'),
  ('trans-3', '11111111-1111-1111-1111-111111111111', 50.00, 'purchase', 'Credit purchase - $50 package', NOW() - INTERVAL '15 days'),
  ('trans-4', '11111111-1111-1111-1111-111111111111', -8.30, 'usage', 'ChatGPT API usage - Sales Bot', NOW() - INTERVAL '12 days'),
  ('trans-5', '11111111-1111-1111-1111-111111111111', 5.00, 'bonus', 'Referral bonus', NOW() - INTERVAL '10 days'),
  ('trans-6', '11111111-1111-1111-1111-111111111111', -15.20, 'usage', 'Claude API usage - Multiple bots', NOW() - INTERVAL '7 days'),
  ('trans-7', '11111111-1111-1111-1111-111111111111', -8.50, 'usage', 'ChatGPT API usage - Support Bot', NOW() - INTERVAL '3 days'),

  -- E-Commerce transactions
  ('trans-8', '22222222-2222-2222-2222-222222222222', 50.00, 'purchase', 'Credit purchase - $50 package', NOW() - INTERVAL '20 days'),
  ('trans-9', '22222222-2222-2222-2222-222222222222', -4.20, 'usage', 'ChatGPT API usage - ShopBot', NOW() - INTERVAL '15 days'),
  ('trans-10', '22222222-2222-2222-2222-222222222222', -3.50, 'usage', 'ChatGPT API usage - ShopBot', NOW() - INTERVAL '8 days'),

  -- Healthcare transactions
  ('trans-11', '33333333-3333-3333-3333-333333333333', 25.00, 'purchase', 'Credit purchase - $25 package', NOW() - INTERVAL '15 days'),
  ('trans-12', '33333333-3333-3333-3333-333333333333', -6.75, 'usage', 'ChatGPT API usage - MediBot', NOW() - INTERVAL '10 days'),
  ('trans-13', '33333333-3333-3333-3333-333333333333', -5.50, 'usage', 'ChatGPT API usage - MediBot', NOW() - INTERVAL '5 days'),
  ('trans-14', '33333333-3333-3333-3333-333333333333', -4.00, 'usage', 'ChatGPT API usage - MediBot', NOW() - INTERVAL '1 day');

-- ============================================
-- 10. USAGE LOGS (AI API Usage Tracking)
-- ============================================
INSERT INTO usage_logs (
  id,
  workspace_id,
  chatbot_id,
  api_key_id,
  model,
  tokens_used,
  cost,
  created_at
)
VALUES
  -- Recent usage logs
  ('log-1', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'key-1111-1111-1111-1111', 'gpt-4-turbo-preview', 1250, 0.025, NOW() - INTERVAL '2 hours'),
  ('log-2', '11111111-1111-1111-1111-111111111111', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'key-1111-1111-1111-1111', 'gpt-3.5-turbo', 450, 0.0045, NOW() - INTERVAL '4 hours'),
  ('log-3', '22222222-2222-2222-2222-222222222222', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'key-3333-3333-3333-3333', 'gpt-4', 2100, 0.063, NOW() - INTERVAL '6 hours'),
  ('log-4', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'key-2222-2222-2222-2222', 'claude-3-sonnet-20240229', 1800, 0.054, NOW() - INTERVAL '1 day'),
  ('log-5', '33333333-3333-3333-3333-333333333333', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', NULL, 'gpt-4-turbo-preview', 1500, 0.030, NOW() - INTERVAL '1 day'),
  ('log-6', '11111111-1111-1111-1111-111111111111', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'key-1111-1111-1111-1111', 'gpt-3.5-turbo', 380, 0.0038, NOW() - INTERVAL '2 days'),
  ('log-7', '22222222-2222-2222-2222-222222222222', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'key-3333-3333-3333-3333', 'gpt-4', 890, 0.0267, NOW() - INTERVAL '3 days');

-- ============================================
-- SUMMARY STATS (For Quick Reference)
-- ============================================
-- Run these queries to see the seeded data:

-- Total workspaces
SELECT COUNT(*) as total_workspaces FROM workspaces WHERE deleted_at IS NULL;

-- Total chatbots
SELECT COUNT(*) as total_chatbots FROM chatbots WHERE deleted_at IS NULL;
SELECT COUNT(*) as active_chatbots FROM chatbots WHERE deleted_at IS NULL AND is_active = true;
SELECT COUNT(*) as paused_chatbots FROM chatbots WHERE deleted_at IS NULL AND is_active = false;

-- Total documents
SELECT COUNT(*) as total_documents FROM documents WHERE deleted_at IS NULL;
SELECT status, COUNT(*) as count FROM documents WHERE deleted_at IS NULL GROUP BY status;

-- Total conversations
SELECT COUNT(*) as total_conversations FROM conversations WHERE deleted_at IS NULL;

-- Total messages
SELECT COUNT(*) as total_messages FROM messages;

-- Total API keys
SELECT COUNT(*) as total_api_keys FROM api_keys WHERE deleted_at IS NULL;
SELECT provider, COUNT(*) as count FROM api_keys WHERE deleted_at IS NULL GROUP BY provider;

-- Total credits
SELECT SUM(balance) as total_balance FROM credits;
SELECT SUM(total_purchased) as total_purchased FROM credits;
SELECT SUM(total_used) as total_used FROM credits;

-- Transaction summary
SELECT type, COUNT(*) as count, SUM(amount) as total FROM credit_transactions GROUP BY type;

-- Usage logs summary
SELECT model, COUNT(*) as calls, SUM(tokens_used) as total_tokens, SUM(cost) as total_cost 
FROM usage_logs 
GROUP BY model;

-- ============================================
-- NOTES FOR PRODUCTION:
-- ============================================
-- 1. Replace UUIDs with actual auth.users IDs
-- 2. NEVER put real API keys in seeds
-- 3. Use proper encryption for api_keys.encrypted_key
-- 4. Adjust timestamps to match your needs
-- 5. Add more data as needed for testing
-- 6. Consider adding deleted records (with deleted_at) for soft delete testing
-- 7. Add more realistic conversation data
-- 8. Add proper file URLs for documents (not placeholders)

-- ============================================
-- TO RESET AND RE-RUN:
-- ============================================
-- DELETE FROM usage_logs;
-- DELETE FROM credit_transactions;
-- DELETE FROM credits;
-- DELETE FROM api_keys;
-- DELETE FROM messages;
-- DELETE FROM conversations;
-- DELETE FROM documents;
-- DELETE FROM chatbots;
-- DELETE FROM workspaces;
-- Then run this seed file again

-- ============================================
-- DONE!
-- ============================================
-- Your database is now populated with realistic sample data!
-- You can now test your dashboard with real data instead of hardcoded values.
