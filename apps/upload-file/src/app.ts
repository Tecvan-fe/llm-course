import logger from 'koa-pino-logger';
import Koa from 'koa';

import { errorCatch } from './middlewares/error-catch';
import { configProvider } from './middlewares/config';
import { defineRoutes } from './controllers';

interface ContextConfig {
  fileStorageRoot: string;
}
export const bootstrap = (
  context: {
    port: number;
  },
  config: ContextConfig,
) => {
  const port = Number(context.port) || 3000;
  const app = new Koa();

  app.use(errorCatch());
  app.use(logger());

  app.use(configProvider<ContextConfig>(config));

  defineRoutes(app);

  return new Promise((resolve, reject) => {
    try {
      app.listen(port, () => {
        resolve({ port });
      });
    } catch (e) {
      reject(e);
    }
  });
};
