const fs = require('fs');

const mimeTypes = {
    js: 'text/javascript',
    json: 'application/json',
    pdf: 'application/pdf',
    html: 'text/html',
    txt: 'text/plain',
    md: 'text/plain',
    jpg: 'image/jpeg',
    png: 'image/png',
    css: 'text/css'
};

const contentType = path => {
    const ms = /\.([^\.]+)$/.exec(path);
    const ex = (ms && ms.length > 1) ? ms[1] : '...';
    return mimeTypes[ex] || 'application/octet-stream';
};

const dummyTrans = { targetResponse: function() {}, end: function() {} };

const proxy = tUrl => (req, res, trans) => {
    const path = /.*\/$/.test(tUrl) ? tUrl + 'index.html' : tUrl;
    const cType = contentType(path);
    trans = trans || dummyTrans;
    fs.readFile(path, function (err, data) {
        if (err) {
            if(err.code == 'ENOENT'){
                res.writeHead(404);
                res.end('Not Found');
                trans.targetResponse(404, {});
                trans.end();
            } else {
                res.writeHead(500);
                res.end('Server error: ' + err.code);
                trans.targetResponse(500, {});
                trans.end();
            }
        } else {
            res.writeHead(200, { 'Content-Type': cType });
            res.end(data);
            trans.targetResponse(202, {'Content-Type': cType});
            trans.end();
        }
    })
};

module.exports = proxy;
