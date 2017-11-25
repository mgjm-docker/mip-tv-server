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

module.exports = ({keys, entries}) => {
	const {length} = keys;
	const results = [];
	for(const entry of entries) {
		const result = {};
		for(let i = 0; i < length; i++) {
			result[keys[i]] = entry[i];
		}
		results.push(result);
	}
	return results;
};
