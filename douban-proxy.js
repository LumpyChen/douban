'use strict'

let http = require('http'),
    path = require('path'),
    url = require('url'),
    fs = require('fs'),
    httpProxy = require('http-proxy')

let proxy = httpProxy.createProxyServer({})

let server = http.createServer(function(req, res) {
  let hostname = url.parse(req.url).hostname,
      pathname = url.parse(req.url).pathname
  if (hostname === 'api.douban.com'){
    let localPath = './dist' + pathname
    fs.stat(localPath, function(err, stats) {
      if (!err) {
        fs.readFile(localPath, function(err, file) {
          if (!err) {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(file);
            res.end();
          } else {
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.end(err);
          }
        })
      } else {
        res.write(pathname)
        res.end()
      }
    })
  } else {
    // 直接返回
    proxy.web(req, res, { target: req.url });
  }
}).listen(3399, function(){
  console.log("在端口 3399 监听浏览器请求");
});
