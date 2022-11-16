export const createAlphabet = (howManyLetters) => {
  const alpha = Array.from(Array(howManyLetters)).map((e, i) => i + 65);
  const alphabet = alpha.map((x) => String.fromCharCode(x));
  return alphabet;
};

export const randomizeEnemyShipPlacement = (ships) => {
  let shipCoordinates = [];
  return shipCoordinates;
};

// Check North
export const checkN = (locationIndex) => {
  if (locationIndex - 10 < 0) return;
  return locationIndex - 10;
};

// Check South
export const checkS = (locationIndex) => {
  if (locationIndex + 10 > 99) return;
  return locationIndex + 10;
};

// Check West
export const checkW = (locationIndex) => {
  if (locationIndex % 10 === 0) return;
  return locationIndex - 1;
};

// Check East
export const checkE = (locationIndex) => {
  if ((locationIndex + 1) % 10 === 0) return;
  return locationIndex + 1;
};

export const DIRECTIONAL_RELATION = {
  n: {
    check: checkN,
    oppositecheck: checkS,
  },
  e: {
    check: checkE,
    oppositecheck: checkW,
  },
  s: {
    check: checkS,
    oppositecheck: checkN,
  },
  w: {
    check: checkW,
    oppositecheck: checkE,
  },
};
