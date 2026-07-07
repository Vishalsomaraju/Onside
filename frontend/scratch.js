const { getContrastRatio } = require('./src/utils/contrast.js');

// Transpile contrast.ts to js first or just write the raw logic
function relativeLuminance(r, g, b) {
  const [rs, gs, bs] = [r / 255, g / 255, b / 255].map(c => {
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function getContrast(hex1, hex2) {
  const c1 = [parseInt(hex1.slice(1,3),16), parseInt(hex1.slice(3,5),16), parseInt(hex1.slice(5,7),16)];
  const c2 = [parseInt(hex2.slice(1,3),16), parseInt(hex2.slice(3,5),16), parseInt(hex2.slice(5,7),16)];
  const l1 = relativeLuminance(...c1);
  const l2 = relativeLuminance(...c2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

console.log("chalkLine #3A4A3E:", getContrast("#3A4A3E", "#0B0F0C"));
console.log("chalkLine #4A5E4E:", getContrast("#4A5E4E", "#0B0F0C"));
console.log("chalkLine #556B59:", getContrast("#556B59", "#0B0F0C"));

console.log("offsideRed #D6473C:", getContrast("#D6473C", "#0B0F0C"));
console.log("offsideRed #DF4A3F:", getContrast("#DF4A3F", "#0B0F0C"));
console.log("offsideRed #E25045:", getContrast("#E25045", "#0B0F0C"));
