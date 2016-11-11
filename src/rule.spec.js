/* global describe */
/* global it */
/* global expect */

describe('Rule', () => {
    const Rule = require('./rule');

    it('Minimal Rule: pattern and path', () => {
        const ruleDef = {
            path: '^/abc/?',
            target: 'http://localhost/'
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

    it('Resets path', () => {
        const ruleDef = { path: '^/abc/?', resetPath: true, target: 'http://localhost/' };
        const rule = new Rule(ruleDef);
        expect(rule.resetPath).toBe(true);
    });

    it('Matches request', () => {
        const request = { url: '/abc' };
        const ruleDef = { path: '^/abc/?', resetPath: true, target: 'http://localhost/' };
        const rule = new Rule(ruleDef);
        expect(rule.match(request)).toBeTruthy();
    });

    it('Redirects', () => {
        const request = { url: '/abc' };
        const ruleDef = { path: '^/abc/?', redirect: 'http://localhost/' };
        const rule = new Rule(ruleDef);
        expect(rule.isValid()).toBe(true);
        const match = rule.match(request);
        expect(match).toBeTruthy();
        expect(match.target).toBe('http://localhost/');
    });
});