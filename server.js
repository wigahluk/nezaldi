/* global process */
'use strict';

const express = require('express');
const path = require('path');
const httpProxy = require('http-proxy');
const https = require('https');
const fs = require('fs');
const url = require('url');

const confValidator = require('./src/confValidator');
const Rule = require('./src/rule');

loadConf (
    (conf) => {
        const proxy = httpProxy.createProxyServer();
        const app = express();
        const port = conf.port || 3000;
        const defaultUrl = conf.defaultUrl;
        const rules = Rule.rules(conf.rules);

        app.use((req, res, next) => {
            req.headers = cleanHeaders(req.headers);
            const match = rules.match(req);
            req.originalUrl = req.url;
            if(!match) {
                console.log('No match for ' + req.url + ', defaulting to', defaultUrl);
                req.url = '/';
                proxy.web(req, res, {
                    target: defaultUrl
                });
            } else {
                req.url = match.path;
                match.addHeaders.forEach((h) => {
                    console.log(h, req.headers);
                    req.headers[h.name] = h.value;
                });
                proxy.web(req, res, {
                    target: match.target
                });
            }
        });
        // Run the server
        app.listen(port, function () {
            console.log('[Nezaldi] Server running at port %s', port);
        });
    },
    (error) => {
        console.log('[Nezaldi] Unable to start the server.\nError: ' + JSON.stringify(error) + '\n');
    }
);


function loadConf (onSuccess, onError) {
    const path = confFilePath(process.argv);

    if (!path) {
        onError({ error: 'No configuration file provided. Use --conf=<file name>.' });
        return;
    }

    fs.readFile(path, 'utf8', (error, data) => {
        if (error) {
            onError(error);
            return;
        }
        try {
            const conf = JSON.parse(data);
            confValidator.validateRawObject(conf);
            onSuccess(conf, path);
        } catch (error2) {
            onError({ error: error2.message });
        }
    });
}

function confFilePath(args) {
    const customPath = args.find((item) => item.startsWith('--conf'));

    if(customPath) {
        const arr = customPath.split('=');
        if(arr.length > 1) {
            return arr[1].trim();
        }
    }
    return '.nezaldi.json';
}


function cleanHeaders(headers) {
    delete headers.host;
    delete headers.cookie;
    return headers;
}