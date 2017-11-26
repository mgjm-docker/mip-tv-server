'use strict';

// import modules
const http = require('http');

// handlers for GET requests
const getHandler = Object.create(null);
getHandler['/locations/daily'] = require('./get/locations');
getHandler['/stats/servers'] = require('./get/servers');
getHandler['/stats/countries'] = require('./get/countries');

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
	let url = req.url;
	let query = '';
	const position = url.indexOf('?');
	if(position !== -1) {
		query = url.substr(position + 1);
		url = url.substr(0, position);
	}

	console.log('request', req.method, url, query, req.headers);

	// do different stuff on deifferent request methods
	switch(req.method) {
		case 'GET': {
			const handler = getHandler[url];
			if(handler !== undefined) {
				// if a handler for the given url exists, parse the query
				// a query can be something like this:
				// foo=bar&test&hello=world
				const data = {};
				while(query.length !== 0) {
					// i hope it works
					let p1 = query.indexOf('&');
					let p2 = query.indexOf('=');
					if(p1 === -1) p1 = query.length;
					if(p2 > p1 || p2 === -1) p2 = p1;
					data[query.substring(0, p2)] = p2 === p1 ? '' : query.substring(p2 + 1, p1);
					query = query.substring(p1 + 1);
				}
				// ... and run the handler
				const result = await handler(req, res, data);
				// ... and return the result as JSON
				console.log('result', result);
				res.end(JSON.stringify(result, '', '  ') + '\n');
				return;
			}
		} break;
		case 'POST': {
			const handler = postHandler[url];
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
