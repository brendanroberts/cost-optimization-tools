export const PALETTE = {
  // Light to dark blues (from index.html comment palette)
  'navyblue-50': '#E6EDF5',
  'navyblue-100': '#AFC2DA',
  'navyblue-200': '#7D9BC0',
  'navyblue-300': '#4F82AB',
  'navyblue-400': '#2F6F9F',
  'navyblue-500': '#1E5D8A',
  'navyblue-600': '#12456C',
  'navyblue-700': '#0B2F4A',
  // neutrals for deep accents and text
  'navyblue-800': '#4A4F55',
  'navyblue-900': '#2E2E2E',
  // primary (brand/nav)
  navyblue: '#12456C',
  // complementary accents
  'accent-teal': '#2E8B57',
  'accent-orange': '#E68A00',
  'accent-yellow': '#F2C94C'
};

export function hexToRgba(hex, alpha = 1) {
  const h = hex.replace('#', '');
  const bigint = parseInt(h.length === 3 ? h.split('').map(c => c + c).join('') : h, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function formatUSD(n) {
  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
  } catch (e) {
    return '$' + Math.round(n).toString();
  }
}
