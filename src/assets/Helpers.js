export const createAlphabet = (howManyLetters) => {
  const alpha = Array.from(Array(howManyLetters)).map((e, i) => i + 65);
  const alphabet = alpha.map((x) => String.fromCharCode(x));
  return alphabet;
};

export const randomizeEnemyShipPlacement = (ships) => {
  let shipCoordinates = [];
  return shipCoordinates;
};
