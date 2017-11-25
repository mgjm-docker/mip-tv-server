'use strict';

/*
OTTO JSON
a special dialect of JSON optimized for batch uploads

normal: [
	{"foo": "bar1", "hello": "world1"},
	{"foo": "bar2", "hello": "world2"}
]

otto: {
	"keys": ["foo", "bar"],
	"entries": [
		["bar1", "world1"],
		["bar2", "world2"]
	]
}

For an optimized (not simple readable) version see otto-json.js.simple

*/

// convert otto json to normal json
module.exports = ({keys, entries}) => {
	// store number of keys
	const {length} = keys;

	// the converted normal json
	const results = [];

	// loop through the entries
	for(const entry of entries) {
		// a single converted normal entry
		const result = {};

		// loop over all keys
		for(let i = 0; i < length; i++) {
			// map keys and entry items to the result object
			result[keys[i]] = entry[i];
		}
		// add the result to the results array
		results.push(result);
	}

	// no comment needed
	return results;
};
