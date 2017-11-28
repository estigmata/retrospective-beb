'use strict';

const GOLDEN_RATIO = 0.618033988749895;
let hueRandom = Math.random();

class Color {

  static generateColor () {
    let rgbColor = {};
    hueRandom += GOLDEN_RATIO;
    hueRandom %= 1;
    rgbColor = this.hsvToRGB(hueRandom, 0.5, 0.95);
    return this.rgbToHex(rgbColor.red, rgbColor.green, rgbColor.blue);
  }

  static hsvToRGB (hue, saturation, value) {
    const hI = Math.floor(hue * 6);
    const f = hue * 6 - hI;
    const p = value * (1 - saturation);
    const q = value * (1 - f * saturation);
    const t = value * (1 - (1 - f) * saturation);
    let red = 255;
    let green = 255;
    let blue = 255;
    switch (hI) {
    case 0:
      red = value; green = t; blue = p;
      break;
    case 1:
      red = q; green = value; blue = p;
      break;
    case 2:
      red = p; green = value; blue = t;
      break;
    case 3:
      red = p; green = q; blue = value;
      break;
    case 4:
      red = t; green = p; blue = value;
      break;
    case 5:
      red = value; green = p; blue = q;
      break;
    }
    return { red: Math.floor(red * 256), green: Math.floor(green * 256), blue: Math.floor(blue * 256) };
  }

  static componentToHex (c) {
    const hexadecimal = c.toString(16);
    return hexadecimal.length === 1 ? `0${hexadecimal}` : hexadecimal;
  }

  static rgbToHex (red, green, blue) {
    return `#${this.componentToHex(red)}${this.componentToHex(green)}${this.componentToHex(blue)}`;
  }
}

module.exports = Color;
