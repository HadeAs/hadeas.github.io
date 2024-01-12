---
title: SSE
date: '2024-01-10'
draft: false
tags: ['server-side']
summary: '基于HTTP协议的服务端向客户端推送数据的技术'
---

Server-Sent Events简称SSE，是一个基于HTTP协议的服务端向客户端推送数据的技术。

![sse](/static/images/sse.png)

在上图中，客户端向服务端发起一个持久化的HTTP连接，服务端接收到请求后，会挂起客户端的请求，有新消息时，再通过这个连接将数据推送给客户端。这里需要指出的是和WebSocket长连接不同，SSE的连接是单向的，也就是说它不允许客户端向服务端发送消息。

## 服务端代码

```js
const http = require('http');
const fs = require('fs');

http.createServer((req, res) => {
  if (req.url === '/') {
    // 如果请求根路径，返回 index.html 文件
    fs.readFile('index.html', (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end('Error loading index.html');
      } else {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(data);
      }
    });·
  } else if (req.url === '/events') {
    // 如果请求 /events 路径，建立 SSE 连接
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    });

    // 每隔 1 秒发送一条消息
    let id = 0;
    const intervalId = setInterval(() => {
      res.write(`event: customEvent\n`)
      res.write(`id: ${id}\n`)
      res.write(`retry: 30000\n`)
      const data = { id, time: new Date().toISOString() }
      res.write(`data: ${JSON.stringify(data)}\n\n`);
      id++
    }, 1000);

    // 当客户端关闭连接时停止发送消息
    req.on('close', () => {
      clearInterval(intervalId);
      id = 0
      res.end();
    });
  } else {
    // 如果请求的路径无效，返回 404 状态码
    res.writeHead(404);
    res.end();
  }
}).listen(3000);

console.log('Server listening on port 3000');
```

## 客户端代码

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>SSE Demo</title>
  </head>
  <body>
    <h1>SSE Demo</h1>
    <button onclick="connectSSE()">建立 SSE 连接</button>
    <button onclick="closeSSE()">断开 SSE 连接</button>
    <br />
    <br />
    <div id="message"></div>

    <script>
      const messageElement = document.getElementById("message");

      let eventSource;

      // 建立 SSE 连接
      const connectSSE = () => {
        eventSource = new EventSource("/events");

        // 监听消息事件
        eventSource.addEventListener("customEvent", event => {
          const data = JSON.parse(event.data);
          messageElement.innerHTML += `${data.id} --- ${data.time}` + "<br />";
        });

        eventSource.onopen = () => {
          messageElement.innerHTML += `SSE 连接成功，状态${eventSource.readyState}<br />`;
        };

        eventSource.onerror = () => {
          messageElement.innerHTML += `SSE 连接错误，状态${eventSource.readyState}<br />`;
        };
      };

      // 断开 SSE 连接
      const closeSSE = () => {
        eventSource.close();
        messageElement.innerHTML += `SSE 连接关闭，状态${eventSource.readyState}<br />`;
      };
    </script>
  </body>
</html>
```