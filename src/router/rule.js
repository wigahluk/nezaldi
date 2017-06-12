const requestHandler = require('./requestHandler');

function Rule (ruleDef) {
    const def = ruleDef || {};
    this.target = def.target;
    this.redirect = def.redirect;
    this.regex = new RegExp(def.path || '^$', 'i');
    this.resetPath = !!def.resetPath;
    this.accept = def.accept;
    this.isStatic = def.target ? !/^https?:\/\/[^\.]+\.|:.+/.test(ruleDef.target) : false;
    this.addHeaders = def.addHeaders || [];
    this.removeHeaders = def.removeHeaders || [];
}

Rule.prototype.targetUrl = function () { return this.redirect || this.target; };

Rule.prototype.isValid = function () { return !!this.targetUrl() && !!this.regex; };

Rule.prototype.match = function (request) {
    const match = this.regex.exec(request.url);
    if (match) {
        if (this.accept) {
            const accept = (request.headers.accept || '').toLowerCase().split(',');
            const isSameAccept = accept.indexOf(this.accept.toLowerCase()) >= 0;
            return isSameAccept ?  requestHandler(match, this, request) : undefined
        }
        return requestHandler(match, this, request);
    }
};

function extractPath(originalPath, match) {
    const path = originalPath.substr(match.length);
    return (path.indexOf('/') === 0 || path.length === 0) ? path : '/' + path;
}

module.exports = Rule;