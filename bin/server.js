'use strict';

const Koa = require('koa');
const Router = require('@koa/router');
const render = require('koa-ejs');
const path = require('path');

const app = new Koa();
const router = new Router();
const server = require('http').createServer(app.callback());
const io = require('socket.io')(server);
var clicks = 0;

render(app, {
  root: path.join(__dirname, 'views'),
  layout: 'index',
  viewExt: 'html',
  cache: false,
  debug: true
});

router.get('', '/', (ctx) => {
  io.on('connection', function(socket) {
    socket.emit('clickResponse', { message: clicks });
    socket.on('clickRequest', function(data) {
      socket.emit('clickResponse', { message: clicks++ });
    });
  });
  return ctx.render('index');
});

app
  .use(router.routes())
  .use(router.allowedMethods());

server.listen(8000);
