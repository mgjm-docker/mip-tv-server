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

For a simple (not optimized, but readable) version see otto-json.js.simple

*/

// no time for optimization... just use simple
module.exports = require('./otto-json.simple');
