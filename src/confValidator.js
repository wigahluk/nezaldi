/* global module */
'use strict';

function validateRawObject(confObj) {
    if(!confObj.defaultUrl) {
        throw new Error('Required parameter: defaultUrl');
    }
    if(!confObj.rules) {
        throw new Error('Required parameter: rules');
    }
    return confObj;
}

module.exports = {
    validateRawObject: validateRawObject
};
