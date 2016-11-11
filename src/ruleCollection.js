const Rule = require('./rule');

function RuleCollection (ruleDefinitions) {
    this.rules = (ruleDefinitions || []).map(rule => new Rule(rule));
}

RuleCollection.prototype.size = function () { return this.rules.length; };

RuleCollection.prototype.match = function (request) {
    for (let i = 0; i < this.rules.length; i++) {
        const match = this.rules[i].match(request);
        if(match) { return match; }
    }
};

module.exports = RuleCollection;