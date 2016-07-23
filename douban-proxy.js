'use strict'

const http = require('http');
const path = require('path');
const url = require('url');
const querystring = require('querystring');
const fs = require('fs');
const httpProxy = require('http-proxy');

const mimeTypes = {
  css: 'text/css',
  gif: 'image/gif',
  html: 'text/html',
  ico: 'image/x-icon',
  jpeg: 'image/jpeg',
  jpg: 'image/jpeg',
  js: 'text/javascript',
  json: 'application/json',
  pdf: 'application/pdf',
  png: 'image/png',
  svg: 'image/svg+xml',
  swf: 'application/x-shockwave-flash',
  tiff: 'image/tiff',
  txt: 'text/plain',
  wav: 'audio/x-wav',
  wma: 'audio/x-ms-wma',
  wmv: 'video/x-ms-wmv',
  xml: 'text/xml',
};

const proxy = httpProxy.createProxyServer({});

http.createServer((req, res) => {
  const hostname = url.parse(req.url).hostname;
  const pathname = url.parse(req.url).pathname;
  const localPath = `./dist${pathname}`;
  const query = querystring.parse(url.parse(req.url).query).name;

  new Promise((resolve, reject) => {
    console.log('访问了:', req.url);

    if (hostname === 'api.douban.com' && query) {
      console.log('search books');
      proxy.web(req, res, { target: `http://api.douban.com/v2/book/search?count=5&q=${query}` }, (e) => {
        if (e) reject(e);
      });
    } else {
      resolve()
    }
  }).then(
    () => fs.statSync(localPath)
  ).catch(() => {
    proxy.web(req, res, { target: req.url }, () => {
    })
  })
  .then(() => fs.readFileSync(localPath))
  .then((file) => {
    let ext = path.extname(localPath);
    ext = ext ? ext.slice(1) : 'unknown';
    const contentType = mimeTypes[ext] || 'text/plain';
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(file);
  })
  .catch((err) => {
    console.error(err);
  })
}).listen(3399, (err) => {
  if (err) throw err;
  console.log('在端口 3399 监听浏览器请求');
})
