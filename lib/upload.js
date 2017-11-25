'use strict';

const ottoJSON = require('./otto-json');
const db = require('./db');
const PromiseMap = require('./promise-map');

const getGeoip = async ip => {
	return {
		location: [1, 2],
		country: 'Hier',
	};
};

const addEntry = async entry => {
	entry.timestamp *= 1000;
	entry.day = new Date(entry.timestamp);
	entry.id = db.timeUUID(entry.day);
	entry.uri = JSON.stringify([entry.type, entry.url]);
	const geoip = await getGeoip(entry.ip)
	entry.loc = geoip.location;
	entry.country = geoip.country;
	return await db.addEntry(entry);
};

db.addEntrySafe = async entry => {
	try {
		await addEntry(entry);
	} catch(err) {
		return err;
	}
};

module.exports = async (req, res, data) => {
	const entries = ottoJSON(data);
	console.log('upload', entries.length);
	const result = await PromiseMap(entries, addEntry, {concurrency: 20});
	console.log('uploaded', result);
};
