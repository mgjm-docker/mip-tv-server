'use strict';

const db = require('../db');

module.exports = async (req, res, {date = Date.now()}) => {
	date = new Date(+date);
	console.log('get locations', date);

	const locations = await db.getLocations(date);
	for(const row of locations.rows)
		row.cnt |= 0;
	return locations.rows;
};
