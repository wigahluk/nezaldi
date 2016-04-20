/* global process */
'use strict';

// This file is our entry point for Node.js
const express = require('express');
const path = require('path');
const httpProxy = require('http-proxy');
const fs = require('fs');

loadConf (
    (conf) => {
        const proxy = httpProxy.createProxyServer();
        const app = express();

        const port = conf.port || 3000;

        const defaultUrl = conf.defaultUrl;



        const rules = conf.rules.map((rule, idx) => {
            return {
                regex: new RegExp(rule.path, 'i'),
                target: rule.target,
                resetPath: !!rule.resetPath,
                accept: rule.accept,
                isStatic: rule.target ? !/^https?:\/\/[^\.]+\.|:.+/.test(rule.target) : false
            }
        });


        app.use((req, res, next) => {
            req.headers = cleanHeaders(req.headers);
            const match = findMatch(rules, req);
            req.originalUrl = req.url;
            if(!match) {
                console.log('no match, defaulting to', defaultUrl);
                req.url = '/';
                proxy.web(req, res, {
                    target: defaultUrl
                });
            } else {
                let newTarget = match.rule.target;
                match.match.slice(1).forEach((s, idx) => {
                    newTarget = newTarget.replace('$' + (idx + 1), s);
                });
                let newUrl = req.originalUrl.substr(match.match[0].length);
                if(newUrl.indexOf('/') !== 0) {
                    newUrl = '/' + newUrl;
                }
                req.url = newUrl;
                proxy.web(req, res, {
                    target: newTarget
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


function findMatch (rs, request) {
    for (let i = 0; i < rs.length; i++) {
        const match = matchRule(rs[i], request);
        if(match) {
            return match;
        }
    }
}

function matchRule (rule, request) {
    const url = request.url;
    const match = rule.regex.exec(url);
    if (match) {
        if (rule.accept) {
            const isSameAccept = request.headers.accept.toLowerCase() === rule.accept.toLowerCase();
            return isSameAccept ?  { rule: rule, match: match} : undefined
        }
        return { rule: rule, match: match};
    }
    return undefined;
}

function loadConf (onSuccess, onError) {
    const path = confFilePath();

    if (!path) {
        onError({
            error: "No configuration file provided. Use --conf=<file name>."
        });
        return;
    }

    fs.readFile(path, 'utf8', (error, data) => {
        if (error) {
            onError(error);
            return;
        }
        try {
            const conf = JSON.parse(data);
            validateConf(conf);
            onSuccess(conf, path);
        } catch (error2) {
            onError({error: error2.message});
        }
    });
}

function validateConf(confObj) {
    if(!confObj.defaultUrl) {
        throw new Error('Required parameter: defaultUrl');
    }
    if(!confObj.rules) {
        throw new Error('Required parameter: rules');
    }
}

function confFilePath() {
    const customPath = process.argv.find((item) => item.startsWith('--conf'));

    if(customPath) {
        var arr = customPath.split('=');
        if(arr.length) {
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