import { type Context, type Middleware } from 'koa';

import { HttpError } from '../utils/http-error';
import { ENV } from '../const';

export const errorCatch = (): Middleware => {
  return async (ctx: Context, next: () => Promise<void>) => {
    try {
      await next();
    } catch (e) {
      const err = e as Error;
      const message = `Unhandle error: ${err.message || e}`;
      ctx.log.error(message);
      const code = e instanceof HttpError ? e.code : 500;
      ctx.status = code;
      ctx.body = {
        code,
        message:
          ENV === 'production'
            ? message
            : `Unhandle Error: ${message}\n${err.stack}`,
      };
    }
  };
};
