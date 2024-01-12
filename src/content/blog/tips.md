---
title: Javascript奇淫技巧
date: '2024-01-10'
draft: false
tags: ["javascript"]
summary: 有没有用你说的算！
---

## 生成随机ID

生成长度为11的随机字母数字字符串

`Math.random().toString(36).substring(2);`

## 获取指定长度的随机字符串

```js
(function (len) {
  var i;
  var e;
  var res = "";
  var str = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  for (i = 0; i < len; i++) {
    res += str.charAt(Math.floor(Math.random() * str.length));
  }
  alert(res);
})(10);
```

## 如何点击a标签，不做页面跳转

`href="javascript:void(0)"`

## 生成随机十六进制代码（生成随机颜色）

`'#' + Math.floor(Math.random() * 0xffffff).toString(16).padEnd(6, '0');`

## hasOwnProperty和in的区别

二者都是判断对象是否包含某属性。区别是hasOwnProperty只查找直接绑定在对象上的属性，而不会查找原型链上的属性；而in则都会去查找

## 使用`+`将字符串转换为数字

只适合字符串数据转换为数字，否则将返回NaN

- `console.log(+"1234"); // 1234`
- `console.log(+"ACB")); // NaN`

## 使用Object.prototype.toString.call进行数据类型判断

- `Object.prototype.toString.call(undefined) = "[object Undefined]"`
- `Object.prototype.toString.call(null) = "[object Null]"`
- `Object.prototype.toString.call(true) = "[object Boolean]"`
- `Object.prototype.toString.call(123) = "[object Number]"`
- `Object.prototype.toString.call("asd") = "[object String]"`
- `Object.prototype.toString.call({}) = "[object Object]"`
- `Object.prototype.toString.call([]) = "[object Array]"`

## 数组混淆

随机更改数组元素顺序，混淆数组

`(arr) => arr.slice().sort(() => Math.random() - 0.5)`

## 对数组洗牌

```js
function shuffle(arr) {
  var i, j, temp;
  for (i = arr.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
  return arr;
}

var a = [1, 2, 3, 4, 5, 6, 7, 8];
var b = shuffle(a);
console.log(b);
// [2, 7, 8, 6, 5, 3, 1, 4]
```

## 类数组转化为数组的方法

```js
// 1.扩展运算符
[...arrayLike];
// 2.Array.from
Array.from(arrayLike);
// 3.Array.prototype.slice
Array.prototype.slice.call(arrayLike);
// 4.Array.apply
Array.apply(null, arrayLike);
// 5.Array.prototype.concat
Array.prototype.concat.apply([], arrayLike);
```

## setTimeout模拟实现setInterval

思想：递归，闭包  
扩展：提供清除定时器的方法

```js
function mySettimeout(fn, t) {
  let timer = null;
  function interval() {
    fn();
    timer = setTimeout(interval, t);
  }
  interval();
  return {
    cancel: () => {
      clearTimeout(timer);
    },
  };
}
```

## 实现一个 compose 函数

```js
function compose(...fn) {
  if (!fn.length) return v => v;
  if (fn.length === 1) return fn[0];
  return fn.reduce(
    (pre, cur) =>
      (...args) =>
        pre(cur(...args))
  );
}

// 用法如下:
function fn1(x) {
  return x + 1;
}
function fn2(x) {
  return x + 2;
}
function fn3(x) {
  return x + 3;
}
function fn4(x) {
  return x + 4;
}
const a = compose(fn1, fn2, fn3, fn4);
console.log(a(1)); // 1+4+3+2+1=11
```

## 实现文本复制功能

```html
<script>
  function copyToClipboard(text) {
    let a = document.createElement("input");
    a.value = text;
    document.body.appendChild(a);
    a.select();
    try {
      document.execCommand("copy");
      alert("复制成功！");
    } catch (e) {
      alert("复制链接失败！");
    }
    a.remove();
  }
</script>

<p onclick="copyToClipboard('Hello World!')">复制</p>
```

## 扁平数据结构转Tree

1. 递归算法（时间复杂度O(2^n)）

```js
/**
 * 递归查找，获取children
 */
const getChildren = (data, result, pid) => {
  for (const item of data) {
    if (item.pid === pid) {
      const newItem = { ...item, children: [] };
      result.push(newItem);
      getChildren(data, newItem.children, item.id);
    }
  }
};

/**
 * 转换方法
 */
const arrayToTree = (data, pid) => {
  const result = [];
  getChildren(data, result, pid);
  return result;
};
```

2. 最优算法

```js
function arrayToTree(items) {
  const result = []; // 存放结果集
  const itemMap = {}; //
  for (const item of items) {
    const id = item.id;
    const pid = item.pid;

    if (!itemMap[id]) {
      itemMap[id] = {
        children: [],
      };
    }

    itemMap[id] = {
      ...item,
      children: itemMap[id]["children"],
    };

    const treeItem = itemMap[id];

    if (pid === 0) {
      result.push(treeItem);
    } else {
      if (!itemMap[pid]) {
        itemMap[pid] = {
          children: [],
        };
      }
      itemMap[pid].children.push(treeItem);
    }
  }
  return result;
}
```

## 二分查找

```js
// 704. 二分查找
/**
 * 
给定一个 n 个元素有序的（升序）整型数组 nums 和一个目标值 target  ，写一个函数搜索 nums 中的 target，如果目标值存在返回下标，否则返回 -1。


示例 1:

输入: nums = [-1,0,3,5,9,12], target = 9
输出: 4
解释: 9 出现在 nums 中并且下标为 4
示例 2:

输入: nums = [-1,0,3,5,9,12], target = 2
输出: -1
解释: 2 不存在 nums 中因此返回 -1
 

提示：

你可以假设 nums 中的所有元素是不重复的。
n 将在 [1, 10000]之间。
nums 的每个元素都将在 [-9999, 9999]之间。
 */

const search = (nums, target) => {
  let i = 0;
  let j = nums.length - 1;
  let midIndex = 0;

  while (i <= j) {
    midIndex = Math.floor((i + j) / 2);
    const midValue = nums[midIndex];

    if (midValue === target) {
      return midIndex;
    } else if (midValue < target) {
      i = midIndex + 1;
    } else {
      j = midIndex - 1;
    }
  }

  return -1;
};

console.log(search([-1, 0, 3, 5, 9, 12], 9)); // 4
```

## 插入排序

```js
// 插入排序
/**
 * 记住你是怎么打牌的就知道插入排序怎么实现了
 * 1. 首先有一个有序的序列，可以认为第一个元素就是已排序的序列
 * 2. 从未排序序列中取一个元素出来，往有序序列中找到合适的位置，如果该位置比元素大，则后移动, 否则继续往前找
 */

const insertSort = array => {
  for (let i = 1, length = array.length; i < length; i++) {
    let j = i - 1;
    const curValue = array[i];

    while (j >= 0 && array[j] > curValue) {
      array[j + 1] = array[j];
      j--;
    }

    array[j + 1] = curValue;
  }

  return array;
};

console.log(insertSort([-1, 10, 10, 2])); // [-1, 2, 10, 10]
```

## 选择排序

```js
/**
 * 1. 取出未排序的第一个元素，遍历该元素之后的部分并进行比较。第一次就是取第一个元素
 * 2. 如果有更小的就交换位置
 */

const swap = (array, a, b) => ([array[b], array[a]] = [array[a], array[b]]);
const selectSort = array => {
  const length = array.length;

  for (let i = 0; i < length; i++) {
    let minIndex = i;

    for (let j = i + 1; j < length; j++) {
      if (array[j] < array[minIndex]) {
        minIndex = j;
      }
    }

    if (minIndex !== i) {
      swap(array, i, minIndex);
    }
  }

  return array;
};

console.log(selectSort([-1, 10, 10, 2])); // [-1, 2, 10, 10]
```

## 冒泡排序

```js
/**
 * 1. 从第一个元素开始，比较相邻的两个元素，前者大就交换位置
 * 2. 每次遍历结束，都能找到一个最大值
 * 3. 如果还有没排序的元素继续1
 *
 */
const swap = (array, a, b) => ([array[b], array[a]] = [array[a], array[b]]);
const bubbleSort = array => {
  const length = array.length;
  for (let i = 0; i < length - 1; i++) {
    for (let j = 0; j < length - 1 - i; j++) {
      if (array[j] > array[j + 1]) {
        swap(array, j, j + 1);
      }
    }
  }

  return array;
};

console.log(bubbleSort([-1, 10, 10, 2])); //  [-1, 2, 10, 10]
```

## 快速排序

```js
const quickSort = array => {
  const length = array.length;

  if (length <= 1) {
    return array;
  }

  const midIndex = Math.floor(length / 2);
  const midValue = array.splice(midIndex, 1)[0];
  let leftArray = [];
  let rightArray = [];
  let index = 0;

  while (index < length - 1) {
    const curValue = array[index];

    if (curValue <= midValue) {
      leftArray.push(curValue);
    } else {
      rightArray.push(curValue);
    }

    index++;
  }

  return quickSort(leftArray).concat([midValue], quickSort(rightArray));
};

const arr = [-10, 10, 1, 34, 5, 1];

console.log(quickSort(arr)); // [-10, 1, 1, 5, 10, 34]
```

## 实现深拷贝

```js
const deepClone = (target, cache = new Map()) => {
  const isObject = obj => typeof obj === "object" && obj !== null;

  if (isObject(target)) {
    // 解决循环引用
    const cacheTarget = cache.get(target);
    // 已经存在直接返回，无需再次解析
    if (cacheTarget) {
      return cacheTarget;
    }

    let cloneTarget = Array.isArray(target) ? [] : {};

    cache.set(target, cloneTarget);

    for (const key in target) {
      if (target.hasOwnProperty(key)) {
        const value = target[key];
        cloneTarget[key] = isObject(value) ? deepClone(value, cache) : value;
      }
    }

    return cloneTarget;
  } else {
    return target;
  }
};

const target = {
  field1: 1,
  field2: undefined,
  field3: {
    child: "child",
  },
  field4: [2, 4, 8],
  f: {
    f: { f: { f: { f: { f: { f: { f: { f: { f: { f: { f: {} } } } } } } } } } },
  },
};

target.target = target;

const result1 = deepClone(target);
console.log(result1);
```

## 实现new操作符

**思路:** 在实现new之前，我们先了解一下new的执行过程

1. 创建一个空的简单JavaScript对象（即 {} ）；
2. 为步骤1新创建的对象添加属性 proto ，将该属性链接至构造函数的原型对象
3. 将步骤1新创建的对象作为this的上下文,执行该函数 ；
4. 如果该函数没有返回对象，则返回this

```js
const _new = function (func, ...args) {
  // 步骤1和步骤2
  let obj = Object.create(func.prototype);
  // 也可以通过下面的代码进行模拟
  /**
  let Ctor = function () {}

  Ctor.prototype = func.prototype
  Ctor.prototype.constructor = func

  let obj = new Ctor()
 */
  // 步骤3
  let result = func.apply(obj, args);
  // 步骤4
  if (
    (typeof result === "object" && result !== null) ||
    typeof result === "function"
  ) {
    return result;
  } else {
    return obj;
  }
};

// 测试
let Person = function (name, sex) {
  this.name = name;
  this.sex = sex;
};

Person.prototype.showInfo = function () {
  console.log(this.name, this.sex);
};

let p1 = _new(Person, "qianlongo", "sex");

console.log(p1);

// Person { name: '前端胖头鱼', sex: 'sex' }
```

##
