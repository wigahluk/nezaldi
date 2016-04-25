/* global module */
'use strict';

function Rule (ruleDef) {
    const def = ruleDef || {};
    this.target = def.target;
    this.regex = new RegExp(def.path || '', 'i');
    this.resetPath = !!def.resetPath;
    this.accept = def.accept;
    this.isStatic = def.target ? !/^https?:\/\/[^\.]+\.|:.+/.test(ruleDef.target) : false
}

Rule.prototype.isValid = function () { return !!this.target && !!this.regex; };

module.exports = Rule;