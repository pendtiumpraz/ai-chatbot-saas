import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { processDocument } from '@/lib/ai/document-processor';
import { embedDocuments } from '@/lib/ai/langchain';
import { nanoid } from 'nanoid';

export async function POST(req: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // 1. Check authentication
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;
    const chatbotId = formData.get('chatbotId') as string;

    if (!file || !chatbotId) {
      return NextResponse.json(
        { error: 'Missing file or chatbotId' },
        { status: 400 }
      );
    }

    // 2. Verify user owns the chatbot
    const { data: chatbot } = await supabase
      .from('chatbots')
      .select('workspace_id, pinecone_namespace')
      .eq('id', chatbotId)
      .single();

    if (!chatbot) {
      return NextResponse.json(
        { error: 'Chatbot not found' },
        { status: 404 }
      );
    }

    // 3. Verify ownership
    if (chatbot.workspace_id !== user.id) {
      return NextResponse.json(
        { error: 'Forbidden - You do not own this chatbot' },
        { status: 403 }
      );
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const filename = file.name;
    const mimeType = file.type;
    const fileSize = file.size;

    const filePath = `${chatbotId}/${nanoid()}-${filename}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, fileBuffer, {
        contentType: mimeType,
      });

    if (uploadError) {
      throw new Error(`Upload failed: ${uploadError.message}`);
    }

    const { data: { publicUrl } } = supabase.storage
      .from('documents')
      .getPublicUrl(filePath);

    const { data: document } = await supabase
      .from('documents')
      .insert({
        chatbot_id: chatbotId,
        filename,
        file_url: publicUrl,
        file_size: fileSize,
        mime_type: mimeType,
        chunk_count: 0,
        status: 'processing',
      })
      .select()
      .single();

    processDocumentAsync(document!.id, fileBuffer, filename, mimeType, chatbot.pinecone_namespace);

    return NextResponse.json({
      success: true,
      documentId: document!.id,
      message: 'Document uploaded and processing started',
    });
  } catch (error: any) {
    console.error('Document upload error:', error);
    return NextResponse.json(
      { error: error.message || 'Upload failed' },
      { status: 500 }
    );
  }
}

async function processDocumentAsync(
  documentId: string,
  fileBuffer: Buffer,
  filename: string,
  mimeType: string,
  namespace: string
) {
  const { createClient } = await import('@supabase/supabase-js');
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

  try {
    const chunks = await processDocument(fileBuffer, filename, mimeType);

    await embedDocuments(namespace, chunks);

    await supabaseAdmin
      .from('documents')
      .update({
        status: 'completed',
        chunk_count: chunks.length,
      })
      .eq('id', documentId);
  } catch (error: any) {
    console.error('Document processing error:', error);
    await supabaseAdmin
      .from('documents')
      .update({
        status: 'failed',
        error_message: error.message,
      })
      .eq('id', documentId);
  }
}
