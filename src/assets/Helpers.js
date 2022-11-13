export const createAlphabet = (howManyLetters) => {
  const alpha = Array.from(Array(howManyLetters)).map((e, i) => i + 65);
  const alphabet = alpha.map((x) => String.fromCharCode(x));
  return alphabet;
};

export const randomizeEnemyShipPlacement = (ships) => {
  let shipCoordinates = [];
  return shipCoordinates;
};

export const checkNorth = (locationIndex) => {
  if (locationIndex - 10 < 0) return;
  return locationIndex - 10;
};

export const checkSouth = (locationIndex) => {
  if (locationIndex + 10 > 99) return;
  return locationIndex + 10;
};

export const checkWest = (locationIndex) => {
  if (locationIndex % 10 === 0) return;
  return locationIndex - 1;
};

export const checkEast = (locationIndex) => {
  if ((locationIndex + 1) % 10 === 0) return;
  return locationIndex + 1;
};
