/* global module */
'use strict';

function Rule (ruleDef) {
    this.target = ruleDef.target;
    this.regex = new RegExp(ruleDef.path, 'i');
    this.resetPath = !!ruleDef.resetPath;
    this.accept = ruleDef.accept;
    this.isStatic = ruleDef.target ? !/^https?:\/\/[^\.]+\.|:.+/.test(ruleDef.target) : false
}

module.exports = Rule;