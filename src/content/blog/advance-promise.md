---
title: 实现有并行限制的Promise
date: '2024-01-10'
draft: false
tags: ["javascript"]
summary: 利用promise特性实现有限制的并行异步任务
---

## 场景描述

```js
// JS实现一个带并发限制的异步调度器Scheduler，保证同时运行的任务最多有两个。
// 完善下面代码的Scheduler类，使以下程序能够正常输出：
class Scheduler {
  add(promiseCreator) { ... }
  // ...
}

const timeout = time => {
  return new Promise(resolve => {
    setTimeout(resolve, time)
  }
})

const scheduler = new Scheduler()

const addTask = (time,order) => {
  scheduler.add(() => timeout(time).then(()=>console.log(order)))
}

addTask(1000, '1')
addTask(500, '2')
addTask(300, '3')
addTask(400, '4')

// output: 2 3 1 4
整个的完整执行流程：

起始1、2两个任务开始执行
500ms时，2任务执行完毕，输出2，任务3开始执行
800ms时，3任务执行完毕，输出3，任务4开始执行
1000ms时，1任务执行完毕，输出1，此时只剩下4任务在执行
1200ms时，4任务执行完毕，输出4
```

## 解析

看完题目之后，大概会这几个问题存在

1. 如何才能保证同时只有2个任务在处于执行中？
2. 当某个任务执行结束之后，下一步如何知道应该执行哪个任务？

**问题1:** 只需要用一个计数器来控制即可，每开始一个任务计数器+1，结束之后计数器-1，保证计数器一定<=2。  
**问题2:** 按照题目要求，任务的执行是有顺序的，只是任务的结束时间是不确定的，所以下一个任务一定是按照这样的顺序来  
`任务1 => 任务2 => 任务3 => 任务4`  
利用数组队列的性质，将任务挨个推入队列，前面的任务执行结束之后，将队首的任务取出来执行即可。

```js
class Scheduler {
  constructor() {
    this.queue = [];
    this.maxCount = 2;
    this.runCount = 0;
  }
  // promiseCreator执行后返回的是一个Promise
  add(promiseCreator) {
    // 小于等于2，直接执行
    this.queue.push(promiseCreator);
    // 每次添加的时候都会尝试去执行任务
    this.runQueue();
  }

  runQueue() {
    // 队列中还有任务才会被执行
    if (this.queue.length && this.runCount < this.maxCount) {
      // 执行先加入队列的函数
      const promiseCreator = this.queue.shift();
      // 开始执行任务 计数+1
      this.runCount += 1;
      // 假设任务都执行成功，当然也可以做一下catch
      promiseCreator().then(() => {
        // 任务执行完毕，计数-1
        this.runCount -= 1;
        // 尝试进行下一次任务
        this.runQueue();
      });
    }
  }
}

const timeout = time => {
  return new Promise(resolve => {
    setTimeout(resolve, time);
  });
};

const scheduler = new Scheduler();

const addTask = (time, order) => {
  scheduler.add(() => timeout(time).then(() => console.log(order)));
};

addTask(1000, "1");
addTask(500, "2");
addTask(300, "3");
addTask(400, "4");

// 2
// 3
// 1
// 4
```
