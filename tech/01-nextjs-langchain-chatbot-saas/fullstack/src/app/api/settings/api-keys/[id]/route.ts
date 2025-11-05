import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { getUserWorkspaceId } from '@/lib/workspace-helper';
import { decrypt } from '@/lib/encryption';

// PUT /api/settings/api-keys/:id - Update API key
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { keyName, isActive, usageLimit } = body;

    const updateData: any = {};
    if (keyName !== undefined) updateData.key_name = keyName;
    if (isActive !== undefined) updateData.is_active = isActive;
    if (usageLimit !== undefined) updateData.usage_limit = usageLimit;
    
    updateData.updated_at = new Date().toISOString();

    // Get user's workspace ID
    const workspaceId = await getUserWorkspaceId(user.id);
    
    if (!workspaceId) {
      return NextResponse.json({ error: 'No workspace found' }, { status: 400 });
    }

    const { data: apiKey, error } = await supabase
      .from('api_keys')
      .update(updateData)
      .eq('id', params.id)
      .eq('workspace_id', workspaceId)
      .select('id, provider, key_name, is_active, usage_limit, updated_at')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ apiKey });
  } catch (error: any) {
    console.error('API Key PUT error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/settings/api-keys/:id - Delete API key
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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
      return NextResponse.json({ error: 'No workspace found' }, { status: 400 });
    }

    const { error } = await supabase
      .from('api_keys')
      .delete()
      .eq('id', params.id)
      .eq('workspace_id', workspaceId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('API Key DELETE error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
