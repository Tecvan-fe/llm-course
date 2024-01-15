import path from 'path';

import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { InMemoryStore } from 'langchain/storage/in_memory';
import { CacheBackedEmbeddings } from 'langchain/embeddings/cache_backed';
import { TextLoader } from 'langchain/document_loaders/fs/text';
import { OpenAIEmbeddings } from '@langchain/openai';

const run = async () => {
  const underlyingEmbeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_API_KEY,
    modelName: 'text-embedding-ada-002',
  });

  const inMemoryStore = new InMemoryStore();

  const cacheBackedEmbeddings = CacheBackedEmbeddings.fromBytesStore(
    underlyingEmbeddings,
    inMemoryStore,
    {
      namespace: underlyingEmbeddings.modelName,
    },
  );

  const rawDocuments = await Promise.all([
    new TextLoader(path.resolve(__dirname, '../package.json')).load(),
    new TextLoader(path.resolve(__dirname, '../tsconfig.json')).load(),
    new TextLoader(path.resolve(__dirname, '../tsconfig.build.json')).load(),
  ]);
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 0,
  });
  const documents = await splitter.splitDocuments(rawDocuments.flat());
  const vectorStore = await MemoryVectorStore.fromDocuments(
    documents,
    cacheBackedEmbeddings,
  );

  const resultOne = await vectorStore.similaritySearch(
    'compiler config for ts',
    1,
  );
  console.log(resultOne);
};

run();
