const hProxy = require('./proxy');
const fProxy = require('./fileProxy');

const applyPatterns = (rxMatches, path) => rxMatches
    .slice(1)
    .reduce((p, fragment, idx) => p.replace(new RegExp('\\$' + (idx + 1), 'g'), () => fragment), path);

const extractPath = (originalPath, pathToRemove) => {
    if (originalPath.indexOf(pathToRemove) === 0) {
        const path = originalPath.substr(pathToRemove.length);
        return (path.indexOf('/') === 0 || path.length === 0) ? path : '/' + path;
    }
    return originalPath;
};

const joinPaths = (a, b) => {
    if (!b) return a;
    const x = a.substring(a.length - 1) === '/' ? a.substring(0, a.length - 1) : a;
    const y = b.indexOf('/') === 0 ? b.substr(1) : b;
    return x + '/' + y;
};

const newPath = (rxMatches, sourcePath, targetPath, resetPath) => {
    const withPatterns = applyPatterns(rxMatches, targetPath);
    const trail = resetPath ? '' : extractPath(sourcePath, rxMatches[0]);
    return joinPaths(withPatterns, trail);
};

const handler = (rxMatches, rule) => (req, res, trans) => {
    if (rule.redirect) {
        // Redirect calls
        const p = newPath(rxMatches, req.url, rule.redirect, rule.resetPath);
        trans.redirect(p);
        res.writeHead(302, {'Location': p });
        res.end();
        trans.end();
        return;
    }
    if (rule.isStatic) {
        const p = newPath(rxMatches, req.url, rule.target, rule.resetPath);
        trans.local(p);
        trans.targetStart({});
        fProxy(p)(req, res, trans);
        return;
    }
    const p = newPath(rxMatches, req.url, rule.target, rule.resetPath);
    rule.removeHeaders.forEach(h => { if (req.headers[h]) { delete req.headers[h]; } });
    rule.addHeaders.forEach(h => { req.headers[h.name] = h.value; });
    trans.proxy(p);
    trans.targetStart(req.headers);
    hProxy(p)(req, res, trans);
};

module.exports = handler;
