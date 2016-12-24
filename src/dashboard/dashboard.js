const http = require('http');
const cli = require('../cli');
const fProxy = require('../router/fileProxy');

function Dashboard (conf, monitor) {
    this.start = () => {
        const port = conf.dashboardPort();

        const server = http.createServer((req, res) => {
            const url = req.url;
            // is API call
            if (url.indexOf(/api/) === 0) {
                res.end('WIP');
            } else {
                fProxy('./src/dashboard/build' + url)(req, res);
            }
        });
        server.listen(port, () => { cli.log(`Dashboard Server running at port ${port}`); });
    };
}

module.exports = Dashboard;