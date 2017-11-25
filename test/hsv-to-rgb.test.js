const assert = require('assert');
const hsvToRgb = require('../lib/hsv-to-rgb');
function runTests() {
  assert.strictEqual(hsvToRgb(0, 0, 0), '#000000');
  assert.strictEqual(hsvToRgb(0, 0, 1), '#FFFFFF');
  assert.strictEqual(hsvToRgb(0, 1, 1), '#FF0000');
  assert.strictEqual(hsvToRgb(120, 1, 1), '#00FF00');
  assert.strictEqual(hsvToRgb(240, 1, 1), '#0000FF');
  assert.strictEqual(hsvToRgb(60, 1, 1), '#FFFF00');
  assert.strictEqual(hsvToRgb(180, 1, 1), '#00FFFF');
  assert.strictEqual(hsvToRgb(300, 1, 1), '#FF00FF');
  assert.strictEqual(hsvToRgb(0, 0, 0.75), '#C0C0C0');
  assert.strictEqual(hsvToRgb(0, 0, 0.5), '#808080');
  assert.strictEqual(hsvToRgb(0, 1, 0.5), '#800000');
  assert.strictEqual(hsvToRgb(60, 1, 0.5), '#808000');
  assert.strictEqual(hsvToRgb(120, 1, 0.5), '#008000');
  assert.strictEqual(hsvToRgb(300, 1, 0.5), '#800080');
  assert.strictEqual(hsvToRgb(180, 1, 0.5), '#008080');
  assert.strictEqual(hsvToRgb(240, 1, 0.5), '#000080');
}

runTests();
