---
title: 节流简化版
date: '2024-01-10'
draft: false
tags: ["javascript"]
summary: 简单的节流实现
---

> 对于高频发生的事件，我们给事件的回调函数设置间隔时间。在间隔时间内事件的回调函数只会被执行一次。

## 普通版

```js
var throttle = function(fn, interval) { //fn为要执行的函数，interval为延迟时间
  var _self = fn,  //保存需要被延迟执行的函数引用
      timer,  //定时器

  return function() { //返回一个函数，形成闭包，持久化变量
    var args = arguments, //缓存变量
        _me = this;

    if(timer) { //核心实现：如果定时器还在，说明上一次延迟执行还没有完成
      return false;
    }

    timer = setTimeout(function() { //延迟一段时间执行
      clearTimeout(timer);
      timer = null;
      _self.apply(_me, args);
    }, interval || 500);
  };
};

//使用
window.onresize = throttle(function() {
  //你要执行的代码
}, 500);
```

## 扩展版

```js
var throttle = function (fn, interval) {
  //fn为要执行的函数，interval为延迟时间
  var _self = fn, //保存需要被延迟执行的函数引用
    timer, //定时器
    firstTime = true; //是否第一次调用

  return function () {
    //返回一个函数，形成闭包，持久化变量
    var args = arguments, //缓存变量
      _me = this;

    if (firstTime) {
      //如果是第一次调用，不用延迟执行
      _self.apply(_me, args);
      return (firstTime = false);
    }

    if (timer) {
      //如果定时器还在，说明上一次延迟执行还没有完成
      return false;
    }

    timer = setTimeout(function () {
      //延迟一段时间执行
      clearTimeout(timer);
      timer = null;
      _self.apply(_me, args);
    }, interval || 500);
  };
};

//使用
window.onresize = throttle(function () {
  //你要执行的代码
}, 500);
```
