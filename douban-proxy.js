'use strict'

let http = require('http'),
    path = require('path'),
    url = require('url'),
    fs = require('fs'),
    httpProxy = require('http-proxy')

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

  let hostname = url.parse(req.url).hostname,
      pathname = url.parse(req.url).pathname,
      localPath = `.dist${pathname}`;

  let serverPromise = new Promise((resolve,reject)=>{
    if (hostname === 'api.douban.com'){
      resolve();
    }else {
      reject();
    }
  }).then(() => {
    fs.stat(localPath, (err, stats)=>{
      if(!err){
        return stats;
      }else {
        throw err;
      }
    });
  }).catch((err) => {
    proxy.web(req, res, { target: req.url });
  }).then((stats)=>{
    fs.stat(localPath, function(err, file){
    if(err) throw err;
    return file;
    });
  }).then((file)=>{
    let ext = path.extname(localPath);
    ext = ext ? ext.slice(1) : 'unknown';
    let contentType = mimeTypes[ext] || "text/plain";
    res.writeHead(200, {'Content-Type': contentType});
    res.write(file);
    res.end();
    }
  ).catch((err)=>{
    res.writeHead(500, {'Content-Type': 'text/plain'});
    res.end(err);
  });
  
}).listen(3399, function(err){
    if(err) throw err;
    console.log("在端口 3399 监听浏览器请求");
}
