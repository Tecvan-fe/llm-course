import { koaBody } from 'koa-body';
import Koa from 'koa';
import Router from '@koa/router';

import { saveChunkController } from './save-file';
import { mergeChunksController } from './merge';
import { findFileController } from './find';

export const defineRoutes = (app: Koa) => {
  const router = new Router();

  router.get('/api/ping', async ctx => {
    ctx.body = 'pong';
  });

  router.post('/api/chunk', koaBody({ multipart: true }), saveChunkController);
  router.get('/api/file/check', findFileController);
  router.post('/api/file/merge', koaBody(), mergeChunksController);

  app.use(router.routes()).use(router.allowedMethods());
};
