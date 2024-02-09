import path from 'path';

import { logger } from '@tecvan-infra/logger';

import { isValidString, isPositiveInter } from './utils';
import { fsStorage } from './storages/fs';
import { type BasicStorage } from './storages/basic';

const COMBIND_FILE_NAME = 'combind';

export class FilePieceService {
  public hash: string;
  private _storage: BasicStorage;
  private _storageRoot: string;

  constructor(options: {
    hash: string;
    storageRoot: string;
    storage?: BasicStorage;
  }) {
    const { hash, storage, storageRoot } = options;
    if (!isValidString(storageRoot)) {
      throw new Error(`Invalid storageRoot, it should not empty string.`);
    }
    if (!isValidString(hash)) {
      throw new Error(`Invalid file hash, it should not empty string.`);
    }
    this.hash = hash;
    this._storage = storage || fsStorage;
    this._storageRoot = storageRoot;
  }

  get hashDir() {
    const { _storageRoot, hash } = this;
    return path.resolve(_storageRoot, hash);
  }

  private ensureHashDir() {
    const { hashDir } = this;
    return this._storage.ensureDir(hashDir);
  }

  // 将文件分片 chunk 写入 storage
  async writePiece(content: Buffer, index: number) {
    const { _storage } = this;
    const pieceFilename = path.resolve(this.hashDir, `${index}`);
    await this.ensureHashDir();
    await _storage.writeFile(pieceFilename, content);
  }

  isExist(chunkIndex?: number) {
    const findByChunk = typeof chunkIndex === 'number' && chunkIndex >= 0;
    const { _storage } = this;
    return findByChunk
      ? _storage.isFileExists(path.resolve(this.hashDir, `${chunkIndex}`))
      : _storage.isDirExists(this.hashDir);
  }

  async merge() {
    logger.debug(`Start merge ${this.hash}`);
    // TODO: 有几个遗留可优化的点：
    // 1. 合并文件后，应该择机删除 chunks，以防浪费存储空间
    // 2. 应该计算合并后的文件 hash 值与合并前的值，以防内容被篡改
    const pieces = await this._storage.ls(this.hashDir);
    const fn2idx = (filename: string) => +path.basename(filename);
    const sortedPieces = pieces
      .filter(r => isPositiveInter(fn2idx(r)))
      .sort((r1, r2) => fn2idx(r1) - fn2idx(r2));

    if (sortedPieces.length <= 0) {
      throw new Error(`Can not found any pieces of ${this.hash} `);
    }
    logger.debug(`Found ${sortedPieces.length} pieces of ${this.hash}`);

    const filename = path.resolve(this.hashDir, COMBIND_FILE_NAME);
    await this._storage.combind(sortedPieces, filename);
    return { count: pieces.length, hash: this.hash };
  }
}
