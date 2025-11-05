-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Workspaces table (tenants)
CREATE TABLE workspaces (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  industry TEXT,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'business', 'enterprise')),
  message_quota INTEGER DEFAULT 1000,
  message_used INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chatbots table
CREATE TABLE chatbots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  system_prompt TEXT NOT NULL,
  model TEXT DEFAULT 'gpt-4-turbo-preview',
  temperature REAL DEFAULT 0.7 CHECK (temperature >= 0 AND temperature <= 2),
  pinecone_namespace TEXT UNIQUE NOT NULL,
  use_case TEXT,
  is_active BOOLEAN DEFAULT true,
  widget_settings JSONB DEFAULT '{
    "theme": "light",
    "position": "bottom-right",
    "primaryColor": "#3b82f6",
    "greeting": "Hi! How can I help you today?"
  }'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Conversations table
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chatbot_id UUID REFERENCES chatbots(id) ON DELETE CASCADE,
  visitor_id TEXT NOT NULL,
  messages JSONB NOT NULL DEFAULT '[]'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Documents table (knowledge base)
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chatbot_id UUID REFERENCES chatbots(id) ON DELETE CASCADE,
  filename TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  mime_type TEXT NOT NULL,
  chunk_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_chatbots_workspace ON chatbots(workspace_id);
CREATE INDEX idx_conversations_chatbot ON conversations(chatbot_id);
CREATE INDEX idx_conversations_visitor ON conversations(visitor_id);
CREATE INDEX idx_documents_chatbot ON documents(chatbot_id);
CREATE INDEX idx_documents_status ON documents(status);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_workspaces_updated_at
  BEFORE UPDATE ON workspaces
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chatbots_updated_at
  BEFORE UPDATE ON chatbots
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_conversations_updated_at
  BEFORE UPDATE ON conversations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS)
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatbots ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- RLS Policies (basic - customize based on your auth setup)
-- Workspace owners can see their workspaces
CREATE POLICY "Users can view their own workspaces"
  ON workspaces FOR SELECT
  USING (auth.uid()::text = id::text);

-- Chatbot access based on workspace
CREATE POLICY "Users can view chatbots in their workspaces"
  ON chatbots FOR SELECT
  USING (workspace_id IN (SELECT id FROM workspaces WHERE auth.uid()::text = id::text));

CREATE POLICY "Users can create chatbots in their workspaces"
  ON chatbots FOR INSERT
  WITH CHECK (workspace_id IN (SELECT id FROM workspaces WHERE auth.uid()::text = id::text));

-- Public can view active chatbots (for widget)
CREATE POLICY "Public can view active chatbots"
  ON chatbots FOR SELECT
  USING (is_active = true);

-- Public can create conversations
CREATE POLICY "Anyone can create conversations"
  ON conversations FOR INSERT
  WITH CHECK (true);

-- Users can view conversations for their chatbots
CREATE POLICY "Users can view their chatbot conversations"
  ON conversations FOR SELECT
  USING (chatbot_id IN (
    SELECT id FROM chatbots WHERE workspace_id IN (
      SELECT id FROM workspaces WHERE auth.uid()::text = id::text
    )
  ));

-- Document policies
CREATE POLICY "Users can manage documents for their chatbots"
  ON documents FOR ALL
  USING (chatbot_id IN (
    SELECT id FROM chatbots WHERE workspace_id IN (
      SELECT id FROM workspaces WHERE auth.uid()::text = id::text
    )
  ));

-- Insert sample data for testing
INSERT INTO workspaces (id, name, slug, industry, plan)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Demo Workspace',
  'demo-workspace',
  'Technology',
  'pro'
);

-- Create storage bucket for documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', true);

-- Storage policies
CREATE POLICY "Anyone can upload documents"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'documents');

CREATE POLICY "Anyone can view documents"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'documents');
