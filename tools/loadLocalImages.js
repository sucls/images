/**
 * 本地图片迁移
 * 1. 图片生成到指定目录
 * 2. 构建图片索引json
 * 
 */
const fs = require('fs');
const path = require('path');
const { nanoid } = require('nanoid');

const imageLocalPath = 'C:\\Users\\su_ch\\Pictures\\AI';
const imageRelPath = '/assets/images'; //相对根目录
const imageSavePath = path.resolve(__dirname, '..'+imageRelPath); // 图片最终存储路径
const indexPath = path.resolve(__dirname, '../data/images.json'); // 图片索引json文件
const imageExtname = "png"; //文件类型

const images = [];

const handleFile = (filePath)=>{
    fs.readdir(filePath, {withFileTypes:true}, (err, files)=>{
        if( err ){
            console.error(`出错${err}`)
            return
        }
    
        files.forEach(file=>{
            if( file.isDirectory() ){
                console.log( '处理目录', path.join(filePath, file.name) )
                handleFile(path.join(filePath, file.name));
            }else if( file.isFile() ){
                // let subPath = filePath.replaceAll(imageLocalPath,'') || '';
                let savePath = path.join(imageSavePath, '');// 全部同一层级
                if(path.extname(file.name) != '.'+imageExtname){// 只处理png
                    return;
                }
                if( !fs.existsSync(savePath) ){
                    fs.mkdirSync(savePath); //
                }
                console.log( '处理文件', path.join(filePath, file.name) +'->'+ savePath)
                let fileName = nanoid();
                fs.copyFile(path.join(filePath, file.name), path.join(savePath, fileName+'.'+imageExtname), err=>{
                    if(err){
                        console.error(`文件复制出错：${err}`);
                    }else{
                        console.error(`文件复制完成：${fileName}`);
                        images.push({
                            id: fileName,
                            src: `${imageRelPath}/${fileName}.${imageExtname}`,
                            info: {},
                            time: new Date().getTime()
                        });
                    }
                });
            }else{
                console.warn(`不支持文件类型：${file}处理`)
            }
        })
    })
}

const saveImageIndex = function(){
    console.log( '-----------------------',images )
    fs.writeFile(indexPath, JSON.stringify(images), err=>{
        err && console.error(`文件保存到：${indexPath}出错：${err}`)
    })
}

// 加载图片到本地环境
handleFile(imageLocalPath);
// 保存文件索引
setTimeout(()=>{
    saveImageIndex();
},5000)



