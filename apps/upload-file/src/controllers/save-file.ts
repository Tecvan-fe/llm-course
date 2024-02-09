import fs from 'fs/promises';

import { type Context } from 'koa';
import { FilePieceService } from '@big-file/file-storage';

interface ChunkContent {
  // 文件 hash 值
  hash: string;
  // 分片内容
  chunk: Buffer;
  // 分片索引
  index: number;
}

const checkParam = (params: ChunkContent) => {
  if (!params) {
    return 'Empty params';
  }
  const { hash, chunk, index } = params;
  if (typeof hash !== 'string' || hash.length <= 0) {
    return `Empty hash value: ${hash}`;
  }
  if (chunk?.length <= 0) {
    return `Empty chunk value`;
  }
  if (index < 0) {
    return `Invalid file name `;
  }
  return true;
};

const saveChunk = async (params: ChunkContent, storageRoot: string) => {
  const { hash, index, chunk } = params;
  const pieceService = new FilePieceService({ hash, storageRoot });
  await pieceService.writePiece(chunk, index);
};

export const saveChunkController = async (ctx: Context) => {
  const { index, hash } = ctx.request.body;
  const chunkFile = ctx.request.files?.chunk.filepath || undefined;
  if (!chunkFile || Array.isArray(chunkFile)) {
    throw new Error(`Invalid chunk file params`);
  }
  const chunk = await fs.readFile(chunkFile);
  const params = {
    index,
    hash,
    chunk,
  };
  const checkStatus = checkParam(params);
  if (checkStatus !== true) {
    ctx.status = 400;
    ctx.body = { code: 400, message: checkStatus };
    return;
  }
  const { fileStorageRoot } = ctx.readConfig();
  await saveChunk(params, fileStorageRoot);
  ctx.body = { code: 0, data: { index, hash } };
};
