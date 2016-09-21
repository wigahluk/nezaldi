/* global describe */
/* global it */
/* global expect */
/* global require */
'use strict';

const validator = require('./confValidator');

describe('confValidator', () => {

    it('Empty object not allowed', () => {
        function v () {
            validator.validateRawObject({});
        }
        expect(v).toThrow();
    })

});