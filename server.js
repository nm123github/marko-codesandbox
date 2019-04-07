
var finalhandler = require('finalhandler')
var http = require('http')
var serveStatic = require('serve-static')

var serve = serveStatic(__dirname + "/dist");

var server = http.createServer(function onRequest (req, res) {
  serve(req, res, finalhandler(req, res))
})

server.listen(process.env.PORT || 8080)
