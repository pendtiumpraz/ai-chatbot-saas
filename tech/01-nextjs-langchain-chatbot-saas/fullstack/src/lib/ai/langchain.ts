import { ChatOpenAI, OpenAIEmbeddings } from '@langchain/openai';
import { PineconeStore } from '@langchain/pinecone';
import { Pinecone } from '@pinecone-database/pinecone';
import { ConversationalRetrievalQAChain } from 'langchain/chains';
import { BufferMemory } from 'langchain/memory';

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY || 'placeholder-key',
});

const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX || 'placeholder-index');

export async function getVectorStore(namespace: string) {
  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_API_KEY,
  });

  return await PineconeStore.fromExistingIndex(embeddings, {
    pineconeIndex,
    namespace,
  });
}

export async function createRAGChain(
  namespace: string,
  systemPrompt?: string,
  conversationHistory?: Array<{ role: string; content: string }>
) {
  const vectorStore = await getVectorStore(namespace);

  const llm = new ChatOpenAI({
    modelName: 'gpt-4-turbo-preview',
    temperature: 0.7,
    openAIApiKey: process.env.OPENAI_API_KEY,
  });

  const memory = new BufferMemory({
    memoryKey: 'chat_history',
    returnMessages: true,
    inputKey: 'question',
    outputKey: 'text',
  });

  if (conversationHistory && conversationHistory.length > 0) {
    for (const msg of conversationHistory) {
      if (msg.role === 'user') {
        await memory.chatHistory.addUserMessage(msg.content);
      } else if (msg.role === 'assistant') {
        await memory.chatHistory.addAIChatMessage(msg.content);
      }
    }
  }

  const chain = ConversationalRetrievalQAChain.fromLLM(
    llm,
    vectorStore.asRetriever({
      k: 4,
      searchType: 'similarity',
    }),
    {
      memory,
      returnSourceDocuments: true,
    }
  );

  return chain;
}

export async function embedDocuments(
  namespace: string,
  documents: Array<{
    pageContent: string;
    metadata: Record<string, any>;
  }>
) {
  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_API_KEY,
  });

  await PineconeStore.fromDocuments(documents, embeddings, {
    pineconeIndex,
    namespace,
  });

  return {
    success: true,
    documentCount: documents.length,
  };
}

export async function deleteNamespace(namespace: string) {
  await pineconeIndex.namespace(namespace).deleteAll();
  return { success: true };
}
