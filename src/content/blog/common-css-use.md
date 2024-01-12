---
title: 常用css方案
date: '2024-01-10'
draft: false
tags: ["css"]
summary: 常用css方案
---

## css一行文本超出显示...

```css
overflow: hidden;
text-overflow: ellipsis;
white-space: nowrap;
```

## 多行文本超出显示...

```css
display: -webkit-box;
-webkit-box-orient: vertical;
-webkit-line-clamp: 3;
overflow: hidden;
```

## 使用css写出一个三角形角标

```css
div {
  width: 0;
  height: 0;
  border: 5px solid transparent;
  border-top-color: red;
}
```

## 水平垂直居中

```css
div {
  width: 100px;
  height: 100px;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
}

// 父级控制子集居中
.parent {
  display: flex;
  justify-content: center;
  align-items: center;
}
```

## 隐藏div元素的滚动条

```css
div::-webkit-scrollbar {
  display: none;
}
```

## 修改滚动条样式

```css
::-webkit-scrollbar — 整个滚动条
::-webkit-scrollbar-button — 滚动条上的按钮 (上下箭头)
::-webkit-scrollbar-thumb — 滚动条上的滚动滑块
::-webkit-scrollbar-track — 滚动条轨道
::-webkit-scrollbar-track-piece — 滚动条没有滑块的轨道部分
::-webkit-scrollbar-corner — 当同时有垂直滚动条和水平滚动条时交汇的部分
::-webkit-resizer — 某些元素的corner部分的部分样式(例:textarea的可拖动按钮)
```

**example:**

```css
/* 整个滚动条 */
::-webkit-scrollbar {
  /* 对应纵向滚动条的宽度 */
  width: 10px;
  /* 对应横向滚动条的宽度 */
  height: 10px;
}

/* 滚动条上的滚动滑块 */
::-webkit-scrollbar-thumb {
  background-color: #49b1f5;
  border-radius: 32px;
}

/* 滚动条轨道 */
::-webkit-scrollbar-track {
  background-color: #dbeffd;
  border-radius: 32px;
}
```
