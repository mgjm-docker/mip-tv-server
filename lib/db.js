'use strict';

// import modules
const cassandra = require('cassandra-driver');
const client = new cassandra.Client({contactPoints: ['localhost'], keyspace: 'mip_tv'});

// the exported db object
const db = module.exports = {};

// create time uuid
db.timeUUID = date => new cassandra.types.TimeUuid(date);

// some constants
const USER_ID = Buffer.from('4a7567656e644861636b742032303137', 'hex');
const TIMEFRAME_SIZE = 1000 * 60 * 60 * 2; // 2 hours

// cql queries
const INSERT_RAWDATA_TAIL = ' (userid, ip, country, loc, id, uri, day) VALUES (?, ?, ?, ?, ?, ?, ?)';
const INSERT_RAWDATA1 = 'INSERT INTO rawdata' + INSERT_RAWDATA_TAIL;
const INSERT_RAWDATA2 = 'INSERT INTO rawdata_by_country' + INSERT_RAWDATA_TAIL;
const INSERT_RAWDATA3 = 'INSERT INTO rawdata_by_loc' + INSERT_RAWDATA_TAIL;
const INCREMENT_LOCATION = 'UPDATE locations SET cnt = cnt + 1 WHERE userid = ? AND day = ? AND loc = ?';
const INCREMENT_COUNTRY = 'UPDATE countries SET cnt = cnt + 1 WHERE userid = ? AND day = ? AND country = ?';
const INSERT_UNIQUE_IP = 'INSERT INTO uniqueIps (userid, day, timeframe, ip) VALUES (?, ?, ?, ?)'

// default options
const OPTIONS = {
	prepare: true
};

// execute a query and return catched errors
const executeSafe = async (...args) => {
	try {
		await client.execute(...args)
	} catch(err) {
		return err;
	}
};

// i is for debugging only (a.k.a. for ever)
let i = 0;
// add an entry to all tables
db.addEntry = async entry => {
	// still debugging
	console.log('add', i++);

	// rawdata values
	const insertEntryParams = [USER_ID, entry.ip, entry.country, entry.loc, entry.id, entry.uri, entry.day];

	// run the different queries
	const result = await Promise.all([
		executeSafe(INSERT_RAWDATA1, insertEntryParams, OPTIONS),
		executeSafe(INSERT_RAWDATA2, insertEntryParams, OPTIONS),
		executeSafe(INSERT_RAWDATA3, insertEntryParams, OPTIONS),
		executeSafe(INCREMENT_LOCATION, [USER_ID, entry.day, entry.loc], OPTIONS),
		executeSafe(INCREMENT_COUNTRY, [USER_ID, entry.day, entry.country], OPTIONS),
		executeSafe(INSERT_UNIQUE_IP, [USER_ID, entry.day, Math.floor(entry.timestamp / TIMEFRAME_SIZE) * TIMEFRAME_SIZE, entry.ip], OPTIONS),
	])

	// really? no comment needed
	return result;
};

const SELECT_LOCATIONS = 'SELECT loc, cnt FROM locations WHERE userid = ? AND day = ?';
db.getLocations = async date => {
	const locations = await client.execute(SELECT_LOCATIONS, [USER_ID, date], OPTIONS);
	return locations;
};

const SELECT_SERVERS = 'SELECT timeframe, COUNT(*) FROM uniqueIps WHERE userid = ? AND day = ? GROUP BY timeframe';
db.getServers = async date => {
	const servers = await client.execute(SELECT_SERVERS, [USER_ID, date], OPTIONS);
	return servers;
};

const SELECT_COUNTRIES = 'SELECT country, cnt FROM countries WHERE userid = ? AND day = ?';
db.getCountries = async date => {
	const countries = await client.execute(SELECT_COUNTRIES, [USER_ID, date], OPTIONS);
	return countries;
};
