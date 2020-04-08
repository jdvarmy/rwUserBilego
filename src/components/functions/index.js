export const round = value => {
  return Number(Math.round(value + 'e' + 2) + 'e-' + 2);
};
