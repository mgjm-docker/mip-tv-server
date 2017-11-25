'use strict';

const db = require('../db');

const DATE_MULTIPLIER = 60 * 60 * 24;

module.exports = async (req, res, {date}) => {
	if(date) new Date(+date * DATE_MULTIPLIER);
	else date = new Date();

	console.log('get locations', date);

	const locations = await db.getLocations(date);
	for(const row of locations.rows)
		row.cnt |= 0;
	return locations.rows;
};
