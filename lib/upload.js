'use strict';

const ottoJSON = require('./otto-json');

module.exports = async (req, res, data) => {
	const entries = ottoJSON(data);
	console.log('upload', data);
	console.log(entries);
};
