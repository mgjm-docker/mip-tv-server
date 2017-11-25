'use strict';

const cassandra = require('cassandra-driver');
const client = new cassandra.Client({contactPoints: ['localhost'], keyspace: 'mip_tv'});

const db = module.exports = {};

db.timeUUID = date => new cassandra.types.TimeUuid(date);

const USER_ID = Buffer.from('4a7567656e644861636b742032303137', 'hex');
const TIMEFRAME_SIZE = 1000 * 60 * 5; // 5 minutes

const INSERT_RAWDATA_TAIL = ' (userid, ip, country, loc, id, uri, day) VALUES (?, ?, ?, ?, ?, ?, ?)';
const INSERT_RAWDATA1 = 'INSERT INTO rawdata' + INSERT_RAWDATA_TAIL;
const INSERT_RAWDATA2 = 'INSERT INTO rawdata_by_country' + INSERT_RAWDATA_TAIL;
const INSERT_RAWDATA3 = 'INSERT INTO rawdata_by_loc' + INSERT_RAWDATA_TAIL;
const INCREMENT_LOCATION = 'UPDATE locations SET cnt = cnt + 1 WHERE userid = ? AND day = ? AND loc = ?';
const INCREMENT_COUNTRY = 'UPDATE countries SET cnt = cnt + 1 WHERE userid = ? AND day = ? AND country = ?';
const INSERT_UNIQUE_IP = 'INSERT INTO uniqueIps (userid, day, timeframe, ip) VALUES (?, ?, ?, ?)'

const OPTIONS = {
	prepare: true
};

const executeSafe = async (...args) => {
	try {
		await client.execute(...args)
	} catch(err) {
		return err;
	}
};

let i = 0;
db.addEntry = async entry => {
	console.log('add', i++);

	const insertEntryParams = [USER_ID, entry.ip, entry.country, entry.loc, entry.id, entry.uri, entry.day];

	const result = await Promise.all([
		executeSafe(INSERT_RAWDATA1, insertEntryParams, OPTIONS),
		executeSafe(INSERT_RAWDATA2, insertEntryParams, OPTIONS),
		executeSafe(INSERT_RAWDATA3, insertEntryParams, OPTIONS),
		executeSafe(INCREMENT_LOCATION, [USER_ID, entry.day, entry.loc], OPTIONS),
		executeSafe(INCREMENT_COUNTRY, [USER_ID, entry.day, entry.country], OPTIONS),
		executeSafe(INSERT_UNIQUE_IP, [USER_ID, entry.day, Math.floor(entry.timestamp / TIMEFRAME_SIZE), entry.ip], OPTIONS),
	])

	return result;
};
