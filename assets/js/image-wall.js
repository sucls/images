const imageIndexUrl = '/data/images.json';
const loadCount = 50;
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

function getHashValues( type ){
    let hash = window.location.hash;
    let result = {};
    if( hash ){
       hash = hash.substring(1);
       hash.split('&').forEach(val=>{
          let values = val.split('=');
          result[values[0]] = values[1];
       }) 
    }
    return result[type];
}

function layoutImages(type){
    const style = type || ( container.dataset.type || 'default' );

    layoutImageByStyle(style);
}

function layoutImageByStyle(style){
    const container = document.querySelector('.container');
    container.innerHTML = null;
    if( style == 'photo' ){
        images.forEach((image,index)=>{
            image = image.cloneNode(true);
            let zIndex = Math.floor(randomNum(0, 5));
            let rotate = randomNum(-50, 50);
            image.style.transform = `rotateZ(${rotate}deg)`;
            image.style.zIndex = zIndex;
            container.appendChild(image);
        })
    }else if( style == 'default' ){
        images.forEach((image,index)=>{
            image = image.cloneNode(true);
            // image.style.transform = null;
            // image.style.zIndex = null;
            container.appendChild(image);
        })
    }else if( style == 'love' ){
        layoutImageByLove(container, images);
    }else{
        images.forEach((image,index)=>{
            container.appendChild(image);
        })
    }
}

function layoutImageByLove(container, images){
    const count = [8, 9];
    const loveCoord = buildShapeCoord('love', count);
    let index = 0;
    for(let x=0; x<count[0] ; x++){
        const range = loveCoord[x];
        for(let y=0; y<count[1]; y++){
            // const fill = loveCoord.find(([_x,_y],i)=> _x==x && _y==y );
            const fill = range && range.some(([s,e])=> y>=s && y<=e);
            let image;
            if( fill ){
                image = images[index++];
                image = image? image.cloneNode(true) : createImg({});
            }else{
                image = createImg({}, ['empty']);
            }
            container.appendChild( image );
        }
    }
}

function buildShapeCoord(shape, range){
    // return [[0,2],[0,6],[1,1],[1,3],[1,5],[1,7],[2,0],[2,4],[2,8],[3,0],[3,8],[4,1],[4,7],[5,2],[5,6],[6,3],[6,5],[7,4]];
    return [
        [[2,2],[6,6]],
        [[1,3],[5,7]],
        [[0,8]],
        [[0,8]],
        [[1,7]],
        [[2,6]],
        [[3,5]],
        [[4,4]],
    ]
}

function handleStyleSelect(evt, type){
    if(!this.classList.contains('active')){
        this.parentNode.querySelectorAll('.active').forEach(ele=>ele.classList.remove('active'));
        this.classList.add('active');
    }

    window.location.hash = 'type='+this.dataset.type;

    document.querySelector('.container').classList.add( this.dataset.type );
    document.querySelector('.container').dataset.type = this.dataset.type;
}

function handleStyleSelect (evt){
    if(this.classList.contains('active')){
        return;
    }

    let oldType = this.parentNode.querySelector('.active').dataset.type;

    this.parentNode.querySelectorAll('.active').forEach(ele=>ele.classList.remove('active'));
    this.classList.add('active');

    window.location.hash = 'type='+this.dataset.type;

    if( oldType ){
        document.querySelector('.container').classList.remove( oldType );    
    }

    document.querySelector('.container').classList.add( this.dataset.type );
    document.querySelector('.container').dataset.type = this.dataset.type;

    layoutImages(this.dataset.type);
}

const type = getHashValues('type') || 'default';
window.onload = function(){

    document.querySelectorAll('.nav .style-list>.style').forEach(elem=>{
        elem.addEventListener('click', handleStyleSelect, true)
    })

    const btn = document.querySelector('.style[data-type="'+type+'"]');
    btn && handleStyleSelect.call(btn, null);
}

loadImages(items=>{
    items.forEach(item=>{
        document.querySelector('.container').appendChild(item);
        images.push(item);
    });
})