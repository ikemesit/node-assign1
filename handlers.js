const url = require('url');
const { StringDecoder } = require('string_decoder');
const querystring = require('querystring');

const handlers = {};

const statusCodes = {
    'ok': 200,
    'notFound': 404
}

handlers.hello = function (request, response) {
    const requestMethod = request.method;

    if (requestMethod === 'GET') {
        const parsedUrl = url.parse(request.url, true);
        const parsedQueryString = parsedUrl.query;

        const responseObject = {
            parsedQuery: parsedQueryString,
            httpMethod: request.method,
            message: 'Hello to you too!'
        };

        response.setHeader('Content-Type', 'application/json');
        response.writeHead(statusCodes.ok);
        response.end(JSON.stringify(responseObject));
    } else if (requestMethod === 'POST') {
        const decoder = new StringDecoder('utf-8');
        let buffer = '';

        request.on('data', (data) => {
            buffer += decoder.write(data);
        });

        request.on('end', () => {
            buffer += decoder.end();

            const responseObject = {
                queryBody: querystring.parse(buffer),
                httpMethod: request.method,
                message: 'Hello to you too!'
            };
    
            response.setHeader('Content-Type', 'application/json');
            response.writeHead(statusCodes.ok);
            response.end(JSON.stringify(responseObject));
        })
    } else {
        handlers.notFound(request, response);
    }       
}

handlers.notFound = function (request, response) {
    response.writeHead(statusCodes.notFound);
    response.end('ok');
};

module.exports = handlers;
