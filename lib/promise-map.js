'use strict';

module.exports = (array, callback, options = {}) => new Promise((resolve, reject) => {
	const {length} = array;
	if(length === 0)
		return resolve([]);

	let {concurrency = Infinity} = options;
	concurrency = Math.min(concurrency, length);

	const results = new Array(length);
	let missing = length;
	let index = 0;

	const run = () => {
		const i = index++;
		callback(array[i], i)
			.then(value => {
				results[i] = value;
				if(index < length)
					run();
				if(--missing === 0)
					resolve(results);
			})
			.catch(reject);
	};

	for(let i = 0; i < concurrency; i++)
		run();
});
