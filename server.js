/* global process */
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
        const mode = !!conf.devServerUrl ? 'proxy' : 'static';

        app.all('/*', (req, res) => {
            req.headers = cleanHeaders(req.headers);

            proxy.web(req, res, {
                target: getTargetUrl(req, conf)
            });
        });

        // It is important to catch any errors from the proxy or the
        // server will crash. An example of this is connecting to the
        // server when webpack is bundling
        proxy.on('error', (error, request, response) => {
            console.log('Error when invoking external server. URL: ' + request.hostname + request.url);

            response.writeHead(500, { 'Content-Type': 'application/json'});
            if(error && error.cert && error.cert.raw) {
                delete error.cert.raw;
            }
            response.end(JSON.stringify(error));

        });

        // And run the server
        app.listen(port, function () {
            console.log('Server running at port %s', port);
        });
    },
    (error) => {
        console.log('Unable to start the server.\nError: ' + JSON.stringify(error) + '\n');
    }
);


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
            onSuccess(conf);
        } catch (error2) {
            onError({error: error2.message});
        }
    });
}

function validateConf(confObj) {
    if(!confObj.apiUrl) {
        throw new Error('Required parameter: apiUrl');
    }
    if(!confObj.devServerUrl && !confObj.devSource) {
        throw new Error('Required parameter: devServerUrl or devSource');
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

function getTargetUrl(request, conf) {
    if (isApiCall(request)) {
        return conf.apiUrl;
    }
    return conf.devServerUrl;
}

function isApiCall(request) {
    // contentType != Json
    return request.headers.accept.toLowerCase() === "application/json";
}


function cleanHeaders(headers) {
    delete headers.host;
    delete headers.cookie;
    return headers;
}