---
title: 了解Nest的实现原理
date: '2024-01-25'
draft: false
tags: ["nest"]
summary: 了解nest实现，模拟实现一个简易版本的nest框架
---

## 核心思想

- 控制反转(IOC)
- 依赖注入(DI)

## 实现方式

- 装饰器
- 元数据

## 一个入门的Nest应用

这里整合了一个基本Nest应用的主要代码。

```js
import 'reflect-metadata'
import { NestFactory } from '@nestjs/core';
import { Module, Controller, Get, Injectable } from '@nestjs/common'

// Service
@Injectable()
export class DemoService {
  greeting(): string{
    return 'hello world'
  }
}

// Controller
@Controller('/api')
class DemoController{
  constructor(private demoService: DemoService) {}

  @Get('/greeting')
  greeting(){
    return this.demoService.greeting()
  }
}

// Module
@Module({
  controllers: [DemoController],
  providers: [DemoService],
})
export class DemoModule {}

// Start
async function bootstrap() {
  const app = await NestFactory.create(DemoModule);
  await app.listen(3000);
}
bootstrap();
```

## 解剖实现

先让我们来一一分析一下上面的代码都用到了Nest所提供的什么功能

1. **Service：** `@Injectable`类装饰器，标明被装饰的类是一个可以被注入的Provider
2. **Controller：** `@Controller`类装饰器，标明被装饰的类是一个控制器且跟路径为其传参;`@Get`方法装饰器，标明被装饰的方法是Get接口，相对路径为其传参；
3. **Module：** `@Module`类装饰器，接收并将上述Controller和Provider连接起来
4. **Start**: 调用NestFactory.create方法，接收根模块构造一个项目实例，之后启动项目并监听3000端口

接下来让我们简易实现下各装饰器功能

### Injectable

```js
import { DEMO_INJECTABLE_TAG } from './common/const'

function Injectable() {
  // 返回类装饰器
  return (target: any) => {
    Reflect.defineMetadata(DEMO_INJECTABLE_TAG, true, target);
  };
}

export default Injectable;
```

### Controller

```js
import { DEMO_BASE_PATH } from './common/const'

function Controller(path: string){
  // 返回类装饰器
  return function(target: any){
    Reflect.defineMetadata(DEMO_BASE_PATH, path, target)
  }
}

export default Controller
```

### Get

```js
import {DEMO_PATH, DEMO_METHOD} from './common/const'

function Request(method: string){
  return function (path: string){
    // 返回方法装饰器
    return function(target: any, propertyKey: string){
      Reflect.defineMetadata(DEMO_METHOD, method, target, propertyKey)
      Reflect.defineMetadata(DEMO_PATH, path, target, propertyKey)
    }
  }
}

export const Get = Request('Get')
export const Post = Request('Post')
// ....
```

### Module

```js
function Module(metadata: Record<string, any>) {
  return (target: any) => {
      for (const property in metadata) {
        Reflect.defineMetadata(property, metadata[property], target);
      }
  };
}

export default Module
```

### 启动类Factory

```js
import {DEMO_BASE_PATH, DEMO_METHOD, DEMO_PATH, DEMO_INJECTABLE_TAG} from './common/const'
import express from 'express'

class DemoFactory {
  private app: Express
  private types: Record<string, any>

  constructor(){
    // 实例化Express
    this.app = express()
    // 缓存所有Provider，保证只被实例化一次
    this.types = {}
  }

  // 调用该方法以注册所需信息至Express实例并返回
  create(module: any): Express{
    // 获取Module中注册的Controllers
    const Controllers = Reflect.getMetadata('controllers', module)
    this.initControllers(Controllers)
    // 返回Express实例
    return this.app
  }

  // 初始化所有Controllers
  initControllers(Controllers: any[]): void{
    Controllers.forEach((Controller: any) => {
      // 获取constructor所需provider
      const paramtypes = Reflect.getMetadata('design:paramtypes', Controller)
      // 不考虑provider需要注入的情况
      const args = paramtypes.map((Type: any) => {
        // 若未被Injectable装饰则报错
        if(!Reflect.getMetadata(DEMO_INJECTABLE_TAG, Type)){
          throw new Error(`${Type.name} is not injectable!`)
        }
        // 返回缓存的type或新建type（只初始化一个Type实例）
        return this.types[Type.name] ?
          this.types[Type.name] :
          this.types[Type.name] = new Type()
      })
      const controller = new Controller(...args)
      // 获取该Controller根路径
      const basePath = Reflect.getMetadata(FAKE_BASE_PATH, Controller)
      // 初始化路由
      this.initRoute(controller, basePath)
    });
  }

  // 初始化一个controller实例上所有的监听方法
  initRoute(controller: any, basePath: string): void{
    // 获取Controller上的所有方法名
    const proto = Reflect.getPrototypeOf(controller) 
    if(!proto){
      return
    }
    const methodsNames = Object.getOwnPropertyNames(proto)
      .filter(item => item !== 'constructor' && typeof proto[item] === 'function')

    methodsNames.forEach(methodName => {
      const fn = proto[methodName]
      // 取出定义的 metadata
      const method = Reflect.getMetadata(FAKE_METHOD, controller, methodName)
      const path = Reflect.getMetadata(FAKE_PATH, controller, methodName)
      // 忽略未装饰方法
      if(!method || !path){
        return
      }
      // 构造并注册路由
      const route = {
        path: basePath + path,
        method: method.toLowerCase(),
        fn: fn.bind(controller)
      }
      this.registerRoute(route)
    })
  }
	
  // 将Http监听方法注册至Express实例之中
  registerRoute(route: {path: string, method: string, fn: Function}): void{
    const {path, method, fn} = route
    // Express实例上注册路由
    this.app[method](path, (req: any, res: any) => { 
      res.send(fn(req))
    })
  }
}

export default new DemoFactory()
```

## 最终实现

```js
import 'reflect-metadata'

// import { NestFactory } from '@nestjs/core';
// import { Module, Controller, Get, Injectable } from '@nestjs/common'
import { DemoFactory, Module, Controller, Get, Injectable } from './demo'

// Service
@Injectable()
export class DemoService {
  greeting(): string{
    return 'hello world'
  }
}

// Controller
@Controller('/api')
class DemoController{
  constructor(private demoService: DemoService) {}

  @Get('/greeting')
  greeting(){
    return this.demoService.greeting()
  }
}

// Module
@Module({
  controllers: [DemoController],
  providers: [DemoService],
})
export class DemoModule {}

// Start
async function bootstrap() {
  // const app = await NestFactory.create(DemoModule);
  const app = await DemoFactory.create(DemoModule);
  await app.listen(3000);
}

bootstrap();
```


