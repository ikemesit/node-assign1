const http = require('http');
const url = require('url');
const handlers = require('./handlers');

const httpServer = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, '');

    const chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;
    
    chosenHandler(req, res);
});

httpServer.listen(4000, () => {
    console.log(`server is listening on port 4000`);
});

const router = {
    'hello' : handlers.hello
};
