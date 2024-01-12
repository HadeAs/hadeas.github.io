---
title: 去抖简化版
date: '2024-01-10'
draft: false
tags: ["javascript"]
summary: 简单的去抖实现
---

> 对于高频发生的事件，我们给事件的回调函数设置间隔时间。在间隔时间内如果事件再次被触发，则重新计时；在间隔时间内事件如果未被触发，则执行事件的回调函数。

## 普通版

```js
function debounce(fn, interval) {
  //fn为要执行的函数
  //interval为等待的时间
  var timeout; //定时器
  return function () {
    //返回一个闭包
    var context = this,
      args = arguments; //先把变量缓存

    clearTimeout(timeout); //核心实现：不管什么情况，先清除定时器

    timeout = setTimeout(function () {
      timeout = null;
      fn.apply(context, args);
    }, interval); //延迟执行
  };
}

//使用
var myEfficientFn = debounce(function () {
  //你要做的事
}, 250);

window.addEventListener("resize", myEfficientFn);
```

## 立即执行版

```js
function debounce(fn, interval, immediate) {
  //fn为要执行的函数
  //interval为等待的时间
  //immediate判断是否立即执行
  var timeout; //定时器

  return function () {
    //返回一个闭包
    var context = this,
      args = arguments; //先把变量缓存
    var later = function () {
      //把稍后要执行的代码封装起来
      timeout = null; //成功调用后清除定时器
      if (!immediate) fn.apply(context, args); //不立即执行时才可以调用
    };

    var callNow = immediate && !timeout; //判断是否立即调用，并且如果定时器存在，则不立即调用
    clearTimeout(timeout); //不管什么情况，先清除定时器，这是最稳妥的
    timeout = setTimeout(later, interval); //延迟执行
    if (callNow) fn.apply(context, args); //如果是第一次触发，并且immediate为true，则立即执行
  };
}

//使用
var myEfficientFn = debounce(
  function () {
    //你要做的事
  },
  250,
  true
);

window.addEventListener("resize", myEfficientFn);
```
