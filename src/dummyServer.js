/* global process */
var express = require('express');
var app = express();
var port =  4000;

app.all('/*', function (req, resp) {
    console.log('[DummyServer] Invoked URL:', req.url);
    console.log('[DummyServer] Headers:', req.headers);
    resp.writeHead(200, { 'Content-Type': 'application/json'});
    resp.end(JSON.stringify({'Hello': 'World'}));
});

// Run the server
app.listen(port, () => {
    console.log('[Dummy Server] Running at port %s', port);
});