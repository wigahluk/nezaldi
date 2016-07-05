/* global module */
'use strict';

function Rule (ruleDef) {
    const def = ruleDef || {};
    this.target = def.target;
    this.regex = new RegExp(def.path || '', 'i');
    this.resetPath = !!def.resetPath;
    this.accept = def.accept;
    this.isStatic = def.target ? !/^https?:\/\/[^\.]+\.|:.+/.test(ruleDef.target) : false
    this.addHeaders = def.addHeaders || [];
}

Rule.prototype.isValid = function () { return !!this.target && !!this.regex; };

Rule.prototype.match = function (request) {
    const match = this.regex.exec(request.url);
    if (match) {
        if (this.accept) {
            const accept = request.headers.accept.toLowerCase().split(',');
            const isSameAccept = accept.indexOf(this.accept.toLowerCase()) >= 0;
            return isSameAccept ?  new RuleMatch(match, this, request) : undefined
        }
        return new RuleMatch(match, this, request);
    }
};

Rule.rules = function (ruleDefs) { return new RuleCollection(ruleDefs); };

function extractPath(originalPath, match) {
    const path = originalPath.substr(match.length);
    return (path.indexOf('/') === 0 || path.length === 0) ? path : '/' + path;
}

function RuleMatch (rxMatch, rule, request) {
    this.target = rxMatch
        .slice(1)
        .reduce(
            (path, fragment, idx) => path.replace('$' + (idx + 1), fragment),
            rule.target
        );
    this.originalUrl = request.url;
    this.matchPrefix = rxMatch[0];
    this.path = this.resetPath? '' : extractPath(request.url, rxMatch[0]);
    this.isStatic = rule.isStatic;
    this.addHeaders = rule.addHeaders;
}

function RuleCollection (ruleDefs) {
    this.rules = ruleDefs.map((rule, idx) => new Rule(rule));
}

RuleCollection.prototype.match = function (request) {
    for (let i = 0; i < this.rules.length; i++) {
        const match = this.rules[i].match(request);
        if(match) {
            return match;
        }
    }
};

module.exports = Rule;