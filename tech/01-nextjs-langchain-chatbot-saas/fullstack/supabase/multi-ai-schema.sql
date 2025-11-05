-- Multi-AI Provider System Schema

-- API Keys table (encrypted storage for user's API keys)
CREATE TABLE IF NOT EXISTS api_keys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  provider VARCHAR(50) NOT NULL, -- 'openai', 'anthropic', 'google', 'custom'
  key_name VARCHAR(255) NOT NULL, -- user-friendly name
  encrypted_key TEXT NOT NULL, -- AES-256 encrypted API key
  is_active BOOLEAN DEFAULT true,
  usage_limit DECIMAL, -- optional spending limit per month
  usage_current DECIMAL DEFAULT 0,
  last_used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Platform Credits table
CREATE TABLE IF NOT EXISTS credits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  balance DECIMAL DEFAULT 0, -- in USD
  total_purchased DECIMAL DEFAULT 0,
  total_used DECIMAL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Credit Transactions table
CREATE TABLE IF NOT EXISTS credit_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL, -- 'purchase', 'usage', 'refund', 'bonus'
  amount DECIMAL NOT NULL,
  balance_after DECIMAL NOT NULL,
  description TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Usage Logs table (for billing and analytics)
CREATE TABLE IF NOT EXISTS usage_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  chatbot_id UUID REFERENCES chatbots(id) ON DELETE CASCADE,
  conversation_id UUID REFERENCES conversations(id) ON DELETE SET NULL,
  provider VARCHAR(50) NOT NULL, -- 'openai', 'anthropic', 'google'
  model VARCHAR(100) NOT NULL, -- 'gpt-4-turbo-preview', 'claude-3-opus', etc
  prompt_tokens INTEGER NOT NULL,
  completion_tokens INTEGER NOT NULL,
  total_tokens INTEGER NOT NULL,
  cost DECIMAL NOT NULL, -- in USD
  response_time INTEGER, -- milliseconds
  source VARCHAR(50) DEFAULT 'user_key', -- 'user_key' or 'platform_credits'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_api_keys_workspace ON api_keys(workspace_id);
CREATE INDEX idx_api_keys_provider ON api_keys(provider);
CREATE INDEX idx_credits_workspace ON credits(workspace_id);
CREATE INDEX idx_credit_transactions_workspace ON credit_transactions(workspace_id);
CREATE INDEX idx_usage_logs_workspace ON usage_logs(workspace_id);
CREATE INDEX idx_usage_logs_chatbot ON usage_logs(chatbot_id);
CREATE INDEX idx_usage_logs_created ON usage_logs(created_at);

-- RLS Policies
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_logs ENABLE ROW LEVEL SECURITY;

-- API Keys policies
CREATE POLICY "Users can manage their own API keys"
  ON api_keys FOR ALL
  USING (workspace_id IN (SELECT id FROM workspaces WHERE auth.uid()::text = id::text));

-- Credits policies
CREATE POLICY "Users can view their own credits"
  ON credits FOR SELECT
  USING (workspace_id IN (SELECT id FROM workspaces WHERE auth.uid()::text = id::text));

-- Credit transactions policies
CREATE POLICY "Users can view their own transactions"
  ON credit_transactions FOR SELECT
  USING (workspace_id IN (SELECT id FROM workspaces WHERE auth.uid()::text = id::text));

-- Usage logs policies
CREATE POLICY "Users can view their own usage logs"
  ON usage_logs FOR SELECT
  USING (workspace_id IN (SELECT id FROM workspaces WHERE auth.uid()::text = id::text));

-- Initialize credits for existing workspaces
INSERT INTO credits (workspace_id, balance)
SELECT id, 0 FROM workspaces
WHERE id NOT IN (SELECT workspace_id FROM credits);

-- Triggers for updated_at
CREATE TRIGGER update_api_keys_updated_at
  BEFORE UPDATE ON api_keys
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_credits_updated_at
  BEFORE UPDATE ON credits
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
