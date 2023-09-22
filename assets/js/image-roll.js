const imageIndexUrl = '/data/images.json';
const loadCount = 20; // 每次加载数量
let loadTimes = 0; // 加载次数

function renderImgSrc(src){
    return `/${src}`;
}

/**
 * 创建图片元素
 * @param {*} param0 
 * @returns 
 */
function createImg({ src }){
    let div = document.createElement('div');
    div.classList.add('image-item');
    div.innerHTML= `<img src="${renderImgSrc(src)}" alt=""></div>`; //
    return div;
}

/**
 * 加载图片
 * @param {*} callback 
 */
function loadImages(callback){
    $.get(imageIndexUrl, data=>{
        let items = [];
        data.slice(loadTimes*loadCount, (loadTimes+1)*loadCount).forEach((opt,index)=>{
            let item = createImg(opt);
            items.push(item);
            item.dataset.index = index + loadTimes*loadCount; // 图片序号
            
        })
        callback( items)
    })
}

/**
 * 预览图片
 * @param {*} item 
 */
function previewImage(item){
    const img = item.querySelector('img');
    const previewImg = img.cloneNode();
    document.querySelector('.preview>.image').replaceChildren(previewImg);
}

/**
 * 选中图片
 * @param {*} item 
 * @returns 
 */
function selectImage(item){
    item.parentNode.querySelectorAll('.active').forEach(elem=>elem.classList.remove('active'));
    item.classList.add('active');
    previewImage(item);
    return item;
}

/**
 * 更换元素
 * @param {*} forward 
 */
function switchImage(forward){
    const active = document.querySelector('.image-item.active');
    const nav = document.querySelector('.selector .nav');
    let curr;
    if( forward ){
        curr = active.nextElementSibling;
    }else{
        curr = active.previousElementSibling;
    }

    if( curr ){
        selectImage(curr);
        // 滚动元素到中间
        curr.scrollIntoView({behavior: 'smooth', inline: 'center'});
    }else if( forward ){ // 翻页重新加载
        loadTimes++;
        loadImages(items=>{
            items.forEach(item=>{
                nav.appendChild(item);
            })
        })
    }
}

window.onload = function(){
    //  图片导航
    document.querySelectorAll('.selector .image-item').forEach(elem=>{
        elem.addEventListener('click', function(evt){
            selectImage(this);
        }, true)
    });
    // 导航按钮
    document.querySelectorAll('.selector .button').forEach(btn=>{
        let mousePressing = false;
        btn.addEventListener('click', function(evt){
            if( mousePressing ){
                return;
            }
            console.log('click', evt)
            switchImage(this.classList.contains('next'));
        });

        let timer, processTimer;
        btn.addEventListener('mousedown', function(evt){
            console.log('down', evt.currentTarget)
            timer && clearTimeout(timer); // 防止鼠标移出元素后调用放开
            processTimer && clearTimeout(processTimer);
            mousePressing = false; // 防止鼠标移出元素后调用放开

            btn = this;
            timer = setTimeout(function(){
                mousePressing = true;
                processTimer = setInterval(() => {
                    console.log( '处理' )
                    switchImage(btn.classList.contains('next'));
                }, 300);
            }, 500); // 长按500ms认定为长按

        })
        btn.addEventListener('mouseup', function(evt){
            console.log('up', evt)
            timer && clearTimeout(timer);
            processTimer && clearTimeout(processTimer);
        })
    });
    // 预览图片事件

    const previewer = document.querySelector('.preview .image');
    //图片移动
    previewer.addEventListener('mouseenter',function(evt){
        const handleImgDrag = function(evt){
            evt.preventDefault();
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
        };
            // 滚动放大缩小
        this.querySelector('img').addEventListener('wheel', debounce(function(evt){
            let val = evt.deltaY;
            let img = this//.querySelector('img');
            let imageScale = img.style.getPropertyValue('--image-scale')||1;
            let scale = Number(imageScale) + 0.2*(val>0?-1:1);
            img.style.setProperty('--image-scale',  scale>0?scale:0.2);
        },100)); 
        this.querySelector('img').addEventListener('mousedown', handleImgDrag);
        this.querySelector('img').removeEventListener('mouseup', handleImgDrag);

        previewer.addEventListener('mouseleave',function(evt){
            
        })
    })

    // todo 多图预览
    document.querySelectorAll('.preview .button').forEach(btn=>{
        btn.addEventListener('click', function(evt){
            console.log(this)
            let images = document.querySelectorAll('.preview .image>img');
            if( images.length ){
                if( this.classList.contains('next') ){
                    document.querySelector('.preview .image').insertBefore(images[images.length-1], images[0]);
                }else{
                    document.querySelector('.preview .image').appendChild(images[0]);
                }
                // layoutImages();
            }
        }); 
    })
}

// init
loadImages(items=>{
    items.forEach(item=>{
        document.querySelector('.selector .nav').appendChild(item);
    });
    // 默认选择第一个
    if( !document.querySelector('.selector .nav .image-item.active') ){
        selectImage(document.querySelector('.selector .nav .image-item'));
    }
})