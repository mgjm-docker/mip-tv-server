'use strict';

const db = require('../db');
const hsv2rgb = require('../hsv-to-rgb');

const generateColors = (data, sum) => {
	const colors = [];
	let f = 0;
	sum /= 360;
	for(let value of data) {
		value /= sum;
		f += value;
		colors.push(hsv2rgb(f - value/2, 1, 1));
	}
	return colors;
};

module.exports = async (req, res, {date = Date.now()}) => {
	date = new Date(+date);
	console.log('get countries', date);

	const countries = await db.getCountries(date);
	const data = [];
	const labels = [];
	let sum = 0;
	for(const row of countries.rows) {
		data.push(+row.cnt);
		sum += +row.cnt;
		labels.push(row.country);
	}
	const color = generateColors(data, sum);
	return {data, color, labels};
};
