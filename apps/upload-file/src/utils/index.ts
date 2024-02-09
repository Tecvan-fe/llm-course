export const isValidString = s => typeof s === 'string' && s.length > 0;

export const isPositiveInter = s =>
  typeof s === 'number' && s >= 0 && s % 1 === 0;

export const isUndefined = s => typeof s === 'undefined';
