export const formatNumber = (number, decimals = 2) => {
  return number !== undefined && !isNaN(number) ? Number(number).toFixed(decimals) : '';
};

export const formatPercentage = (number) => {
  if (number === undefined || isNaN(number)) return '';
  const formattedNumber = Number(number).toFixed(2);
  return `${formattedNumber > 0 ? '+' : ''}${formattedNumber}%`;
};