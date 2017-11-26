'use strict';

module.exports = async (req, res, {date = Date.now()}) => {
	console.log('servers', date);
	throw new Error('not implemented');
};
