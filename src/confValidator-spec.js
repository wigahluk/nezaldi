/* global describe */
/* global it */
/* global expect */
/* global require */
'use strict';

describe('confValidator', () => {
    const validator = require('./confValidator');

    it('Empty object not allowed', () => {
        function v () {
            validator.validateRawObject({});
        }
        expect(v).toThrow();
    })
});