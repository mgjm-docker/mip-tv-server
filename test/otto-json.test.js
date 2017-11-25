'use strict';

const assert = require('assert');

const runTests = modulePath => {
	const ottoJSON = require('../lib/' + modulePath);
	console.log(modulePath);

	assert.strictEqual(typeof ottoJSON, 'function', `module is not a function: ${typeof ottoJSON}`);

	const result = ottoJSON({
		keys: ['foo', 'hello'],
		entries: [
			['bar1', 'world1'],
			['bar2', 'world2'],
		]
	})
	const expected = [
		{foo: 'bar1', hello: 'world1'},
		{foo: 'bar2', hello: 'world2'},
	];
	assert.deepStrictEqual(result, expected, `module is not working: expecting: ${JSON.stringify(expected, '', '  ')} but got: ${JSON.stringify(result, '', '  ')}`)
};

runTests('otto-json.simple');
runTests('otto-json');
