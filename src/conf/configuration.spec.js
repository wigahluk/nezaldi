/* global describe */
/* global it */
/* global expect */

const Conf = require('./configuration');

describe('Configuration', () => {

    it('Default ports', () => {
        const c = new Conf();
        expect(c.port()).toBe(3000);
        expect(c.dashboardPort()).toBe(3030);
    });
});
