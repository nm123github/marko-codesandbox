

// const express = require('express')
// // import express from 'express'
// // import index from './src/components/index.marko'
// // import markoExpress from 'marko/express';
// const app = express()

// app.use(express.static(__dirname + "/dist"));

// // app.use(markoExpress());

// // app.get('/', (req, res) => {
// //   // console.log('hello')
// //   // res.statusCode = 200;
// //   // res.setHeader('Content-Type', 'text/plain');
// //   // res.end('Hello, World!\n');

// //   // index.render({}, res)
// // });

// app.listen(process.env.PORT || 8080);

// const server = http.createServer((req, res) => {
//   res.sendfile('dist/index.html');
// });

// server.listen(process.env.PORT || 8080);

var finalhandler = require('finalhandler')
var http = require('http')
var serveStatic = require('serve-static')

// Serve up public/ftp folder
var serve = serveStatic(__dirname + "/dist");

// Create server
var server = http.createServer(function onRequest (req, res) {
  serve(req, res, finalhandler(req, res))
})

// Listen
server.listen(process.env.PORT || 8080)
