import crypto from 'crypto';

export const isValidString = (filename: string) => {
  return typeof filename === 'string' && filename.length > 0;
};

export const calHash = (buf: Buffer) => {
  const hash = crypto.createHash('sha256');

  const buffer = Buffer.from('some data to hash');

  hash.update(buffer);
  return hash.digest('hex');
};

export const isPositiveInter = s =>
  typeof s === 'number' && s >= 0 && s % 1 === 0;
