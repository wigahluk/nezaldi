/* global module */
'use strict';

function validate(confObj) {
    if(!confObj.rules) {
        throw new Error('Required parameter: rules');
    }
    return confObj;
}

module.exports = {
    validateRawObject: validate
};
