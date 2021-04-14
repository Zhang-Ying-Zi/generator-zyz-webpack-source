/****** test css image js ******/

import { log } from "./libs/index";
import ImgMan from "./assets/images/man.jpg";
import "./assets/styles/index.css";
import indexLess from "./assets/styles/indexLess.less";
import indexScss from "./assets/styles/indexScss.scss";
import "./ts";
import "./ReactIndex";

log("Hello Main");
log(ImgMan);
log("end of index");

function addElement(className) {
  // 创建一个新的 div 元素
  let newDiv = document.createElement("div");
  newDiv.className = className;
  // 给它一些内容
  let newContent = document.createTextNode("Hi there and greetings!");
  // 添加文本节点 到这个新的 div 元素
  newDiv.appendChild(newContent);

  // 将这个新的元素和它的文本添加到 DOM 中
  let currentDiv = document.getElementById("root");
  document.body.insertBefore(newDiv, currentDiv);
}

addElement(indexLess.testLessClassName);
addElement(indexScss.testScssClassName);
