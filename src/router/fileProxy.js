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
    svg: 'image/svg+xml',
    css: 'text/css'
};

const contentType = path => {
    const ms = /\.([^\.]+)$/.exec(path);
    const ex = (ms && ms.length > 1) ? ms[1] : '...';
    return mimeTypes[ex] || 'application/octet-stream';
};

const dummyTrans = { targetResponse: function() {}, end: function() {} };

const notFound = (res, trans) => {
    res.writeHead(404);
    res.end('Not Found');
    trans.targetResponse(404, {});
    trans.end();
};

const proxy = tUrl => (req, res, trans) => {
    const path = /.*\/$/.test(tUrl) ? tUrl + 'index.html' : tUrl;
    const cType = contentType(path) || 'application/octet-stream';
    trans = trans || dummyTrans;
    // Prevent dotdot paths. I don't have a useful use case for them so they will always return 404
    if (/\.\.\//.test(path)) { notFound(res, trans); }

    fs.readFile(path, function (err, data) {
        if (err) {
            if(err.code == 'ENOENT'){
                notFound(res, trans);
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
