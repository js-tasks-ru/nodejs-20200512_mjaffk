const path = require('path');
const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

const subscribers = new Map();

router.get('/subscribe', async (ctx, next) => {
  const id = Math.random();
  ctx.status = 200;
  const promise = new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 400);
  });

  subscribers.set(id, (message) =>
      promise.then(() => {
        ctx.body = message;
      }),
  );

  ctx.req.on('aborted', () => {
    subscribers.delete(id);
  });

  await promise;
  return next();
});

router.post('/publish', async (ctx, next) => {
  const {request: {body: {message}}} = ctx;
  ctx.status = 200;
  if (!message) {
    return next();
  }
  ctx.body = message;

  await Promise
      .all([...subscribers.values()]
          .map(promiseFunk => promiseFunk(message)));

  subscribers.clear();
  return next();
});

app.use(router.routes());

module.exports = app;
