const imageIndexUrl = '/data/images.json';
const loadCount = 20; // 每次加载数量
let loadTimes = 0; // 加载次数

function renderImgSrc(src){
    return `/${src}`;
}

/**
 * 创建图片元素
 * @param {*} param
 * @returns 
 */
function createImg({ src }){
    let div = document.createElement('div');
    div.classList.add('paper-image');
    div.innerHTML= `<img src="${renderImgSrc(src)}?size=300" alt=""></div>`; //
    return div;
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
 * 多图预览
 * 布局预览的图片元素
 */
function layoutImages(){
    const images = document.querySelectorAll('.book .paper .paper-image');
    //
    const initialX = 0.5, ininialY = 0.5;
    images.forEach((img,index)=>{
        let x = -(initialX+index), y = ininialY+index;
        img.style.transform = `rotateY(20deg) translate3d(${x}px, ${y}px, 0)`;
        // img.style.order = index;
        img.style.zIndex = images.length - index;
    })
}

function openAndLayoutImages(){
    const initialX = 0.5, ininialY = 0.5;

    const openedImages = document.querySelectorAll('.book .paper .paper-image.open');
    openedImages.forEach((img,index)=>{
        let offset = openedImages.length - index;
        let x = (initialX+offset), y = -(ininialY+offset);
        img.style.transform = `rotateY(-160deg) translate3d(${x}px, ${y}px, 0)`;
        img.style.zIndex = index;
    })
    const notOpenimages = document.querySelectorAll('.book .paper .paper-image:not(.open)');
    notOpenimages.forEach((img,index)=>{
        let x = (initialX+index), y = -(ininialY+index);
        img.style.transform = `rotateY(-20deg) translate3d(${x}px, ${y}px, 0)`;
        img.style.zIndex = notOpenimages.length - index;
    })
}

window.onload = function(){
    //
    document.querySelector('.book .paper').addEventListener('click', function(evt){
        let image = evt.target.parentElement;
        let index = Number(image.dataset.index);

        if( !image.classList.contains('open') ){
            evt.currentTarget.classList.add('selected');
        }else if(index == 0){
            evt.currentTarget.classList.remove('selected');
        }
        image.classList.toggle('open');
        openAndLayoutImages();
    });


    window.onresize = debounce(()=>{
        // layoutImages();
    },100)
}

// init
loadImages(imgs=>{
    imgs.forEach(img=>{
        document.querySelector('.book .paper').appendChild(img);
    });
    layoutImages();
})