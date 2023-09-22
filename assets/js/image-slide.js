const imageIndexUrl = '/data/images.json';
const loadCount = 20; // 每次加载数量
let loadTimes = 0; // 加载次数
let currIndex = -1; // 当前选中元素的索引位置

function renderImgSrc(src){
    return `/${src}`;
}

/**
 * 创建图片元素
 * @param {*} param0 
 * @returns 
 */
function createImg({ src }){
    let img = document.createElement('img');
    img.src = renderImgSrc(src);
    img.preload = true; //
    return img;
}

/**
 * 加载图片
 * @param {*} callback 
 */
function loadImages(callback){
    $.get(imageIndexUrl, data=>{
        let imgs = [];
        data.slice(loadTimes*loadCount, (loadTimes+1)*loadCount).forEach((opt,index)=>{
            let img = createImg(opt);
            imgs.push(img);
            img.dataset.index = index + loadTimes*loadCount; // 图片序号
            
        })
        callback( imgs )
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
 * 预览多张图片
 * @param {*} item 
 */
function previewImages(items){
    if( !items || !items.length ){
        return;
    }
    document.querySelector('.preview>.image').innerHTML = null;
    items.forEach(item=>{
        document.querySelector('.preview>.image').appendChild(item.cloneNode());    
    })
    layoutImages();
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

/**
 * 多图预览
 * 布局预览的图片元素
 */
function layoutImages(){
    const images = document.querySelectorAll('.preview .image>img');
    let translateXOffset = images[currIndex].clientWidth*0.6;
    // translateXOffset = 360;
    let scaleOffset = 0.6;
    let rotateYOffset = 45;
    let opacityOffset = 0.8;
    
    for(let i=0; i<images.length; i++){
        let offset = i - currIndex;
        let img = images[i];
        let translateX = offset*translateXOffset;
        let scale = scaleOffset**Math.abs(offset);
        let rotateY = offset==0? 0 : -rotateYOffset*Math.sign(offset);
        img.style.transform = `translateX(${translateX}px) scale(${scale}) rotateY(${rotateY}deg)`;
        img.style.opacity = offset==0? 1 : opacityOffset**Math.abs(offset);
        img.style.zIndex = images.length - Math.abs(offset);
        offset == 0 && img.classList.add('active');
    }
}

window.onload = function(){
    //
    document.querySelector('.preview .image').addEventListener('click', function(evt){
        currIndex = Number(evt.target.dataset.index);
        layoutImages();
    });

    // 预览切换
    document.querySelectorAll('.preview .button').forEach(btn=>{
        btn.addEventListener('click', function(evt){
            let images = document.querySelectorAll('.preview .image>img');
            if( images.length ){
                if( this.classList.contains('prev') ){
                    document.querySelector('.preview .image').insertBefore(images[images.length-1], images[0]);
                }else{
                    document.querySelector('.preview .image').appendChild(images[0]);
                }
                layoutImages();
            }
        }); 
    })

    window.onresize = debounce(()=>{
        layoutImages();
    },100)
}

// init
loadImages(imgs=>{
    imgs.forEach(img=>{
        document.querySelector('.preview .image').appendChild(img);
    });
    currIndex = Math.ceil(imgs.length/2) - 1;
    layoutImages();
})