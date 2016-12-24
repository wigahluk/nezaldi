/* global describe */
/* global it */
/* global expect */

const Monitor = require('./monitor');

describe('Monitor', () => {

    it('Transaction on new monitor', () => {
        const m = new Monitor();
        expect(m.traffic()).toBe(0);
        expect(m.errorCount()).toBe(0);
    });

    it('Logging undefined should not change state', () => {
        const m = new Monitor();
        m.log();
        expect(m.traffic()).toBe(0);
        expect(m.errorCount()).toBe(0);
    });

    it('Logging empty object should not change state', () => {
        const m = new Monitor();
        m.log({});
        expect(m.traffic()).toBe(0);
        expect(m.errorCount()).toBe(0);
    });

    it('Transactions should have at least source url, and start time', () => {
        const m = new Monitor();
        const t = m.createTransaction('a');
        let raw = t.transaction();
        expect(raw).toBeDefined();
        expect(raw.sourceRequestTime).toBeDefined();
        expect(raw.sourceUrl).toBe('a');
    });

    it('Logging  minimal transaction should increment traffic and errors', () => {
        const m = new Monitor();
        const t = m.createTransaction('a');
        m.log(t.transaction());
        expect(m.traffic()).toBe(1);
        expect(m.errorCount()).toBe(1);
    });

    it('Register all events at transaction', () => {
        const m = new Monitor();
        const t1 = new Date().valueOf();
        const t = m.createTransaction('a');
        t.targetStart();
        t.targetResponse(200, {});
        t.end();
        let raw = t.transaction();
        const t2 = new Date().valueOf();
        expect(raw).toBeDefined();
        expect(t1 <= raw.sourceRequestTime).toBe(true);
        expect(raw.sourceRequestTime <= raw.targetRequestTime).toBe(true);
        expect(raw.targetRequestTime <= raw.targetResponseTime).toBe(true);
        expect(raw.targetResponseTime <= raw.sourceResponseTime).toBe(true);
        expect(raw.sourceResponseTime <= t2).toBe(true);
    });
});
