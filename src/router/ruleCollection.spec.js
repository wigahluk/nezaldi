/* global describe */
/* global it */
/* global expect */

describe('RuleCollection', () => {
    const Rules = require('./ruleCollection');
    const Rule = require('./rule');

    it('No arguments creates an empty collection', () => {
        const rs = new Rules();
        expect(rs.size()).toBe(0);
    });

    it('Empty array creates an empty collection', () => {
        const rs = new Rules([]);
        expect(rs.size()).toBe(0);
    });

    it('one element collection with match', () => {
        const request = { url: '/' };
        const ruleDef = { path: '^/$', target: 'http://localhost/' };
        const rs = new Rules([ruleDef]);
        expect(rs.size()).toBe(1);
        const match = rs.match(request);
        expect(match).toBeDefined();
    });

    it('one element collection with no match', () => {
        const request = { url: '/no-match' };
        const ruleDef = { path: '^/$', target: 'http://localhost/' };
        const rs = new Rules([ruleDef]);
        expect(rs.size()).toBe(1);
        const match = rs.match(request);
        expect(match).toBeUndefined();
    });
});
