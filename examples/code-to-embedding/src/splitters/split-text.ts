import path from 'node:path';

// langchain 提供了：CharacterTextSplitter、RecursiveCharacterTextSplitter、TokenTextSplitter、MarkdownTextSplitter、LatexTextSplitter 4 种 splitters
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { TextLoader } from 'langchain/document_loaders/fs/text';

export const run = async () => {
  const docs = await new TextLoader(
    path.resolve(__dirname, '../../assets/html-to-text.md'),
  ).load();

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1024,
    chunkOverlap: 10,
  });

  const splittedDocs = await splitter.splitDocuments(docs);
  console.log(splittedDocs);
};
