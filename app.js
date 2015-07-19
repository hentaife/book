var koa = require('koa')
var router = require('koa-router')()
var serve = require('koa-static')
var render = require('koa-swig')
var path = require('path')
var config = require('./config')
var controllers = require('./controllers/')

var app = koa()

// view 模板
app.context.render = render({
  root: path.join(__dirname, 'views'),
  autoescape: true,
  cache: config.debug ? false : 'memory', // 'memory' || disable, set to false
  ext: 'html',
  locals: {
    debug: config.debug
  }
})

// 静态文件服务器
app.use(serve(__dirname + '/static/root'))

// 路由
app.use(router.routes())

router.get('/', controllers.index)

// 404 处理
app.use(function *() {
  if (404 === this.status) {
    this.status = 404
    yield this.render('404')
  }
})

app.listen(config.port)

console.log('listen to ' + config.port)
