/* global describe */
/* global it */
/* global expect */
/* global require */
'use strict';

describe('Rule', () => {
    const Rule = require('./rule');

    it('Minimal Rule: pattern and path', () => {
        const ruleDef = {
            path: "^/abc/?",
            target: "http://localhost/"
        };
        const rule = new Rule(ruleDef);

        expect(rule.target).toBe('http://localhost/');
        expect(rule.regex.test('sometjing')).toBe(false);
        expect(rule.regex.test('/abc')).toBe(true);
        expect(rule.regex.test('/abc/')).toBe(true);
        expect(rule.regex.test('/abc/some/more?stuff')).toBe(true);
        expect(rule.resetPath).toBe(false);
        expect(rule.accept).toBeUndefined();
        expect(rule.isStatic).toBe(false);
        expect(rule.isValid()).toBe(true);
    });

    it('Rule that resets path', () => {
        const ruleDef = {
            path: "^/abc/?",
            "resetPath": true,
            target: "http://localhost/"
        };
        const rule = new Rule(ruleDef);
        expect(rule.resetPath).toBe(true);
    });

    it('Rule match request', () => {
        const request = {
            url: '/abc'
        };
        const ruleDef = {
            path: "^/abc/?",
            "resetPath": true,
            target: "http://localhost/"
        };
        const rule = new Rule(ruleDef);
        expect(rule.match(request)).toBeTruthy();
    })
});