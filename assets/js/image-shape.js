const imageIndexUrl = '/data/images.json';
const loadCount = 16;
const loadTimes = 0;

function renderImgSrc(src){
    return `/${src}`;
}

function createImg({ src }){
    let div = document.createElement('div');
    div.classList.add('image-item');
    div.classList.add('bubble');

    let inner = [];
    new Array(5).fill(0).forEach(e=>{inner.push('<span></span>')});
    inner.push(`<img src="${renderImgSrc(src)}" alt=""/>`);
    // div.style.background = `url(${renderImgSrc(src)}) center center/ cover no-repeat`;
    div.innerHTML= inner.join(''); //
    return div;
}

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

function random(min, max){
    return Math.random()*(max - min) + min;
}

function layoutImages(){
    const images = document.querySelectorAll('.image-item');
    const offsetLeft = 100/images.length;
    const shapes = ['star','circle','rhombus','love','hexagon']

    images.forEach((image,index)=>{
        // 控制位置、大小、形状、样式、移动速度、运动方式
        image.style.left = (index * offsetLeft) + '%'; // 位置
        image.style.width = image.style.height = random(100,300)+'px';
        image.style.animationName = 'move-bubble';
        image.style.animationDuration = random(5,8)+'s';
        image.style.animationTimingFunction = 'linear';
        image.style.animationDelay = random(0,5)+'s';
        image.style.animationIterationCount = 'infinite';
        image.style.animationDirection = 'normal';

        image.classList.add(shapes[Math.floor(random(0,5))]);
    })
}

loadImages(items=>{
    items.forEach(item=>{
        document.querySelector('.container').appendChild(item);
    })
    layoutImages();
})