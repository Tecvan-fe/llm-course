// references: https://js.langchain.com/docs/integrations/document_loaders/web_loaders/github

import { GithubRepoLoader } from 'langchain/document_loaders/web/github';

export const run = async () => {
  // 性能很差的 loader，还不如本地先 clone 下来再执行
  const loader = new GithubRepoLoader(
    'https://github.com/langchain-ai/langchainjs',
    {
      branch: 'main',
      // 传入这个参数后， loader 会递归文件目录执行所有内容的加载
      // 但性能很差，不建议使用
      recursive: true,
      unknown: 'warn',
      accessToken: process.env.GIT_ACCESS_TOKEN,
      maxConcurrency: 5, // Defaults to 2
    },
  );
  const docs = await loader.load();
  console.log({ docs });
};
