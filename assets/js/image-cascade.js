const imageContainer = document.querySelector('.image-container'); // 主容器
const imageList = document.querySelector('.image-list'); // 图片容器

let loadTimes = 0; // 加载次数
const loadCount = 20; // 一次加载图片数量

const baseurl = env.baseurl || '';
const imageIndexUrl = 'data/images.json';

/**
 * 加载中元素
 * @returns 
 */
function createLoadding(){
    return '<div class="loadding"><i class="icon ri-loader-line"></i></div>';
}
/**
 * 创建图片浮动信息
 * @returns 
 */
function createImgInfo(){
    return `<div class="image-info">
                <div class="desc">
                    <div class="title">示例图片</div>
                </div>
                <div class="info">
                </div>
            </div>`;
}
/**
 * 创建图片浮动操作
 * @returns 
 */
function createImgTooltip(){
    return `<div class="image-tooltip">
                <div class="item">
                    <i class="icon ri-download-2-line" data-name="download"></i>
                </div>
                <div class="item">
                    <i class="icon ri-share-forward-line" data-name="share"></i>
                </div>
                <div class="item">
                    <i class="icon ri-eye-line" data-name="showProperty"></i>
                </div>
            </div>`;
}

function strToDom(str){
    return new DOMParser().parseFromString(str, 'text/html').body.childNodes[0];
}

function renderImgSrc(src){
    return `${baseurl}${src}`;
}

/**
 * 创建图片dom
 * @param {*} src 
 * @returns 
 */
function createImg({ src }){
    let div = document.createElement('div');
    div.classList.add('image-item');
    div.innerHTML= `<img src="${renderImgSrc(src)}" alt="">${createImgTooltip()}</div>`; //
    // let image = new Image();
    // image.src = src;
    // image.onload = (evt)=>{ 
    //     console.info(`加载图片：${src}完成`, [image.naturalWidth, image.naturalHeight]); 
    // }
    // image.onerror = ()=>{ console.info(`加载图片：${src}出错`) };
    return div;
}

/**
 * 加载图片数据
 * @param {*} callback 
 */
function loadImages( callback ){
    $.ajaxSetup({ 
        // async: false,
        beforeSend: ()=>{
            // startLoadding();
        },
        complete: ()=>{
            // finishLoadding();
        }
    });
        //
    $.get(imageIndexUrl, data=>{
        let items = [];
        data.slice(loadTimes*loadCount, (loadTimes+1)*loadCount).forEach((opt,index)=>{
            // setTimeout(()=>{
                let item = createImg(opt);
                items.push(item);
                item.dataset.index = index + loadTimes*loadCount; // 图片序号
            //     bindImageListener( imageList.appendChild(item) );
            // },0)
        })
        callback( items)
    })
}
/**
 * 创建图片视图（弹窗）
 * @param {*} src 
 * @returns 
 */
function createImgViewer({ src }){
    let tpl = `<div class="image-viewer">
                    <div class="image-marker"></div>
                    <div class="image-button image-viewer-prev"><i class="icon ri-arrow-left-s-line" data-name="selectPrev"></i></div>
                    <div class="image-button image-viewer-next"><i class="icon ri-arrow-right-s-line" data-name="selectNext"></i></div>
                    <div class="image-button image-actions">
                        <div class="image-actions-inner">
                            <i class="icon ri-zoom-in-line" data-name="zoomIn"></i>
                            <i class="icon ri-zoom-out-line" data-name="zoomOut"></i>
                            <i class="icon ri-fullscreen-line" data-name="zoomFull"></i>
                            <i class="icon ri-clockwise-line" data-name="rotateRight"></i>
                            <i class="icon ri-anticlockwise-line" data-name="rotateLeft"></i>
                            <i class="icon ri-close-circle-line" data-name="close"></i>
                        </div>
                    </div>
                    <div class="image-canvas">
                        <img src="${src}?raw">
                    </div>
                </div>`;
    return strToDom(tpl);
}

function createImgProperty({ src }){
    let tpl = `<div class="image-property">
                 <div class="propery-modal">
                    <div class="property-title">
                        <div><i class="icon ri-close-line" onclick="document.querySelector('.image-property').remove()"></i></div>
                        <span>我只是一个标题</span>
                    </div>
                    <div class="property-content">
                        <div class="property-img">
                            <img src="${renderImgSrc(src)}">
                        </div>
                        <div class="property-data">
                            <div class="field-group inline">
                                <label class="label">属性1</label>
                                <span class="value">XXX</span>
                            </div>
                            <div class="field-group inline">
                                <label class="label">属性2</label>
                                <span class="value">YYY</span>
                            </div>
                        </div>
                    </div>
                    <div class="property-actions">

                    </div>
                 </div>
               </div>`;
    return strToDom(tpl);
}

/**
 * 图片元素相关事件
 */
const imageHandlerFactory = {
    zoomIn: (root,evt)=> {
        let img = root.querySelector('img');
        // let transform = img.style.transform;
        img.style.setProperty('--image-scale', Number(img.style.getPropertyValue('--image-scale')||1) + 0.2);
    },
    zoomOut: (root,evt)=> {
        let img = root.querySelector('img');
        let scale = Number(img.style.getPropertyValue('--image-scale')||1) - 0.2;
        img.style.setProperty('--image-scale', scale>0?scale:0.2);
    },
    zoomFull: (root,evt)=> {
        let img = root.querySelector('img');
        if( evt.target.classList.contains('ri-fullscreen-line') ){
            img.style['max-height'] = 'unset';
            img.style['max-width'] = 'unset';
            evt.target.classList.remove('ri-fullscreen-line');
            evt.target.classList.add('ri-fullscreen-exit-line');
        }else{
            img.style['max-height'] = '100%';
            img.style['max-width'] = '100%';
            evt.target.classList.remove('ri-fullscreen-exit-line');
            evt.target.classList.add('ri-fullscreen-line');
            img.style.setProperty('--image-scale', 1);
        }
    },
    rotateRight: (root,evt)=> {
        let img = root.querySelector('img');
        let imageRotate = img.style.getPropertyValue('--image-rotate')||'0deg';
        img.style.setProperty('--image-rotate', (Number(imageRotate.replaceAll('deg','')) + 90)+'deg');
    },
    rotateLeft: (root,evt)=> {
        let img = root.querySelector('img');
        let imageRotate = img.style.getPropertyValue('--image-rotate')||'0deg';
        img.style.setProperty('--image-rotate', (Number(imageRotate.replaceAll('deg','')) - 90)+'deg');
    },
    close: (root,evt)=> root.remove(),
    selectPrev: (root,evt)=>{
        let index = Number(root.dataset.imageIndex || 0) - 1;
        let imgs = document.querySelectorAll('.image-item>img');
        index = index<0?(imgs.length-1):index;
        let img = imgs[index];
        root.dataset.imageIndex = index;
        root.querySelector('img').src=img.src;
    },
    selectNext:(root,evt)=>{
        let index = Number(root.dataset.imageIndex || 0) + 1;
        let imgs = document.querySelectorAll('.image-item>img');
        index = index>imgs.length-1?0:index;
        let img = imgs[index];
        root.dataset.imageIndex = index;
        root.querySelector('img').src=img.src;
    },
    download: (root,evt)=>{
        let img = root.querySelector('img');
        let a = document.createElement('a');
        a.href = img.src;
        a.download = img.src.substring( img.src.lastIndexOf('/')+1 );
        a.click();
        a.remove();
    },
    share: (root,evt)=>{},
    showProperty: (root,evt)=>{
        let img = root.querySelector('img');
        let property = createImgProperty({src: img.src});
        property.dataset.targetId = img.getAttribute('id')||'';
        imageContainer.appendChild(property);
    }
}

/**
 * 
 * @param {*} evt 
 * @returns 
 */
function handleImageItemClick (evt){
    const imgItem = this;
    const handleViewerAction = function(evt){
        if( evt.target.classList.contains('image-canvas')){ // 删除弹窗
            this.removeEventListener('click', handleViewerAction);
            this.remove();
        }
        
        if(evt.target.tagName === 'I'){
            let btnName = evt.target.dataset.name;
            if( imageHandlerFactory[btnName] ){
                imageHandlerFactory[btnName](this, evt);
            }
        }
    }
    const handleImageZoom = function(evt){
        let val = evt.deltaY;
        let img = this.querySelector('img');
        let imageScale = img.style.getPropertyValue('--image-scale')||1;
        let scale = Number(imageScale) + 0.2*(val>0?-1:1);
        img.style.setProperty('--image-scale',  scale>0?scale:0.2);
    }
    const handleImageMoving = function(evt){
        evt.preventDefault(); // 必须
            // 记录初始位置
        var initialX = evt.clientX - this.offsetLeft;
        var initialY = evt.clientY - this.offsetTop;

        const viewer = this.parentNode;
        const image = this;
        viewer.onmousemove = function(event) {
            // 计算移动距离，并更新元素位置
            var xOffset = event.clientX - initialX;
            var yOffset = event.clientY - initialY;
            image.style.left = xOffset + 'px';
            image.style.top = yOffset + 'px';
        };
    
        // 取消鼠标拖动时停止更新元素位置
        viewer.onmouseup = function() {
            viewer.onmousemove = null;
            viewer.onmouseup = null;
        };
    }

    if( evt.target.tagName == 'I' ){
        handleViewerAction.call(imgItem, evt)
        return;
    }

    let viewer = createImgViewer({src: evt.target.src});
    viewer.dataset.targetId = imgItem.querySelector('img').getAttribute('id')||'';
    viewer.dataset.imageIndex = imgItem.dataset.index;
    imageContainer.appendChild(viewer);
    
    viewer.addEventListener('click', handleViewerAction); // 处理弹窗按钮
    viewer.addEventListener('wheel', handleImageZoom); // 滚动放大缩小
    viewer.querySelector('img').addEventListener('mousedown', handleImageMoving); //图片移动
}

function bindImageListener(imgItem){
    imgItem.addEventListener('click', handleImageItemClick)
}

function initImages(){
    
    loadImages(items=>{
        let total = items.length;
        items.forEach(item=>{
            imageList.appendChild(item);
            bindImageListener(item); // 绑定各种事件
        })

        startLoadding();
        $(imageList).imagesLoaded()
        .always(()=> {
            // layoutImages(); // 重新布局
            finishLoadding()
        })
        .progress( ( instance, image ) =>{
            if( Math.floor(instance.progressedCount/ total)%20 == 0  ){ // 20%进度进行一次
                // layoutImages(instance.images.filter(img=>img.isLoaded).map(img=>img.img.parentNode)); // 重新布局
            }
            image.img.parentNode.classList.contains('placed') || layoutImages([image.img.parentNode]);
        });
        
    }); // 加载图片
}

/**
 * 
 */
function layout(){
    const itemWidth = 270; // 图片宽度
    const containerWidth = imageList.clientWidth; //图片容器宽度
    const colCount = Math.floor(containerWidth/itemWidth); // 列数
    const columns = new Array(colCount).fill(0); // 每列的坐标
    const gap = 20; // 间隔
    const offsetY = 10; //
    function findMinColumnIndex(cols){
        let maxVal = Math.min(... cols);
        return cols.indexOf(maxVal);
    }
    
    return function( items ){ // items
         (items && items.length? items : imageList.querySelectorAll('.image-item:not(.placed)')).forEach(item=>{
            let minIndex = findMinColumnIndex(columns);
            let top = columns[minIndex]+ (columns[minIndex]==0?0:gap);
            item.style.top = top+'px';
            item.style.left = (minIndex*(itemWidth+ (minIndex==0?0:gap+offsetY))) + 'px';
            columns[minIndex] = top + item.clientHeight;

            item.classList.add('placed');
        })
    }

}

function startLoadding(){
    document.body.appendChild( new DOMParser().parseFromString(createLoadding(), 'text/html').body.childNodes[0] )
}

function finishLoadding(){
    document.querySelectorAll('.loadding').forEach(loadding=>loadding.remove());
}

// 防抖
function throttle(fn, delay=50){
    let timer;
    return function(){
        if( timer ){
            clearTimeout(timer);
        }
        let that = this;
        let args = Array.prototype.slice.call(arguments,0);
        timer =setTimeout(function(){
            fn.apply(that, args);
            timer = null;
        },delay)
    }
}

let layoutImages = layout();
window.onload = function(){
    // 使用网上的方式实现
    // $('.image-list').cascade({
    //     init: ()=>  $('.image-list').on('click', '.image-item', handleImageItemClick),
    //     scrollCallback: (pageIndex, complete)=>{
    //         console.log('scroll ', pageIndex)
    //         loadTimes = pageIndex;
    //         loadImages(result=>complete(result));
    //     }
    // });

    document.querySelector('.image-container').addEventListener('scroll', throttle(function(evt){
        let loadingImage;
        if(this.scrollHeight - this.scrollTop <= this.clientHeight + 20 && !loadingImage){
            loadTimes++;
            loadingImage = true;
            initImages();
            loadingImage = false;
        }
    }));

    window.addEventListener('resize', throttle(evt=>{
        layoutImages = layout();
        imageList.querySelectorAll('.image-item.placed').forEach(item=>item.classList.remove('placed'));
        layoutImages();
    }))
}

initImages();