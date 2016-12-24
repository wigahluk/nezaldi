const http = require('http');
const cli = require('../cli');

function Dashboard (conf, monitor) {
    this.start = () => {
        const port = conf.dashboardPort();

        const server = http.createServer((req, res) => {
            res.end('hola :)');
        });
        server.listen(port, () => { cli.log(`Dashboard Server running at port ${port}`); });
    };
}

module.exports = Dashboard;