'use strict';

const http = require('http');

const UPLOAD_PATH = '/upload';
const UPLOAD_PATH_LENGTH = UPLOAD_PATH.length;

const getHandler = Object.create(null);

const postHandler = Object.create(null);
postHandler['/upload'] = require('./upload');

const bufferAsync = stream => new Promise((resolve, reject) => {
	let buffer = '';
	stream.setEncoding('utf8');
	stream.on('data', chunk => { buffer += chunk });
	stream.on('error', reject);
	stream.on('end', () => { resolve(buffer) });
});

const handler = async (req, res) => {
	console.log('request', req.method, req.url, req.headers);

	switch(req.method) {
		case 'GET': {
			const handler = getHandler[req.url];
			if(handler !== undefined) {
				const result = await handler(req, res);
				console.log('result', result);
				res.end(JSON.stringify(result));
				return;
			}
		} break;
		case 'POST': {
			const handler = postHandler[req.url];
			if(handler !== undefined) {
				const data = await bufferAsync(req);
				await handler(req, res, JSON.parse(data));
				console.log('no content');
				res.statusCode = 204; // No Content
				res.end();
				return;
			}
		} break;
	}

	console.log('not found');
	res.statusCode = 404; // Not Found
	res.end('Not Found - Visit https://github.com/mip-tv\n');
};

http.createServer((req, res) => {
	handler(req, res).catch(err => {
		console.error(err);
		res.statusCode = 500; // Internal Server Error
		res.end();
	});
}).listen(8080, () => {
	console.log('server is running... http://localhost:8080');
}).on('error', err => {
	console.error(err);
	process.exit(1);
});
