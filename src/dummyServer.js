/* global process */
const http = require('http');
var port =  4000;

const server = http.createServer((req, resp) => {
    console.log('[DummyServer] Invoked URL:', req.url);
    console.log('[DummyServer] Headers:', req.headers);
    resp.writeHead(200, { 'Content-Type': 'application/json'});
    resp.end(JSON.stringify({'Hello': 'World'}));
});

// Run the server
server.listen(port, () => {
    console.log('[Dummy Server] Running at port %s', port);
});