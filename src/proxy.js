const http = require('http');
const https = require('https');
const url = require('url');

const httpRequest = protocol => (protocol === 'https:' ? https : http).request;

const proxy = tUrl => (req, res, trans) => {
    const pUrl = url.parse(tUrl);
    const opts = {
        hostname: pUrl.hostname,
        port: pUrl.port || (pUrl.protocol === 'https:' ? 443 : 80),
        path: pUrl.path,
        method: req.method,
        headers: req.headers
    };
    const proxyRequest = httpRequest(pUrl.protocol)(opts, proxyResponse => {
        if(trans) {
            trans.targetResponse(proxyResponse.statusCode, proxyResponse.headers);
        }
        proxyResponse.on('data', chunk => { res.write(chunk, 'binary'); });
        proxyResponse.on('end', () => { res.end(); trans.end(); });
        proxyResponse.on('error', er => {
            res.end();
            trans.end();
        });
        res.writeHead(proxyResponse.statusCode, proxyResponse.headers);
    });
    proxyRequest.on('error', er => {
        if(trans) {
            trans.targetResponse(502, {});
        }
        res.writeHead(502, {'content-type': 'application/json'});
        res.end(JSON.stringify({ message: er.message }));
        trans.end();
    });
    req.on('data', chunk => { proxyRequest.write(chunk, 'binary'); });
    req.on('end', () => { proxyRequest.end(); });
};

module.exports = proxy;
