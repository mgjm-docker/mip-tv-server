'use strict';

const db = require('../db');
const hsv2rgb = require('../hsv-to-rgb');

// the following code is not the best :D
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
const COLORS = generateColors([1,1,1,1,1,1,1,1,1,1], 12);
// EOS
// end of shit

const insertRow = (array, item) => {
	let found = false;
	for(let i = 0; i < array.length; i++) {
		if(item.cnt > array[i].cnt)
				found = true;
		if(found) {
			const t = array[i];
			array[i] = item;
			item = t;
		}
	}
	if(array.length < 10)
		array.push(item);
};

module.exports = async (req, res, {date = Date.now()}) => {
	date = new Date(+date);
	console.log('get countries', date);

	const {rows} = await db.getCountries(date);
	const top10 = [];
	let sum = 0;
	for(const row of rows) {
		row.cnt |= 0;
		sum += row.cnt;
		insertRow(top10, row);
	}

	const data = [];
	const labels = [];
	let others = sum;
	for(const row of top10) {
		others -= row.cnt;
		data.push(row.cnt);
		labels.push(row.country);
	}
	const color = COLORS;
	data.push(others);
	color.push('#999');
	labels.push('Others');
	return {data, color, labels};
};
