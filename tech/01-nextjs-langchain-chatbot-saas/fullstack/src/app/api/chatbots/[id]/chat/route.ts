import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import GeminiClient from '@/lib/ai-clients/gemini';
import { decrypt } from '@/lib/encryption';

// POST /api/chatbots/:id/chat - Send message to chatbot
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    const body = await req.json();
    const { message, conversationHistory = [], conversationId = null } = body;

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Get chatbot details
    const { data: chatbot, error: chatbotError } = await supabase
      .from('chatbots')
      .select('*')
      .eq('id', params.id)
      .is('deleted_at', null)
      .single();

    if (chatbotError || !chatbot) {
      return NextResponse.json({ error: 'Chatbot not found' }, { status: 404 });
    }

    // Get API key for the chatbot's AI provider
    const { data: apiKey, error: apiKeyError } = await supabase
      .from('api_keys')
      .select('*')
      .eq('workspace_id', chatbot.workspace_id)
      .eq('provider', getProviderFromModel(chatbot.model))
      .eq('is_active', true)
      .is('deleted_at', null)
      .single();

    if (apiKeyError || !apiKey) {
      return NextResponse.json({ 
        error: 'No active API key found for this AI provider. Please add one in Settings → API Keys.' 
      }, { status: 400 });
    }

    // Initialize AI client based on model
    let response;
    
    if (chatbot.model.startsWith('gemini')) {
      // Use Gemini
      const geminiClient = new GeminiClient(apiKey.encrypted_key, chatbot.model);
      
      response = await geminiClient.chat(
        message,
        chatbot.system_prompt,
        conversationHistory,
        {
          temperature: chatbot.temperature || 0.7,
          maxTokens: chatbot.max_tokens || 2048,
          topP: chatbot.top_p || 1.0,
        }
      );
    } else if (chatbot.model.startsWith('gpt') || chatbot.model.startsWith('o1')) {
      // Use OpenAI
      const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${decrypt(apiKey.encrypted_key)}`,
        },
        body: JSON.stringify({
          model: chatbot.model,
          messages: [
            { role: 'system', content: chatbot.system_prompt },
            ...conversationHistory.map((msg: any) => ({
              role: msg.role,
              content: msg.content,
            })),
            { role: 'user', content: message },
          ],
          temperature: chatbot.temperature || 0.7,
          max_tokens: chatbot.max_tokens || 2048,
        }),
      });

      if (!openaiResponse.ok) {
        const error = await openaiResponse.json();
        throw new Error(error.error?.message || 'OpenAI API error');
      }

      const data = await openaiResponse.json();
      response = {
        content: data.choices[0].message.content,
        usage: {
          promptTokens: data.usage.prompt_tokens,
          completionTokens: data.usage.completion_tokens,
          totalTokens: data.usage.total_tokens,
        },
      };
    } else if (chatbot.model.startsWith('claude')) {
      // Use Anthropic Claude
      const anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': decrypt(apiKey.encrypted_key),
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: chatbot.model,
          system: chatbot.system_prompt,
          messages: [
            ...conversationHistory.map((msg: any) => ({
              role: msg.role === 'assistant' ? 'assistant' : 'user',
              content: msg.content,
            })),
            { role: 'user', content: message },
          ],
          temperature: chatbot.temperature || 0.7,
          max_tokens: chatbot.max_tokens || 2048,
        }),
      });

      if (!anthropicResponse.ok) {
        const error = await anthropicResponse.json();
        throw new Error(error.error?.message || 'Anthropic API error');
      }

      const data = await anthropicResponse.json();
      response = {
        content: data.content[0].text,
        usage: {
          promptTokens: data.usage.input_tokens,
          completionTokens: data.usage.output_tokens,
          totalTokens: data.usage.input_tokens + data.usage.output_tokens,
        },
      };
    } else {
      return NextResponse.json({ error: 'Unsupported AI model' }, { status: 400 });
    }

    // Update API key usage
    await supabase
      .from('api_keys')
      .update({
        usage_current: (apiKey.usage_current || 0) + response.usage.totalTokens,
        last_used_at: new Date().toISOString(),
      })
      .eq('id', apiKey.id);

    // Save or update conversation
    const allMessages = [
      ...conversationHistory,
      { role: 'user', content: message, timestamp: new Date() },
      { role: 'assistant', content: response.content, timestamp: new Date() },
    ];

    let savedConversationId = conversationId;

    if (conversationId) {
      // Update existing conversation
      await supabase
        .from('conversations')
        .update({
          messages: allMessages,
          updated_at: new Date().toISOString(),
        })
        .eq('id', conversationId);
    } else {
      // Create new conversation
      const { data: newConversation } = await supabase
        .from('conversations')
        .insert({
          chatbot_id: chatbot.id,
          visitor_id: 'test-user',
          messages: allMessages,
        })
        .select()
        .single();
      
      savedConversationId = newConversation?.id;
    }

    return NextResponse.json({
      message: response.content,
      usage: response.usage,
      model: chatbot.model,
      conversationId: savedConversationId,
    });
  } catch (error: any) {
    console.error('Chat error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to determine provider from model name
function getProviderFromModel(model: string): string {
  if (model.startsWith('gemini')) return 'google';
  if (model.startsWith('gpt') || model.startsWith('o1')) return 'openai';
  if (model.startsWith('claude')) return 'anthropic';
  return 'custom';
}
