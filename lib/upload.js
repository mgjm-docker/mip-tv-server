'use strict';

// import modules
const ottoJSON = require('./otto-json');
const db = require('./db');
const PromiseMap = require('./promise-map');

// fake geoip
const getGeoip = async ip => {
	return {
		location: {lat: 1, long: 2},
		country: 'Hier',
	};
};

// add a single entry to the database
const addEntry = async entry => {
	// time related attributes
	entry.timestamp *= 1000;
	entry.day = new Date(entry.timestamp);
	entry.id = db.timeUUID(entry.day);

	// uri contains the type and the url
	entry.uri = JSON.stringify([entry.type, entry.url]);

	// find the geo location
	const geoip = await getGeoip(entry.ip)
	entry.loc = geoip.location;
	entry.country = geoip.country;

	// actualy add the entry
	return await db.addEntry(entry);
};

// is a variable not undefined
const IS_NOT_UNDEFINED = v => v !== undefined;

// catch errors and return them
const addEntrySafe = async entry => {
	try {
		const result = (await addEntry(entry)).filter(IS_NOT_UNDEFINED);
		if(result.length !== 0)
			return result;
	} catch(err) {
		return err;
	}
};

// the main upload function
module.exports = async (req, res, data) => {
	// convert otto json to normal json
	const entries = ottoJSON(data);
	console.log('upload', entries.length);

	// run addEntry with every entry but only 20 at the same time
	const result = (await PromiseMap(entries, addEntrySafe, {concurrency: 20})).filter(IS_NOT_UNDEFINED);
	console.log('uploaded', result);
};
