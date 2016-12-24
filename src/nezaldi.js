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
const Router = require('./router/ruleCollection');
const hProxy = require('./proxy');
const http = require('http');

const buildPath = (target, path) => target.replace(/\/$/, '') + (path ? '/' + path.replace(/^\//, '') : '');

const noMatch = res => { res.writeHead(404); res.end('Nezaldi: Not Found'); };

function Nezaldi (conf, monitor) {
    this.start = () => {
        const port = conf.port();
        const rules = new Router(conf.rules());

        const server = http.createServer((req, res) => {
            const t = monitor.createTransaction(req.url);
            t.sourceHeaders(req.headers);

            const match = rules.match(req);
            req.originalUrl = req.url;
            if(!match) {
                t.noMatch();
                noMatch(res);
                t.end();
            } else {
                if (match.isRedirect) {
                    // Redirect calls
                    t.redirect(match.target);
                    res.writeHead(302, {'Location': match.target });
                    res.end();
                    t.end();
                } else {
                    // Proxy call
                    match.removeHeaders.forEach(h => { if (req.headers[h]) { delete req.headers[h]; } });
                    match.addHeaders.forEach(h => { req.headers[h.name] = h.value; });
                    const p = buildPath(match.target, match.path);
                    t.proxy(p);
                    t.targetStart();
                    hProxy(p)(req, res, t);
                }
            }
        });
        server.listen(port, () => { cli.log(`Server running at port ${port}`); });
    }
}

module.exports = Nezaldi;