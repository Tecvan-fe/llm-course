// find file or piece of file

import { type Context } from 'koa';
import { FilePieceService } from '@big-file/file-storage';

import { HttpError } from '../utils/http-error';
import { isValidString } from '../utils';

interface Params {
  // 文件 hash 值
  hash?: string;
}

const checkParams = (params: Params) => {
  const { hash } = params;
  if (!isValidString(hash)) {
    throw new HttpError(400, `hash should be no empty string`);
  }
  return true;
};

const doMerge = async (params: Params, storageRoot: string) => {
  const { hash } = params;
  const pieceService = new FilePieceService({ hash: hash!, storageRoot });
  if (!(await pieceService.isExist())) {
    throw new HttpError(500, `Hash file not exists`);
  }
  const res = await pieceService.merge();
  return res;
};

export const mergeChunksController = async (ctx: Context) => {
  const { hash } = ctx.request.body;
  const params = {
    hash,
  } as Params;
  checkParams(params);
  const { fileStorageRoot } = ctx.readConfig();
  const res = await doMerge(params, fileStorageRoot);
  ctx.body = { code: 0, data: res };
};
