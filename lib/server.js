'use strict';

// import modules
const http = require('http');

// handlers for GET requests
const getHandler = Object.create(null);

// handlers for POST requests
const postHandler = Object.create(null);
postHandler['/upload'] = require('./upload');

// buffer a stream (e.g. a HTTP request) into a single string
const bufferAsync = stream => new Promise((resolve, reject) => {
	let buffer = '';
	stream.setEncoding('utf8');
	stream.on('data', chunk => { buffer += chunk });
	stream.on('error', reject);
	stream.on('end', () => { resolve(buffer) });
});

// handle a request
const handler = async (req, res) => {
	console.log('request', req.method, req.url, req.headers);

	// do different stuff on deifferent request methods
	switch(req.method) {
		case 'GET': {
			const handler = getHandler[req.url];
			if(handler !== undefined) {
				// if a handler for the given url exists, run it
				const result = await handler(req, res);
				// ... and return the result as JSON
				console.log('result', result);
				res.end(JSON.stringify(result));
				return;
			}
		} break;
		case 'POST': {
			const handler = postHandler[req.url];
			if(handler !== undefined) {
				// if a handler fo the given url exists, buffer the request
				const data = await bufferAsync(req);
				// ... and run the handler
				await handler(req, res, JSON.parse(data));
				// no content to return on a POST request
				console.log('no content');
				res.statusCode = 204; // No Content
				res.end();
				return;
			}
		} break;
	}

	// no buffer exists for the given combination of method and url
	console.log('not found');
	res.statusCode = 404; // Not Found
	res.end('Not Found - Visit https://github.com/mip-tv\n');
};


// create a HTTP server
http.createServer((req, res) => {
	// and handle requests...
	handler(req, res).catch(err => {
		// ... and catch errors gracefully
		console.error(err);
		res.statusCode = 500; // Internal Server Error
		res.end();
	});
})
// listen on port 8080
.listen(8080, () => {
	console.log('server is running... http://localhost:8080');
})
// and catch server errors (e.g. port already in use)
.on('error', err => {
	console.error(err);
	process.exit(1);
});
