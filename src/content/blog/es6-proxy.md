---
title: ES6特性之proxy使用场景
date: '2024-01-10'
draft: false
tags: ["javascript"]
summary: proxy使用场景
---

## get() 拦截实际应用

函数链式调用

```js
var pipe = (function () {
  return function (value) {
    var funcStack = [];
    var oproxy = new Proxy(
      {},
      {
        get: function (pipeObject, fnName) {
          if (fnName === "get") {
            return funcStack.reduce(function (val, fn) {
              return fn(val);
            }, value);
          }
          funcStack.push(window[fnName]);
          return oproxy;
        },
      }
    );

    return oproxy;
  };
})();

var double = n => n * 2;
var pow = n => n * n;
var reverseInt = n => n.toString().split("").reverse().join("") | 0;

pipe(3).double.pow.reverseInt.get; // 63
```

## set()拦截实际应用

防止对象内部属性被外部读写。

```js
const handler = {
  get(target, key) {
    invariant(key, "get");
    return target[key];
  },
  set(target, key, value) {
    invariant(key, "set");
    target[key] = value;
    return true;
  },
};
function invariant(key, action) {
  if (key[0] === "_") {
    throw new Error(`Invalid attempt to ${action} private "${key}" property`);
  }
}
const target = {};
const proxy = new Proxy(target, handler);
proxy._prop;
// Error: Invalid attempt to get private "_prop" property
proxy._prop = "c";
// Error: Invalid attempt to set private "_prop" property
```

## Proxy.revocable()

该方法返回一个可取消的 Proxy 实例。它的一个使用场景是，目标对象不允许直接访问，必须通过代理访问，一旦访问结束，就收回代理权，不允许再次访问。

```js
let target = {};
let handler = {};

let { proxy, revoke } = Proxy.revocable(target, handler);

proxy.foo = 123;
proxy.foo; // 123

revoke();
proxy.foo; // TypeError: Revoked
```
