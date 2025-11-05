import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { encrypt, decrypt, maskApiKey, isValidApiKeyFormat } from '@/lib/encryption';
import { getUserWorkspaceId } from '@/lib/workspace-helper';

// GET /api/settings/api-keys - List user's API keys (masked)
export async function GET(req: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's workspace ID
    const workspaceId = await getUserWorkspaceId(user.id);
    
    if (!workspaceId) {
      return NextResponse.json({ apiKeys: [] });
    }

    // Get API keys
    const { data: apiKeys, error } = await supabase
      .from('api_keys')
      .select('id, provider, key_name, is_active, usage_limit, usage_current, last_used_at, created_at')
      .eq('workspace_id', workspaceId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Don't return encrypted keys
    return NextResponse.json({ apiKeys: apiKeys || [] });
  } catch (error: any) {
    console.error('API Keys GET error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

// POST /api/settings/api-keys - Add new API key
export async function POST(req: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if workspace exists for this user
    const { data: workspace, error: workspaceError } = await supabase
      .from('workspaces')
      .select('id')
      .eq('id', user.id)
      .is('deleted_at', null)
      .single();

    if (workspaceError || !workspace) {
      return NextResponse.json(
        { error: 'Workspace not found. Please run FIX_API_KEY_ERROR.sql in Supabase.' },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { provider, keyName, apiKey, usageLimit } = body;

    if (!provider || !keyName || !apiKey) {
      return NextResponse.json(
        { error: 'provider, keyName, and apiKey required' },
        { status: 400 }
      );
    }

    // Validate API key format
    if (!isValidApiKeyFormat(provider, apiKey)) {
      return NextResponse.json(
        { error: 'Invalid API key format for provider' },
        { status: 400 }
      );
    }

    // Get user's workspace ID
    const workspaceId = await getUserWorkspaceId(user.id);
    
    if (!workspaceId) {
      return NextResponse.json(
        { error: 'No workspace found. Please create a workspace first.' },
        { status: 400 }
      );
    }

    // Encrypt the API key
    const encryptedKey = encrypt(apiKey);

    // Store in database
    const { data: newKey, error } = await supabase
      .from('api_keys')
      .insert({
        workspace_id: workspaceId,
        provider,
        key_name: keyName,
        encrypted_key: encryptedKey,
        is_active: true,
        usage_limit: usageLimit || null,
        usage_current: 0,
      })
      .select('id, provider, key_name, is_active, usage_limit, created_at')
      .single();

    if (error) throw error;

    return NextResponse.json({ 
      apiKey: newKey,
      message: 'API key added successfully'
    }, { status: 201 });
  } catch (error: any) {
    console.error('API Key POST error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
