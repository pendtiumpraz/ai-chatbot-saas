import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { nanoid } from 'nanoid';
import { getCurrentUser, hasPermission } from '@/lib/rbac';
import { logAudit } from '@/lib/audit';

export async function GET(req: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Get current user
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get workspace ID from query or user_roles
    let workspaceId = req.nextUrl.searchParams.get('workspaceId');
    
    if (!workspaceId) {
      const { data: userRole } = await supabase
        .from('user_roles')
        .select('workspace_id')
        .eq('user_id', user.id)
        .limit(1)
        .single();
      
      if (userRole) {
        workspaceId = userRole.workspace_id;
      } else {
        // Return empty if no workspace
        return NextResponse.json({ chatbots: [] });
      }
    }
    
    const search = req.nextUrl.searchParams.get('search');
    const useCase = req.nextUrl.searchParams.get('useCase');
    const status = req.nextUrl.searchParams.get('status');

    // Check permission (TEMPORARILY DISABLED FOR DEVELOPMENT)
    // TODO: Re-enable after fixing user_roles and permissions
    // const canRead = await hasPermission(user.id, 'chatbot.read', { workspaceId });
    // if (!canRead) {
    //   return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    // }

    let query = supabase
      .from('chatbots')
      .select('*')
      .eq('workspace_id', workspaceId)
      .is('deleted_at', null) // Only non-deleted
      .order('created_at', { ascending: false });

    // Filters
    if (search) {
      query = query.ilike('name', `%${search}%`);
    }
    if (useCase && useCase !== 'all') {
      query = query.eq('use_case', useCase);
    }
    if (status === 'active' || status === 'true') {
      query = query.eq('is_active', true);
    } else if (status === 'paused' || status === 'false') {
      query = query.eq('is_active', false);
    }

    const { data: chatbots, error } = await query;

    if (error) throw error;

    return NextResponse.json({ chatbots });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Get current user
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const {
      workspaceId,
      name,
      description,
      systemPrompt,
      useCase,
      model = 'gpt-4-turbo-preview',
      temperature = 0.7,
      aiProvider = 'openai',
      maxTokens = 2000,
      widgetSettings,
    } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    // Get user's workspace ID from user_roles
    let finalWorkspaceId = workspaceId;
    
    if (!finalWorkspaceId) {
      const { data: userRole } = await supabase
        .from('user_roles')
        .select('workspace_id')
        .eq('user_id', user.id)
        .limit(1)
        .single();
      
      if (!userRole) {
        return NextResponse.json(
          { error: 'No workspace found. Please create a workspace first.' },
          { status: 400 }
        );
      }
      
      finalWorkspaceId = userRole.workspace_id;
    }

    // Check permission (TEMPORARILY DISABLED FOR DEVELOPMENT)
    // TODO: Re-enable after fixing user_roles and permissions
    // const canCreate = await hasPermission(user.id, 'chatbot.create', {
    //   workspaceId: finalWorkspaceId
    // });

    // if (!canCreate) {
    //   return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    // }
    const pineconeNamespace = `workspace-${finalWorkspaceId}-${nanoid(10)}`;

    const defaultPrompts = {
      'customer-support': `You are a helpful customer support assistant. 
- Always be polite and professional
- Try to resolve issues quickly
- If you can't help, offer to escalate to human support
- Use the knowledge base to answer product-related questions`,

      'hr-assistant': `You are an HR assistant helping employees with:
- Company policies and procedures
- Benefits information
- Leave requests process
- General HR inquiries
Answer based on the HR documentation provided in the knowledge base.`,

      'education-tutor': `You are an educational tutor.
- Explain concepts clearly and simply
- Provide examples when possible
- Encourage students to think critically
- Be patient and supportive
Use the course materials in the knowledge base to answer questions.`,

      'sales-assistant': `You are a sales assistant helping potential customers.
- Highlight product benefits
- Answer questions about features and pricing
- Guide users to make informed decisions
- Be enthusiastic but not pushy
Reference the product catalog in the knowledge base.`,

      'healthcare-info': `You are a healthcare information assistant.
- Provide general health information only
- Never diagnose or prescribe
- Always recommend consulting healthcare professionals
- Be empathetic and clear
Use the medical resources in the knowledge base.`,

      'legal-assistant': `You are a legal information assistant.
- Provide general legal information (not legal advice)
- Explain legal terms clearly
- Recommend consulting a lawyer for specific cases
- Be accurate and precise
Reference the legal documents in the knowledge base.`,

      'finance-advisor': `You are a financial information assistant.
- Explain financial products and concepts
- Provide general guidance (not financial advice)
- Help users understand their options
- Be clear about risks
Use the financial documentation in the knowledge base.`,

      'general': `You are a helpful AI assistant.
- Answer questions based on the provided knowledge base
- Be clear, concise, and accurate
- If unsure, say you don't know
- Maintain a friendly, professional tone`,
    };

    const finalSystemPrompt = systemPrompt || defaultPrompts[useCase as keyof typeof defaultPrompts] || defaultPrompts.general;

    const defaultWidgetSettings = {
      theme: 'light',
      position: 'bottom-right',
      primaryColor: '#8B5CF6',
      greetingMessage: 'Hi! How can I help you today?',
      avatarUrl: '',
    };

    const { data: chatbot, error } = await supabase
      .from('chatbots')
      .insert({
        workspace_id: finalWorkspaceId,
        name,
        description,
        system_prompt: finalSystemPrompt,
        model,
        temperature,
        max_tokens: maxTokens,
        pinecone_namespace: pineconeNamespace,
        use_case: useCase || 'general',
        is_active: true,
        widget_settings: widgetSettings || defaultWidgetSettings,
      })
      .select()
      .single();

    if (error) {
      // Log failed creation
      await logAudit({
        userId: user.id,
        workspaceId: finalWorkspaceId,
        action: 'create_chatbot',
        resourceType: 'chatbot',
        status: 'failed',
        errorMessage: error.message
      });
      
      throw error;
    }

    // Log successful creation
    await logAudit({
      userId: user.id,
      workspaceId: finalWorkspaceId,
      action: 'create_chatbot',
      resourceType: 'chatbot',
      resourceId: chatbot.id,
      newValues: chatbot,
      status: 'success'
    });

    return NextResponse.json({
      success: true,
      chatbot,
    }, { status: 201 });
  } catch (error: any) {
    console.error('Create chatbot error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
