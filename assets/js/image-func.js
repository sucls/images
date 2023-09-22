const imageIndexUrl = '/data/images.json';
const loadCount = 25;
const loadTimes = 0;

function renderImgSrc(src){
    return `/${src}`;
}

function createImg({ src }){
    let div = document.createElement('div');
    div.classList.add('image-item');
    div.innerHTML= `<img src="${renderImgSrc(src)}" alt=""></div>`; //
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

function layoutImages(curve){
    const container = document.querySelector('.container');
    const images = document.querySelectorAll('.image-item');
    const cWidth = container.clientWidth - 200;
    const cHeight = container.clientHeight - 200;
    const [minX, maxX] = curve.xRange;
    const [minY, maxY] = curve.yRange;
    const cx = (minX + maxX) / 2;
    const cy = (minY + maxY) / 2;
    const scaleX = cWidth / (maxX - minX);
    const scaleY = cHeight / (maxY - minY);
    const step = (maxX - minX)/(images.length - 1);

    images.forEach((image, index)=>{
        const x = minX + index * step;
        const y = curve.getY(x);
        console.log( [x, y] )
        const vx = (x - cx) * scaleX;
        const vy = (y - cy) * scaleY;
        image.style.setProperty('--x', vx);
        image.style.setProperty('--y', vy);
    })
}

window.onload = function(){
    document.querySelectorAll('.nav .style-list>.style').forEach(elem=>{
        let styleList = elem.parentNode;
        elem.addEventListener('click', function(evt){
            console.log( evt )

            if(!this.classList.contains('active')){
                this.parentNode.querySelectorAll('.active').forEach(ele=>ele.classList.remove('active'));
                this.classList.add('active');
                // styleList.style.setProperty('--icon-top', '10px');
            }
        }, true)
    })
}

class Curve{
    constructor(fn, xRange, yRange){
        this.fn = fn;
        this.xRange = xRange;
        this.yRange = yRange;
    }

    getY(x){
        x = Math.max(this.xRange[0], x);
        x = Math.min(this.xRange[1], x);

        let y = this.fn(x);
        y = Math.max(this.yRange[0], y);
        y = Math.min(this.yRange[1], y)
        return y;
    }
}

loadImages(items=>{
    items.forEach(item=>{
        document.querySelector('.container').appendChild(item);
    })

    const curve = new Curve(x=>Math.sin(x), [0, 3*Math.PI], [-1, 1]);
    layoutImages(curve);
})