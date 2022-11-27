export const createAlphabet = (howManyLetters) => {
  const alpha = Array.from(Array(howManyLetters)).map((e, i) => i + 65);
  const alphabet = alpha.map((x) => String.fromCharCode(x));
  return alphabet;
};

export const randomizeAnnouncement = (announcementList) => {
  return announcementList[Math.floor(Math.random() * announcementList.length)];
};

export const handleHit = () => {};

// Check North board boundary
export function checkN(locationIndex) {
  if (locationIndex - 10 < 0) return false;
  return locationIndex - 10;
}

// Check South board boundary
export function checkS(locationIndex) {
  if (locationIndex + 10 > 99) return false;
  return locationIndex + 10;
}

// Check West board boundary
export function checkW(locationIndex) {
  if (locationIndex % 10 === 0) return false;
  return locationIndex - 1;
}

// Check East board boundary
export function checkE(locationIndex) {
  if ((locationIndex + 1) % 10 === 0) return false;
  return locationIndex + 1;
}

export const DIR_REL = {
  n: {
    check: checkN,
    oppositeCheck: checkS,
    oppositeDirection: 's',
  },
  e: {
    check: checkE,
    oppositeCheck: checkW,
    oppositeDirection: 'w',
  },
  s: {
    check: checkS,
    oppositeCheck: checkN,
    oppositeDirection: 'n',
  },
  w: {
    check: checkW,
    oppositeCheck: checkE,
    oppositeDirection: 'e',
  },
};
