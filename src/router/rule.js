/* global module */
'use strict';

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
            const accept = request.headers.accept.toLowerCase().split(',');
            const isSameAccept = accept.indexOf(this.accept.toLowerCase()) >= 0;
            return isSameAccept ?  new RequestHandler(match, this, request) : undefined
        }
        return new RequestHandler(match, this, request);
    }
};

function extractPath(originalPath, match) {
    const path = originalPath.substr(match.length);
    return (path.indexOf('/') === 0 || path.length === 0) ? path : '/' + path;
}

function RequestHandler (rxMatch, rule, request) {
    this.isRedirect = !!rule.redirect;
    this.isStatic = rule.isStatic;

    this.target = rxMatch
        .slice(1)
        .reduce(
            (path, fragment, idx) => path.replace('$' + (idx + 1), fragment),
            rule.targetUrl()
        );
    this.path = rule.resetPath ? '' : extractPath(request.url, rxMatch[0]);
    this.addHeaders = rule.addHeaders;
    this.removeHeaders = rule.removeHeaders;
}

module.exports = Rule;