const cli = require('../cli');

const lDebug = (debug) => function () {
    if (debug) cli.log(Array.prototype.join.call(arguments,' '));
};

const toArray = obj => {
    const a = [];
    for (let p in obj) {
        if( obj.hasOwnProperty(p) ) {
            a.push([p, obj[p]]);
        }
    }
    return a;
};

function Monitor (dMode) {
    const debugMode = !!dMode;
    const sizeLimit = 1000;
    const counters = { traffic: 0, errors: 0 };
    const transactions = [];

    const log = lDebug(debugMode);

    const count = (trans) => {
        counters.traffic++;
        if (trans.code >= 400) counters.errors++;
    };

    this.traffic = () => counters.traffic;
    this.errorCount = () => counters.errors;
    this.log = (trans) => {
        if (trans && trans.code &&  trans.sourceUrl && trans.sourceRequestTime) {
            count(trans);
            transactions.push(trans);
            if (transactions.length > sizeLimit) {
                transactions.splice(1);
            }
            log([
                `Counts: traffic: ${counters.traffic}, errors: ${counters.errors}`,
                `Transaction Type: ${trans.responseType}; Status Code ${trans.code}`,
                `Request: ${trans.sourceUrl} -> Target: ${trans.targetUrl}`,
            ].join('\n'));
        }
    };
    this.transactions = () => transactions.slice();
}

Monitor.prototype.createTransaction = function (sourceUrl) {
    return new Transaction(this, sourceUrl);
};

function Transaction (monitor, sourceUrl) {
    const sourceRequestTime = new Date().valueOf();

    let code, targetUrl, sourceResponseTime, targetRequestTime, targetResponseTime, responseType;
    const headers = {};

    const generate = () => {
        return {
            code: code || 504,
            sourceUrl: sourceUrl,
            targetUrl: targetUrl,
            responseType: responseType || 'unknown',
            sourceRequestTime: sourceRequestTime,
            sourceResponseTime: sourceResponseTime,
            targetRequestTime: targetRequestTime,
            targetResponseTime: targetResponseTime,
            headers: headers
        };
    };

    this.transaction = generate;
    this.sourceHeaders = hs => { headers.source = toArray(hs); };
    this.proxy = url => { targetUrl = url; responseType = 'proxy'; };
    this.local = url => { targetUrl = url; responseType = 'local'; };
    this.redirect = url => { code = 302; targetUrl = url; responseType = 'redirect'; };
    this.noMatch = () => { code = 404; responseType = 'noMatch'; };
    this.targetStart = hs => { headers.target = toArray(hs); targetRequestTime = new Date().valueOf(); };
    this.targetResponse = (sCode, hs) => { headers.response = toArray(hs); code = sCode; targetResponseTime = new Date().valueOf(); };
    this.end = () => { sourceResponseTime = new Date().valueOf(); monitor.log(generate())};
}

module.exports = Monitor;
