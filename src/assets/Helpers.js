/***********************************/
//  * * * * G E N E R A L * * * * * /
/***********************************/
export const createAlphabet = (howManyLetters) => {
  const alpha = Array.from(Array(howManyLetters)).map((e, i) => i + 65);
  const alphabet = alpha.map((x) => String.fromCharCode(x));
  return alphabet;
};

export const randomizeAnnouncement = (announcementList) => {
  return announcementList[Math.floor(Math.random() * announcementList.length)];
};

export const shortenShipName = (shipName) => {
  return shipName.slice(0, -4).split(' ').join('');
};

export const handleHit = () => {};

/***********************************/
//  * S H I P * P L A C E M E N T * /
/***********************************/
export const prepShipPosition = (ship, alignment) => {
  // Randomize a starting row/col
  // There are ten rows/cols, so to make sure the ship doesn't go OOB, subtract the ship's size from 10.
  let rowOrCol = Math.floor(Math.random() * 10).toString();
  let rowOrColConstrained = Math.floor(Math.random() * (10 - ship.size)).toString();
  let num, addend;
  if (alignment === 'horizontal') {
    num = parseInt(rowOrCol + rowOrColConstrained, 10);
    addend = 1;
  } else {
    // vertical
    num = parseInt(rowOrColConstrained + rowOrCol, 10);
    addend = 10;
  }
  return [num, addend];
};

export const randomizeAlignment = () => {
  if (Math.floor(Math.random() * 2) === 1) return 'vertical';
  return 'horizontal';
};

export const randomizePosition = (ship, alignment, board) => {
  let prep = prepShipPosition(ship, alignment);
  let num = prep[0];
  let addend = prep[1];
  let attemptedPosition = [];
  for (let i = 0; i < ship.size * addend; i += addend) {
    let coordinate = num + i;
    if (board[coordinate] !== '') {
      // The position was already taken, so start over. Feel free to log this for debugging: (`${ship.name}: ${coordinate} was already taken`);
      return randomizePosition(ship, alignment, board);
    } else {
      // The position is untaken, so add this to the array to return.
      attemptedPosition.push(num + i);
    }
  }
  return attemptedPosition;
};

export const placeShips = (ships, board) => {
  ships.forEach((ship) => {
    let alignment = randomizeAlignment(); // 'horizontal' or 'vertical'
    let position = randomizePosition(ship, alignment, board); // Array<number>
    position.forEach((coordinate) => {
      board[coordinate] = ship.name;
    });
  });
  return board;
};

/***********************************/
//  * * * O O B * C H E C K * * *  /
//  Checks if a position in a
//  certain direction is valid.
//  If valid, it returns the coordinate
//  (Number) in that direction.
//  Otherwise, it returns false.
/***********************************/
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

/*****************************************************/
//  D I R E C T I O N A L * R E L A T I O N S H I P S /
/*****************************************************/
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
