const http = require('http');
const path = require('path');
const cli = require('../cli');
const fProxy = require('../router/fileProxy');

const sendJson = res => obj => {
    res.writeHead(200, { 'Content-Type': 'application/json'});
    res.end(JSON.stringify(obj));
};

function API (monitor) {
    this.handle = (req, res) => {
        const url = req.url;
        const resp = {
            traffic: monitor.traffic(),
            errors: monitor.errorCount(),
            transactions: monitor.transactions()
        };
        sendJson(res)(resp);
    };
}

const staticPath = path.dirname(__filename) + '/build';

function Dashboard (conf, monitor) {
    this.start = () => {
        const port = conf.dashboardPort();
        const api = new API(monitor);

        const server = http.createServer((req, res) => {
            const url = req.url;
            // is API call
            if (url.indexOf(/api/) === 0) {
                api.handle(req, res);
            } else {
                fProxy(staticPath + url)(req, res);
            }
        });
        server.listen(port, () => { cli.log(`Dashboard Server running at port ${port}`); });
    };
}

module.exports = Dashboard;