// reference: http://www.rapidtables.com/convert/color/hsv-to-rgb.htm
// the variables and formula are inspired by the website above
module.exports = (h, s, v) => {
  const c = v * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = v - c;

  let rTemp = 0;
  let gTemp = 0;
  let bTemp = 0;

  switch (true) {
    case 0 <= h && h < 60:
      rTemp = c;
      gTemp = x;
      break;
    case 60 <= h && h < 120:
      rTemp = x;
      gTemp = c;
      break;
    case 120 <= h && h < 180:
      gTemp = c;
      bTemp = x;
      break;
    case 180 <= h && h < 240:
      gTemp = x;
      bTemp = c;
      break;
    case 240 <= h && h < 300:
      rTemp = x;
      bTemp = c;
      break;
    case 300 <= h && h < 360:
      rTemp = c;
      bTemp = x;
      break;
  }

  const r = Math.ceil((rTemp + m) * 255);
  const g = Math.ceil((gTemp + m) * 255);
  const b = Math.ceil((bTemp + m) * 255);

  // console.log(r, g, b);

  let rString = r.toString(16).toUpperCase();
  if (rString.length < 2) rString = '0' + rString;

  let gString = g.toString(16).toUpperCase();
  if (gString.length < 2) gString = '0' + gString;

  let bString = b.toString(16).toUpperCase();
  if (bString.length < 2) bString = '0' + bString;

  return '#' + rString + gString + bString;
};
