const http = require('http');
const url = require('url');
const { StringDecoder } = require('string_decoder');

const httpServer = http.createServer((req, res) => {
    serverCallback(req, res);
});

serverCallback = function(req, res) {

    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, '');
    const decoder = new StringDecoder('utf-8');
    let buffer = '';

    req.on('data', (data) => {
        buffer += decoder.write(data);
    });

    req.on('end', () => {
        buffer += decoder.end();
        const chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

        chosenHandler(buffer, (statusCode, payload) => {
            console.log(statusCode);
            statusCode = typeof(statusCode) === 'number' ? statusCode : 200;
            payload = typeof(payload) === 'object' ? payload : {};
            // const payloadString = JSON.stringify(req);

            res.setHeader('Content-Type', 'text/plain');
            res.writeHead(statusCode);
            res.end('ok'); 
        });
    });
}

httpServer.listen(4000, () => {
    console.log(`server is listening on port 3000`);
});

handlers = {};

handlers.hello = function (data, callback) {
    callback(230);
}

handlers.notFound = function (data, callback) {
    callback(404);
};

const router = {
    'hello' : handlers.hello
};
