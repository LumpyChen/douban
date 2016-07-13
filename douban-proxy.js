'use strict'

let http = require('http'),
    path = require('path'),
    url = require('url'),
    fs = require('fs'),
    httpProxy = require('http-proxy')

// MIME 类型映射表
let mimeTypes = {
  "css": "text/css",
  "gif": "image/gif",
  "html": "text/html",
  "ico": "image/x-icon",
  "jpeg": "image/jpeg",
  "jpg": "image/jpeg",
  "js": "text/javascript",
  "json": "application/json",
  "pdf": "application/pdf",
  "png": "image/png",
  "svg": "image/svg+xml",
  "swf": "application/x-shockwave-flash",
  "tiff": "image/tiff",
  "txt": "text/plain",
  "wav": "audio/x-wav",
  "wma": "audio/x-ms-wma",
  "wmv": "video/x-ms-wmv",
  "xml": "text/xml"
};

// 创建代理服务器
let proxy = httpProxy.createProxyServer({})

// 创建 http 服务器
let server = http.createServer(function(req, res) {
  // 获取域名，方便判断是否代理文件
  let hostname = url.parse(req.url).hostname
  if (hostname === 'api.douban.com'){
    // 获取文件路径
    let pathname = url.parse(req.url).pathname,
        localPath = './dist' + pathname
    // 判断文件是否存在
    fs.stat(localPath, function(err, stats) {
      if (!err) {
        // 读取文件
        fs.readFile(localPath, function(err, file) {
          if (!err) {
            // 读取成功，返回本地文件
            let ext = path.extname(localPath);
            ext = ext ? ext.slice(1) : 'unknown';
            let contentType = mimeTypes[ext] || "text/plain";

            res.writeHead(200, {'Content-Type': contentType});
            res.write(file);
            res.end();
          } else {
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.end(err);
          }
        })
      } else {
        // 直接返回
        proxy.web(req, res, { target: req.url });
      }
    })
  } else {
    // 直接返回
    proxy.web(req, res, { target: req.url });
  }
}).listen(3399, function(){
  console.log('在端口 3399 监听浏览器请求');
});
