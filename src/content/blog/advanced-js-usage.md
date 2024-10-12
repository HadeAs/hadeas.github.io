---
title: 你可能需要了解的JS高级用法
date: '2024-10-12'
draft: false
tags: ["javascript"]
summary: 中高级前端开发的必备技能
---

## 1. 变量交换

```js
let a = 1, b = 2;

// 交换值
[a, b] = [b, a];

// 结果: a = 2, b = 1
```

## 2. 数组false值过滤

```js
const arr = [ 0, 1, false, 2, '', 3 ];

const cleanedArray = arr.filter(Boolean);

// 结果: cleanedArray = [1, 2, 3]
```

## 3. 文本复制到剪贴板

```js
navigator.clipboard.writeText('Text to copy'); // 可能有浏览器兼容性问题
```

## 4. 删除数组重复项

```js
const arr = [1, 2, 2, 3, 4, 4, 5];

const unique = [...new Set(arr)];

// 结果: unique = [1, 2, 3, 4, 5]
```

## 5. 数组交集

```js
const arr1 = [1, 2, 3, 4];
const arr2 = [2, 4, 6, 8];

// 取两个数组中公共的元素
const intersection = arr1.filter(value => arr2.includes(value));

// 结果: intersection = [2, 4]
```

## 6. 数组元素的总和

```js
const arr = [1, 2, 3, 4];

// 求总和
const sum = arr.reduce((total, value) => total + value, 0);

// 结果: sum = 10

const arrayOfObjects = [{x: 1}, {x: 2}, {x: 3}];

// 指定要求和的 key值
const sumBy = (arr, key) => arr.reduce((acc, obj) => acc + obj[key], 0);

// 传入 'x'，求元素对象 key 为 'x' 的值的总和
sumBy(arrayOfObjects, 'x'));

// 结果: 6
```

## 7. 根据指定条件判断，是否给对象的属性赋值

```js
const condition = true;
const value = '你好，世界';

// 如果条件为真，则将 value 变量的值赋给 newObject.key 属性
const newObject = {...(condition && {key: value})};

// 结果: newObject = { key: '你好，世界' }
```

## 8. 网页离线检查

```js
const isOnline = navigator.onLine ? '在线' : '离线';

// 结果: isOnline = '在线' 或 '离线'
```

## 9. 离开页面弹出确认对话框

```js
window.onbeforeunload = () => '你确定要离开吗？';
```

## 10. 将 url 问号后面的查询字符串转为对象

```js
const query = 'name=John&age=30';

// 将字符串解析为对象
const parseQuery = query => Object.fromEntries(new URLSearchParams(query));

// 结果: parseQuery = { name: 'John', age: '30' }
```

## 11. 切换元素的 class

```js
const element = document.querySelector('.my-element');

const toggleClass = (el, className) => el.classList.toggle(className);

toggleClass(element, 'active');
```