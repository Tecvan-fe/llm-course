import { type Context, type Middleware } from 'koa';

export const configProvider = <T>(config: T): Middleware => {
  return async (ctx: Context, next: () => Promise<void>) => {
    ctx.readConfig = (): T => config;
    await next();
  };
};
