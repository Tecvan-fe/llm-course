type NodeEnv = 'development' | 'production' | 'test';

export const ENV: NodeEnv = (process.env.NODE_ENV || 'development') as NodeEnv;
