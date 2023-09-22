const imageIndexUrl = '/data/images.json';
const loadCount = 6;
const loadTimes = 0;
const images = [];

function renderImgSrc(src){
    return `/${src}`;
}

function createImg({ src }, classes){
    let div = document.createElement('div');
    div.classList.add('image-item');
    if( classes && classes.length ){
        classes.forEach(cls=>{
            div.classList.add(cls);
        })
    }
    src && (div.innerHTML= `<img src="${renderImgSrc(src)}" alt=""/>`); //
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

function randomNum(min, max){
    return Math.random()*(max - min) + min;
}

function layoutImages(type){
    const images = document.querySelectorAll('.image-item');
    const transforms = [
        'translateZ(150px)',
        'translateZ(-150px) rotateY(180deg)',
        'rotateX(-90deg) translateY(-150px)',
        'rotateX(90deg) translateY(150px)',
        'rotateY(270deg) translateX(-150px)',
        'rotateY(-270deg) translateX(150px)'
    ];
    const origins = ['','','top center','bottom center','center left','top right'];
    images.forEach((image,index)=>{
        image.style.transform = transforms[index];
        image.style.transformOrigin = origins[index];
    })
}

window.onload = function(){

    document.querySelectorAll('.nav .style-list>.style').forEach(elem=>{
        elem.addEventListener('click', function(){

        }, true)
    })
}

loadImages(items=>{
    items.forEach(item=>{
        document.querySelector('.container .box').appendChild(item);
        images.push(item);
    });
    layoutImages();
})