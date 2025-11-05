import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import pdf from 'pdf-parse';
import mammoth from 'mammoth';

export interface ProcessedDocument {
  pageContent: string;
  metadata: {
    source: string;
    page?: number;
    chunkIndex: number;
  };
}

export async function processPDF(
  buffer: Buffer,
  filename: string
): Promise<ProcessedDocument[]> {
  const data = await pdf(buffer);
  const text = data.text;

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  const docs = await splitter.createDocuments([text], [
    { source: filename },
  ]);

  return docs.map((doc, index) => ({
    pageContent: doc.pageContent,
    metadata: {
      source: filename,
      chunkIndex: index,
    },
  }));
}

export async function processDOCX(
  buffer: Buffer,
  filename: string
): Promise<ProcessedDocument[]> {
  const result = await mammoth.extractRawText({ buffer });
  const text = result.value;

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  const docs = await splitter.createDocuments([text], [
    { source: filename },
  ]);

  return docs.map((doc, index) => ({
    pageContent: doc.pageContent,
    metadata: {
      source: filename,
      chunkIndex: index,
    },
  }));
}

export async function processTXT(
  text: string,
  filename: string
): Promise<ProcessedDocument[]> {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  const docs = await splitter.createDocuments([text], [
    { source: filename },
  ]);

  return docs.map((doc, index) => ({
    pageContent: doc.pageContent,
    metadata: {
      source: filename,
      chunkIndex: index,
    },
  }));
}

export async function processDocument(
  file: File | Buffer,
  filename: string,
  mimeType: string
): Promise<ProcessedDocument[]> {
  let buffer: Buffer;

  if (file instanceof File) {
    buffer = Buffer.from(await file.arrayBuffer());
  } else {
    buffer = file;
  }

  switch (mimeType) {
    case 'application/pdf':
      return processPDF(buffer, filename);
    
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      return processDOCX(buffer, filename);
    
    case 'text/plain':
      return processTXT(buffer.toString('utf-8'), filename);
    
    default:
      throw new Error(`Unsupported file type: ${mimeType}`);
  }
}
