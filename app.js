const fs = require('fs');
const path = require('path');

const Koa = require('koa');
const Router = require('koa-router'); // 路由
const views = require('koa-views'); // 视图映射
const koaStatic = require('koa-static'); // 静态资源
const mount = require('koa-mount'); // 静态资源映射
const compress = require('koa-compress'); // 内容压缩
const json = require('koa-json'); //json美化
const bodyParser = require('koa-bodyparser'); // 请求体转换
const { historyApiFallback } = require('koa2-connect-history-api-fallback'); // 失败跳转
const sharp = require('sharp'); // 图片压缩

const app = new Koa();
const router = new Router();

// 图片压缩
const imageCompress = async (ctx, next)=>{
  if(/^\/assets\/images\/.*\.png$/.test(ctx.request.path)){
    ctx.type = 'png';
    const imagePath = path.join(__dirname, ctx.request.path);
    if( Object.keys(ctx.request.query).indexOf('raw')!=-1 ){ // 通过参数控制是否压缩
        const data = fs.readFileSync(imagePath);
        ctx.body = data;
    }else{
      let size = Number(ctx.request.query.size) || 500; 
      // fixme调整图片压缩、裁剪策略
      ctx.body = await sharp(imagePath).resize(size).png({compressionLevel: 9}).toBuffer();
    }
  }else{
    // ctx.compress = true; // 无效
    await next();
  }
}

router.get('/', async (ctx, next)=>{
  ctx.type = 'html';
  ctx.body = await renderContent('index.html');
})
router.get('/:page.html', async (ctx, next)=>{
  // ctx.type = path.extname(ctx.req.url);
  // await renderContent(ctx, ctx.req.url);
  await ctx.render(ctx.params.page)
})
router.get('/data/:data.json', async (ctx, next)=>{
  ctx.type = path.extname(ctx.req.url);
  ctx.body = await renderContent(ctx.req.url);
})
router.get('/:image.png', async (ctx, next)=>{
  ctx.type = path.extname(ctx.req.url);
  ctx.body = await renderContent(ctx.req.url, true);
})
router.get('/favicon.ico', async (ctx, next)=>{
  ctx.type = 'icon';
  ctx.body = await renderContent('favicon.ico', true);
})
/**
 * 优先级大于静态资源
 */
router.get("/(.*)", async (ctx,next)=>{
  console.log('/.* --->', ctx.req.url )
  await next();
})

// 404
const notFound = async (ctx, next)=>{
  ctx.status = 404;
  ctx.body = await renderContent('/views/404.html')
  // ctx.render('404');
}

function renderContent(name, origin){
  return new Promise((resolve, reject)=>{
    fs.readFile(path.join(__dirname, name), (err,data)=>{
      if( err ){
        console.error(`读取文件出错：${err}`);
        return;
      }
      resolve(origin? data : data.toString());
    })
  })
}

app
  .use(imageCompress)
  .use(compress())
  .use(mount('/assets', koaStatic(path.join(__dirname, '/assets'), { defer: false })))
  .use(views(path.join(__dirname,'views'), {extension: 'html'}))
  .use(router.routes())
  .use(router.allowedMethods())
  .use(json())
  .use(notFound)
  .use(bodyParser())
  .use(historyApiFallback({verbose: false, index: '/500.html'}))
  ;


app.listen(9000, () => {
  console.log(`app listening at http://localhost:9000`)
});