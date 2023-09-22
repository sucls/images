/**
 * 从远程下载图片
 */
const fs = require('fs');
const axios = require('axios');

const sourceUrl = 'https://www.liblibai.com/';
const token = '';

// axios.get(sourceUrl).then(res=>{
//     if(res.status == 200){
//         console.log( Object.keys(res) )
//         console.log( res.data )
//     }
    
// }).catch(err=>{
//     console.error(err)
// })

// 分类
const tagUrl = 'https://www.liblibai.com/api/www/public/tag/search';
const pageUlr = 'https://www.liblibai.com/api/www/model/search';

axios.post(tagUrl, {
    "tagType": 1,
    "page": 1,
    "pageSize": 30,
    "tagLabel": ""
  }).then(res=>{
    if(res.status == 200){
        console.log( Object.keys(res) )
        console.log( JSON.stringify(res.data) )
    }
}).catch(err=>{
    console.error(err)
})

axios.post(pageUlr, {
    keyword: "",
    limit: 30,
    models: [],
    page: 1,
    pageSize: 30,
    sort: 0,
    tagId: "",
    time: "",
    types: []
  }).then(res=>{
    if(res.status == 200){
        console.log( Object.keys(res) )
        console.log( JSON.stringify(res.data) )
    }
}).catch(err=>{
    console.error(err)
})

// console.log(  )