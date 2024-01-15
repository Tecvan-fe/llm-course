// references: https://js.langchain.com/docs/integrations/document_loaders/file_loaders/directory

import path from 'path';

import { TextLoader } from 'langchain/document_loaders/fs/text';
import { DirectoryLoader } from 'langchain/document_loaders/fs/directory';

export const run = async () => {
  const root = path.resolve(
    path.dirname(require.resolve('@tecvan-infra/eslint-config')),
  );
  // 这个 loader 有几个问题：
  // 1. 不支持 glob 格式过滤数据，只能精确写 ext name
  // 2. 虽然支持递归，但居然不支持按目录过滤？比如 node_modules 目录
  // 3. 不支持流式返回结果，都是一次性，批量返回的
  const loader = new DirectoryLoader(root, {
    '.ts': path => new TextLoader(path),
  });
  const docs = await loader.load();
  console.log({ docs });
};
