import path from 'path';
import { stat, readFile, writeFile, mkdir, readdir } from 'fs/promises';

import { BasicStorage } from './basic';

class FilesystemStorage extends BasicStorage {
  async isFileExists(filename: string) {
    try {
      const fStat = await stat(filename);
      return fStat.isFile();
    } catch (e) {
      return false;
    }
  }

  async isDirExists(filename: string) {
    try {
      const fStat = await stat(filename);
      return fStat.isDirectory();
    } catch (e) {
      return false;
    }
  }

  async ls(dir: string) {
    if (await this.isDirExists(dir)) {
      const res = await readdir(dir);
      return res.map(r => path.resolve(dir, r));
    }
    throw new Error(`Dir ${dir} not exists`);
  }

  readFile(filename: string) {
    return readFile(filename);
  }

  async writeFile(filename: string, content: Buffer) {
    await writeFile(filename, content);
  }

  async ensureDir(dir: string) {
    await mkdir(dir, { recursive: true });
  }
}

export const fsStorage = new FilesystemStorage();
