/* global process */
// This file is our entry point for Node.js
var express = require('express');
var path = require('path');

var app = express();

var port =  4000;

// Any requests to localhost:3000/build is proxied
// to webpack-dev-server
app.all('/*', function (req, resp) {
    console.log('[DummyServer] Invoqued URL:', req.url);
    resp.writeHead(200, { 'Content-Type': 'application/json'});
    resp.end(JSON.stringify({'Hello': 'World'}));
});


// And run the server
app.listen(port, function () {
    console.log('[Dummy Server] Running at port %s', port);
});