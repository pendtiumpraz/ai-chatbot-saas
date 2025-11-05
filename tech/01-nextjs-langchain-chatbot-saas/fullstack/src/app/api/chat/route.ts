import { NextRequest, NextResponse } from 'next/server';
import { createRAGChain } from '@/lib/ai/langchain';
import { supabase } from '@/lib/db/supabase';
import { StreamingTextResponse, LangChainStream } from 'ai';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const { messages, chatbotId, visitorId } = await req.json();

    if (!messages || !chatbotId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { data: chatbot, error: chatbotError } = await supabase
      .from('chatbots')
      .select('*')
      .eq('id', chatbotId)
      .single();

    if (chatbotError || !chatbot) {
      return NextResponse.json(
        { error: 'Chatbot not found' },
        { status: 404 }
      );
    }

    const { data: workspace } = await supabase
      .from('workspaces')
      .select('*')
      .eq('id', chatbot.workspace_id)
      .single();

    if (workspace && workspace.message_used >= workspace.message_quota) {
      return NextResponse.json(
        { error: 'Message quota exceeded. Please upgrade your plan.' },
        { status: 429 }
      );
    }

    const conversationHistory = messages.slice(0, -1);
    const currentQuestion = messages[messages.length - 1].content;

    const { stream, handlers } = LangChainStream();

    const chain = await createRAGChain(
      chatbot.pinecone_namespace,
      chatbot.system_prompt,
      conversationHistory
    );

    chain.call(
      { 
        question: currentQuestion 
      },
      [handlers]
    ).then(async (result) => {
      await supabase
        .from('conversations')
        .upsert({
          chatbot_id: chatbotId,
          visitor_id: visitorId || 'anonymous',
          messages: messages,
          metadata: {
            sources: result.sourceDocuments?.map((doc: any) => doc.metadata),
          },
        });

      if (workspace) {
        await supabase
          .from('workspaces')
          .update({ message_used: workspace.message_used + 1 })
          .eq('id', workspace.id);
      }
    });

    return new StreamingTextResponse(stream);
  } catch (error: any) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
