import { isValidString } from '../utils';

// 这里留一个钩子，方便后续将存储能力迁移到云上
export abstract class BasicStorage {
  abstract isFileExists(filename: string): Promise<boolean>;
  abstract isDirExists(dir: string): Promise<boolean>;

  abstract readFile(filename: string): Promise<Buffer>;
  abstract writeFile(filename: string, content: Buffer): Promise<void>;
  abstract ensureDir(dir: string): Promise<void>;
  // 浅度罗列某个目录下的文件列表
  abstract ls(dir: string): Promise<string[]>;

  async combind(files: string[], saveAs: string) {
    if (files?.some(r => !isValidString(r)) || !isValidString(saveAs)) {
      throw new Error(`Invalid file paths`);
    }

    const contents = await Promise.all(
      files.map(async r => {
        if ((await this.isFileExists(r)) !== true) {
          throw new Error(`file ${r} not exists`);
        }
        return this.readFile(r);
      }),
    );
    const combindedContent = Buffer.concat(contents);
    await this.writeFile(saveAs, combindedContent);
  }
}
