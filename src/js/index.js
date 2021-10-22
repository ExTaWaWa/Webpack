import axios from 'axios';
import '../scss/index.scss';
//用 html-webpack-plugin 做 template之後就不用 import index.html
// import '../index.html';
// import Add from "./tool.js";
// import '@babel/polyfill';
// import axios from 'axios';
import $ from 'jquery';
// import '../img/[name].[ext]';
const jpg = 'messageImage_1621344803965.jpg';
require('../img/'+jpg);

let arr = [1, 2, 3];
arr.map(item => "a" + item);

axios.get('/VsWeb/api/GetLstDicCinema').then(res=>{
  console.log(res);
})

console.log(Add(6,6));
console.log($);
console.log(window.jQuery);