const cli = require('./cli');
const Nezaldi = require('./nezaldi');
const Dashboard = require('./dashboard/dashboard');
const Monitor = require('./monitor/monitor');
const Configuration = require('./conf/configuration');
const path = require('path');
const fs = require('fs');

// TODO: Refactor:
const validator = require('./confValidator');
const validate = validator.validateRawObject;


const filePath = (relativePath) => path.resolve(process.cwd(), relativePath);

const forceConfPath = path => {
    if (path) {
        return path;
    }
    cli.log('No configuration file provided, trying default paths...');
    // Try one of the posible default values
    if (fs.existsSync(filePath('./nezaldi.json'))) {
        cli.log('Using configuration file: ./nezaldi.json');
        return filePath('./nezaldi.json');
    }
    if (fs.existsSync(filePath('./.nezaldi.json'))) {
        cli.log('Using configuration file: ./.nezaldi.json');
        return filePath('./.nezaldi.json');
    }
    throw new Error('Configuration file is required.');
};

const launch = (confPath, port) => {
    const conf = new Configuration(JSON.parse(fs.readFileSync(forceConfPath(confPath), 'utf8')), port);
    // launch monitor
    const m = new Monitor(conf.debug());
    // launch server
    const server = new Nezaldi(conf, m);
    server.start();
    // launch dashbaord
    if (conf.dashboardEnabled()) {
        const d = new Dashboard(conf, m);
        d.start();
    }
};

module.exports = launch;
