const path = require('path');
const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

const subscribers = new Set();

router.get('/subscribe', async (ctx, next) => {
  const message = new Promise((resolve) => {
    subscribers.add(resolve);

    ctx.res.on('aborted', () => {
      subscribers.delete(resolve);
      resolve();
    });
  });

  ctx.body = await message;
  return next();
});

router.post('/publish', async (ctx, next) => {
  const {request: {body: {message}}} = ctx;

  if (!message) {
    ctx.throw(400, 'Empty message');
    return next();
  }
  subscribers.forEach((resolve) => resolve(message));
  subscribers.clear();

  ctx.body = message;
  return next();
});

app.use(router.routes());

module.exports = app;
