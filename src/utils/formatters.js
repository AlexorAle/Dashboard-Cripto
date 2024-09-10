// formatters.js
export const formatNumber = (number, decimals = 2) => {
  return number !== undefined ? number.toFixed(decimals) : '0.00';
};

