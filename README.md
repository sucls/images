## Koa

基于 Node.js 平台的下一代 Web 开发框架。

[官网](https://koa.bootcss.com/index.html#)

### 使用

```bash
node ./app.js
```

### 静态资源

koa-static

```bash
npm i koa-static -S
```

修改app.js
```
const koaStatic = require('koa-static');
app.use( koaStatic(path.join(__dirname, 'assets')) );
```

指定静态资源访问路径： /public/...
```js
const koaStatic = require('koa-static');
const mount = require('koa-mount');

app.use(mount('/public' koaStatic(__dirname , 'public')));
```

### 路由

koa-router
```bash
npm i koa-router
```

```js
const router = new Router();
router.get('/', (ctx, next)=>{
    // ...
})

app.use(router.routes());
app.use(router.allowedMethods());
```


### 视图解析

koa-views
```bash
npm i koa-views
```

```js
app.use(views(path.join(__dirname, 'views'),{
  extension:'ejs'
}));

router.get('/', (ctx, next)=>{
    // ...
    const props = { ... };
    ctx.render('index',{ props })
})
```


### 代理

koa2-proxy-middleware

```bash
npm  i koa2-proxy-middleware
```

```js
const proxy = require('koa2-proxy-middleware');

app.use(proxy({
  targets: {
    '/api/(.*)': {
        target: 'http://target/', //需要代理的地址
        changeOrigin: true,
        pathRewrite: { 	
            '/api': ""
        }
    }
  }
}))

```

### 压缩

+ sharp

  对图片压缩
```js
    // const readStream = ctx.req.pipe(sharp());
    // const writeStream = readStream.pipe(ctx.res);
    // // 设置图片质量为70%
    // await sharp(readStream).resize(500).toFile(writeStream, { quality: 50 });

app.use(async (ctx,next)=>{
  ctx.type = 'png';
  ctx.body = await sharp(imagePath).resize(500).png({compressionLevel: 5}).toBuffer();
})
```

+ compress

对内容压缩（图片貌似不行）
 *配置没效果*，但可以起作用
```bash
npm i koa-compress
```

```js
const compress = require('koa-compress');

app
  .use(compress({
    filter: mimeType=> /javascript/.test(mimeType),
    threshold: 1024,
    gzip: true
  }))
```


### 其他中间件

+ koa2-connect-history-api-fallback  
  将所有未匹配的HTTP请求重定向到指定的静态HTML页面，比如index.html

```bash
npm i koa2-connect-history-api-fallback
```

```js
const  history = require('koa2-connect-history-api-fallback');

app.use(history({ 
     whiteList: ['/api']
 }));
```

+ koa-bodyparser  
  处理客户端提交的数据，并封装到ctx.request.body
  如果是附件，需要使用koa-multer

```bash
npm i koa-bodyparser
```

```js
const bodyParser = require('koa-bodyparser');

app.use(bodyParser());

app.use((ctx,next)=>{
    const body = ctx.request.body;
    await next();
})
```

+ koa-json
  处理Json响应数据，美化输出json数据格式？感觉没什么用

```bash
npm i koa-json
```

```js
const json = require('koa-json');

app.use(json());
```

### 技术点

js库很多，但不一定需要用到，当然熟悉了原理就是利器，否则...

+ jquery
+ imagesloaded 图片加载完成后处理
+ turn.js  翻页效果
+ Tween.js  渐变
+ Bounce.js 页面设计器
+ Move.js 缩放、倾斜、移动等动效
+ Anime.js 
+ Mo.js 形状，漩涡，爆发和交错，
+ Matter.js 物理运动、碰撞、惯性动画库
+ parallax.js 视差效果
+ Dynamics.js 控制持续时间、频率、预期尺寸和强度等动效
+ Single Element CSS Spinners 加载中特性
+ p5.js
+ Babylon.js