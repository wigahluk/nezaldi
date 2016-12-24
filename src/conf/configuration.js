function Configuration (raw, p) {
    let rawConf = raw || {};
    const dashboard = () => rawConf.dashboard || {};
    this.port = () => rawConf.port || p || 3000;
    this.dashboardPort = () => dashboard().port || 3030;
    this.dashboardEnabled = () => !!(dashboard().enable);
    this.debug = () => !!rawConf.debug;
    this.rules = () => rawConf.rules || [];
}

module.exports = Configuration;
