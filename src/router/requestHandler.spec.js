/* global describe */
/* global it */
/* global expect */

const handler = require('./requestHandler');
const Rule = require('./rule');

const trans = () => {
    return {
        redirect: function (path) { this._redirect = path; },
        end: function () { this._end = true; }
    };
};

const res = () => {
    return {
        writeHead: function (code) { this._code = code; },
        end: function () { this._end = true; }
    };
};

const req = (p) => {
    return { url: p};
};

describe('RequestHandler', () => {

    it('Simple Redirect', () => {
        const ruleDef = { path: '^/abc/?', redirect: 'http://a.com/' };
        const rule = new Rule(ruleDef);
        const rq = req('/abc');
        const rs = res();
        const t = trans();
        const h = handler(rule.regex.exec(rq.url), rule);
        h(rq, rs, t);
        expect(rs._code).toBe(302);
        expect(rs._end).toBe(true);
        expect(t._end).toBe(true);
        expect(t._redirect).toBe('http://a.com/');
    });

    it('Redirect with replacements', () => {
        const ruleDef = { path: '^/a/([^/]+)/b/([^/]+)/', redirect: 'http://a.com/$2/$1/x' };
        const rule = new Rule(ruleDef);
        const rq = req('/a/m/b/n/');
        const rs = res();
        const t = trans();
        const h = handler(rule.regex.exec(rq.url), rule);
        h(rq, rs, t);
        expect(rs._code).toBe(302);
        expect(rs._end).toBe(true);
        expect(t._end).toBe(true);
        expect(t._redirect).toBe('http://a.com/n/m/x');
    });

    it('Redirect with double replacement', () => {
        const ruleDef = { path: '^/a/([^/]+)/b/([^/]+)/', redirect: 'http://a.com/$2/$1/$1/x' };
        const rule = new Rule(ruleDef);
        const rq = req('/a/m/b/n/');
        const rs = res();
        const t = trans();
        const h = handler(rule.regex.exec(rq.url), rule);
        h(rq, rs, t);
        expect(rs._code).toBe(302);
        expect(rs._end).toBe(true);
        expect(t._end).toBe(true);
        expect(t._redirect).toBe('http://a.com/n/m/m/x');
    });

    it('Redirect with trailing path', () => {
        const ruleDef = { path: '^/abc/', redirect: 'http://a.com/' };
        const rule = new Rule(ruleDef);
        const rq = req('/abc/x/y/z');
        const rs = res();
        const t = trans();
        const h = handler(rule.regex.exec(rq.url), rule);
        h(rq, rs, t);
        expect(rs._code).toBe(302);
        expect(rs._end).toBe(true);
        expect(t._end).toBe(true);
        expect(t._redirect).toBe('http://a.com/x/y/z');
    });

    it('Redirect with reset', () => {
        const ruleDef = { path: '^/abc/', redirect: 'http://a.com/', resetPath: true };
        const rule = new Rule(ruleDef);
        const rq = req('/abc/x/y/z');
        const rs = res();
        const t = trans();
        const h = handler(rule.regex.exec(rq.url), rule);
        h(rq, rs, t);
        expect(rs._code).toBe(302);
        expect(rs._end).toBe(true);
        expect(t._end).toBe(true);
        expect(t._redirect).toBe('http://a.com/');
    });
});
