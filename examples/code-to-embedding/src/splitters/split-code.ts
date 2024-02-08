import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';

export const run = async () => {
  const jsCode = `function helloWorld() {
    console.log("Hello, World!");
  }
  // Call the function
  helloWorld();`;

  const splitter = RecursiveCharacterTextSplitter.fromLanguage('js', {
    chunkSize: 32,
    chunkOverlap: 0,
  });
  const jsOutput = await splitter.createDocuments([jsCode]);

  console.log(jsOutput);
};
