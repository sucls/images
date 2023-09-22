/**
 * 本地图片迁移
 * 1. 图片生成到指定目录
 * 2. 构建图片索引json
 * 
 */
const fs = require('fs');
const path = require('path');

const imageRelPath = 'assets/images';
const imagePath = path.join(__dirname, '..', imageRelPath);
const indexPath = path.resolve(__dirname, '../data/images.json'); // 图片索引json文件
const imageExtname = ".png"; //文件类型



const handleFile = (filePath, complete)=>{
    fs.readdir(filePath, {withFileTypes: true}, (err, files)=>{
        const images = [];
        if( err ){
            console.error(`处理文件出错：${err}`)
            return
        }else{
            files.forEach((file, i)=>{
                if( file.isFile() ){
                    let fileName = String(i).padStart(3,'0') + imageExtname;
                    // console.log( '--> 文件重命名', path.join(filePath, file.name) +'->'+ fileName);
                    fs.renameSync(path.join(filePath, file.name), path.join(filePath, fileName));
    
                    images.push({
                        id: fileName,
                        src: `${imageRelPath}/${fileName}`,
                        info: {},
                        time: new Date().getTime()
                    });
                }
            })
        }
        complete( images );
    })
}

const saveImageIndex = function(images){
    fs.writeFile(indexPath, JSON.stringify(images), err=>{
        err && console.error(`文件保存到：${indexPath}出错：${err}`)
    })
}


// 更新文件索引
new Promise((resolve)=>{
    handleFile(imagePath, resolve);
}).then((images)=>{
    saveImageIndex(images);
})


