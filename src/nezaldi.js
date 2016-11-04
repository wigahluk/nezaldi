/*
 Copyright 2016 Oscar Ponce

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

const cli = require('./cli');
const Rule = require('./rule');
const hProxy = require('./proxy');
const http = require('http');

function lDebug (debug) {
    return () => {
        if(!debug) { return; }
        cli.log(Array.prototype.join.call(arguments,' '));
    };
}

const buildPath = (target, path) => target.replace(/\/$/, '') + (path ? '/' + path.replace(/^\//, '') : '');

function Nezaldi (conf) {
    this.start = () => {
        const port = conf.port;
        const defaultUrl = conf.defaultUrl;
        const rules = Rule.rules(conf.rules);
        const ldebug = lDebug(conf.debug);

        const server = http.createServer((req, res) => {
            ldebug('Request URL:', req.url);
            ldebug('Request Headers:\n', JSON.stringify(req.headers));

            const match = rules.match(req);
            req.originalUrl = req.url;
            if(!match) {
                ldebug(`No match for ${req.url}, defaulting to`, defaultUrl);
                hProxy(defaultUrl)(req, res);
            } else {
                if (match.isRedirect) {
                    // Redirect calls
                    ldebug(`Match source: ${req.url} -> redirect: ${match.target} `);
                    res.writeHead(302, {'Location': match.target });
                    res.end();
                } else {
                    // Proxy call
                    ldebug(`Match source: ${req.url} -> target: ${match.path} `);
                    match.removeHeaders.forEach(h => { if (req.headers[h]) { delete req.headers[h]; } });
                    match.addHeaders.forEach(h => { req.headers[h.name] = h.value; });
                    hProxy(buildPath(match.target,match.path))(req, res);
                }
            }
        });
        // Run the server
        server.listen(port, () => { cli.log(`Server running at port ${port}`); });
    }
}

module.exports = Nezaldi;