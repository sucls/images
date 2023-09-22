// 节流
function throttle(fn, interval=50){
    let newest = 0;
    return function(){
        const now = Date.now();
        if( now - newest >= interval ){
            newest = now;
            let args = Array.prototype.slice.call(arguments,0);
            fn.apply(this, args);
        }
    }
}

// 防抖
function debounce(fn, delay=50){
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