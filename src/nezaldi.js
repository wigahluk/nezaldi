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

const express = require('express');
const httpProxy = require('http-proxy');
const https = require('https');
const url = require('url');
const cli = require('./cli');
const Rule = require('./rule');

function lDebug (debug) {
    return function () {
        if(!debug) {
            return;
        }
        cli.log(Array.prototype.join.call(arguments,' '));
    };
}

function Nezaldi (conf) {
    this.start = () => {
        const proxy = httpProxy.createProxyServer();
        const app = express();
        const port = conf.port;
        const defaultUrl = conf.defaultUrl;
        const rules = Rule.rules(conf.rules);
        const ldebug = lDebug(conf.debug);

        app.use((req, res) => {
            ldebug('Request URL:', req.url);
            ldebug('Request Headers:\n', JSON.stringify(req.headers));

            const match = rules.match(req);
            req.originalUrl = req.url;
            if(!match) {
                ldebug(`No match for ${req.url}, defaulting to`, defaultUrl);
                req.url = '/';
                proxy.web(req, res, {
                    target: defaultUrl
                });
            } else {
                if (match.isRedirect) {
                    // Redirect calls
                    res.writeHead(302, {'Location': match.target });
                    res.end();
                } else {
                    // Proxy call
                    ldebug(`Match source: ${req.url} -> target: ${match.path} `);
                    req.url = match.path;
                    match.removeHeaders.forEach((h) => {
                        if (req.headers[h]) { delete req.headers[h]; }
                    });
                    match.addHeaders.forEach((h) => {
                        req.headers[h.name] = h.value;
                    });
                    proxy.web(req, res, {
                        target: match.target
                    });
                }
            }
        });
        // Run the server
        app.listen(port, function () {
            cli.log(`Server running at port ${port}`);
        });
    }
}

module.exports = Nezaldi;