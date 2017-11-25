'use strict';

// run a async function with every item of an array
// but with an option for concurrency
module.exports = (array, callback, options = {}) => new Promise((resolve, reject) => {
	// get the length of the array
	const {length} = array;

	// do we have items (if not we are done)
	if(length === 0)
		return resolve([]);

	// get the options
	let {concurrency = Infinity} = options;
	concurrency = Math.min(concurrency, length);

	// prepare variables

	// the return values of the supplied function
	const results = new Array(length);
	// number of iterations missing
	let missing = length;
	// current index
	let index = 0;

	// execute for next item
	const run = () => {
		const i = index++;
		// run the function
		callback(array[i], i)
			// and process the return value
			.then(value => {
				// save the value
				results[i] = value;
				// do we still have more items
				if(index < length)
					run();
				// are we done?
				if(--missing === 0)
					resolve(results);
			})
			// catch errors
			.catch(reject);
	};

	// start the requested number of parallel executions
	for(let i = 0; i < concurrency; i++)
		run();
});
