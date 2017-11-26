'use strict';

const db = require('../db');

module.exports = async (req, res, {date = Date.now()}) => {
	date = new Date(+date);
	console.log('get servers', date);

	const servers = await db.getServers(date);
	const dataPoints = [];
	for(const row of servers.rows) {
		dataPoints.push({
			date: row.timeframe.toLocaleTimeString('en-GB', {hour: '2-digit', minute: '2-digit'}),
			serversVisited: +row.count,
		});
	}
	return {dataPoints};
};
