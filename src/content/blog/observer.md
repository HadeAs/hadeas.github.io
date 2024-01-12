---
title: 设计模式系列之观察者模式
date: '2024-01-10'
draft: false
tags: ["javascript"]
summary: 如何实现观察者模式
---

## 代码实现

```js
class Subject {
  constructor() {
    this.observers = [];
  }

  addObserver(observer) {
    this.observers.push(observer);
  }

  removeObserver(observer) {
    this.observers = this.observers.filter(obs => obs !== observer);
  }

  notify(data) {
    this.observers.forEach(observer => {
      observer.update(data);
    });
  }
}

class Observer {
  update(data) {
    console.log(`Received data: ${data}`);
  }
}
```

## 使用方式

```js
const subject = new Subject();
const observer1 = new Observer();
const observer2 = new Observer();

subject.addObserver(observer1);
subject.addObserver(observer2);
subject.notify("Hello World!");
subject.removeObserver(observer1);
subject.notify("Goodbye World!");
```

## 使用场景

1. 异步事件处理：在事件发生时通知多个观察者，以便处理该事件。
2. 消息通知：在消息发布时通知多个订阅者，以便他们可以接收该消息。
3. 数据更新：当数据发生更改时，通知多个观察者以便他们可以更新数据。
4. 日志系统：在事件发生时通知多个日志记录器，以便它们可以将事件记录到日志中。
5. 跨组件通信：在不同组件之间进行通信，而不是通过耦合来进行通信。

观察者模式是一种常见的设计模式，因为它提供了一种松散耦合的方法来处理复杂的交互。它还提供了一种可扩展性和灵活性高的方法来处理多个观察者。
