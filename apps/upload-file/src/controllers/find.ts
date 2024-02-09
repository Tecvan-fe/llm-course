// find file or piece of file

import { type Context } from 'koa';
import { FilePieceService } from '@big-file/file-storage';

import { HttpError } from '../utils/http-error';
import { isValidString, isPositiveInter, isUndefined } from '../utils';

interface Params {
  // 文件 hash 值
  hash?: string;
  // 分片索引
  index?: number;
}

const checkParams = (params: Params) => {
  const { index, hash } = params;
  if (!isValidString(hash)) {
    throw new HttpError(400, `hash should be no empty string`);
  }
  if (!isUndefined(index) && !isPositiveInter(index)) {
    throw new HttpError(400, `index should be positive inter`);
  }
  return true;
};

const doSearch = async (params: Params, storageRoot: string) => {
  const { hash, index } = params;
  const pieceService = new FilePieceService({ hash: hash!, storageRoot });
  const res = await pieceService.isExist(index);
  return res;
};

export const findFileController = async (ctx: Context) => {
  const { index, hash } = ctx.request.query;
  const params = {
    index: typeof index === 'string' ? +index : index,
    hash,
  } as Params;
  checkParams(params);
  const { fileStorageRoot } = ctx.readConfig();
  const isExist = await doSearch(params, fileStorageRoot);
  ctx.body = { code: 0, data: { isExist } };
};
