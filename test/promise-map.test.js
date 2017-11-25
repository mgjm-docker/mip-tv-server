'use strict';

const PromiseMap = require('../lib/promise-map');

const test = i => new Promise(resolve => setTimeout(() => {
	console.log('item', i);
	resolve('item ' + i);
}, Math.random() * 1000));

const options = {
	concurrency: 3,
};
const run = async () => {
	console.log(await PromiseMap([], test, options));
	console.log(await PromiseMap([1,2,3], test, options));
	console.log(await PromiseMap([1,2,3, 4], test, options));
	console.log(await PromiseMap([1,2,3, 4,5,6], test, options));
	console.log(await PromiseMap([1,2,3, 4,5,6,7,8,9], test, options));
};

run().catch(err => {
	console.error(err);
});
