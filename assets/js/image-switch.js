const imageIndexUrl = '/data/images.json';
const loadCount = 12; // 每次加载数量
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
 * 选中图片
 * @param {*} item 
 * @returns 
 */
function selectImage(item){
    item.parentNode.querySelectorAll('.active').forEach(elem=>elem.classList.remove('active'));
    item.classList.add('active');
    // todo
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

function setBackground(item){
    const main = document.querySelector('main');
    let img = item.querySelector('img');
    main.style.background = `url(${img.src}) center center no-repeat`;
    main.style.backgroundSize = 'cover';
    // main.style.filter = 'blur(5px)';
}

function layoutImages(){
    const container = document.querySelector('.container');
    const selector = container.querySelector('.selector');
    const images = selector.querySelectorAll('.image-item');

    let itemSpace = document.querySelector('main').clientHeight-50; // 每张图片的宽高
    let itemAngle = 360/images.length; // 每张图片中心角度
    let parentSpace = itemSpace/Math.sin(Math.PI*itemAngle/360); // 转换成角度计算
    container.style.setProperty('--item-space', `${itemSpace}px`);
    container.style.setProperty('--item-angle', itemAngle);
    selector.style.width = `${parentSpace}px`;
    selector.style.height = `${parentSpace}px`;

    images.forEach((image,i)=>{
        image.style.transformOrigin = `center  ${(itemSpace+parentSpace)/2}px`;
        image.style.transform= `rotate(${i*itemAngle}deg)`;
    })

}

window.onload = function(){

    //  图片导航
    document.querySelectorAll('.selector .image-item').forEach(elem=>{
        const container = document.querySelector('.container');
        const nav = container.querySelector('.nav');
        let forward = 0; // 旋转方向

        elem.addEventListener('mousedown',function(evt){
            evt.preventDefault(); // 必须加上，不然不会触发moveup
            const initialX = evt.clientX, initialY = evt.clientY;// 初始位置
            this.onmousemove = debounce( function(evt){
                var xOffset = evt.clientX - initialX;
                var yOffset = evt.clientY - initialY;
                console.log('moving', [xOffset, yOffset]);
                forward = xOffset == 0?0: (xOffset>0?1:-1);

                let itemAngle = container.style.getPropertyValue('--item-angle');
                let angle = itemAngle * Math.min(xOffset/elem.clientWidth, 1);
                // nav.style.transform = `rotate(${angle}deg)`;
                // todo 移动部分
            },50 );

            this.onmouseup = function(evt){
                this.onmousemove = null;
                this.onmouseup = null;

                console.log('up', evt)
                let itemAngle = container.style.getPropertyValue('--item-angle');
                const rotate = Number(nav.style.getPropertyValue('--rotate') || 0) + itemAngle * forward;
                nav.style.setProperty('--rotate', rotate);
                nav.style.transform = `rotate(${rotate}deg)`;

                let selectedImg = findSelectedImg(this, forward);
                if( selectedImg ){
                    selectImage(selectedImg)
                    setBackground(selectedImg);
                }
            }
        });

    });

    function findSelectedImg(currImage ,type){
        if(type == -1){
            let next = currImage.nextElementSibling;
            if( !next ){
                next = currImage.parentNode.firstChild;
            }
            return next;
        }else if(type == 1){
            let prev = currImage.previousElementSibling;
            if( !prev ){
                prev = currImage.parentNode.lastChild;
            }
            return prev;
        }
    }
   
}

// init
loadImages(items=>{
    items.forEach(item=>{
        document.querySelector('.selector .nav').appendChild(item);
    });
    // 默认选择第一个
    if( !document.querySelector('.selector .nav .image-item.active') ){
        const first = document.querySelector('.selector .nav .image-item')
        selectImage(first);
        setBackground(first);
    }
    layoutImages();
})