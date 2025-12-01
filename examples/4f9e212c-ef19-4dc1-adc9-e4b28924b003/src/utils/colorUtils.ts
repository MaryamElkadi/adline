export const generateHSLColor = (isWarm = false) => {
  // Warm colors: 0-60 or 300-360 degrees
  // Cool colors: 180-300 degrees
  let hue;
  if (isWarm) {
    hue = Math.random() > 0.5 ? 
      Math.floor(Math.random() * 61) : 
      Math.floor(Math.random() * 61) + 300;
  } else {
    hue = Math.floor(Math.random() * 121) + 180;
  }
  
  const saturation = Math.floor(Math.random() * 41) + 60; // 60-100%
  const lightness = Math.floor(Math.random() * 41) + 30; // 30-70%
  
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

export const hslToHex = (hsl: string): string => {
  const match = hsl.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
  if (!match) return '#000000';
  
  const h = parseInt(match[1]);
  const s = parseInt(match[2]) / 100;
  const l = parseInt(match[3]) / 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l - c / 2;

  let r = 0, g = 0, b = 0;

  if (0 <= h && h < 60) {
    r = c; g = x; b = 0;
  } else if (60 <= h && h < 120) {
    r = x; g = c; b = 0;
  } else if (120 <= h && h < 180) {
    r = 0; g = c; b = x;
  } else if (180 <= h && h < 240) {
    r = 0; g = x; b = c;
  } else if (240 <= h && h < 300) {
    r = x; g = 0; b = c;
  } else if (300 <= h && h < 360) {
    r = c; g = 0; b = x;
  }

  const toHex = (n: number) => {
    const hex = Math.round((n + m) * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

export const hslToRgb = (hsl: string): string => {
  const hex = hslToHex(hsl);
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return 'rgb(0, 0, 0)';
  
  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);
  
  return `rgb(${r}, ${g}, ${b})`;
};