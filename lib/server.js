'use strict';

const http = require('http');

const handler = async (req, res) => {
	console.log('request', req.method, req.url, req.headers);
	
	res.end('hello world');
};

http.createServer((req, res) => {
	handler(req, res).catch(err => {
		console.error(err);
		res.statusCode = 500;
		res.end();
	});
}).listen(8080, () => {
	console.log('server is running... http://localhost:8080');
}).on('error', err => {
	console.error(err);
	process.exit(1);
});
