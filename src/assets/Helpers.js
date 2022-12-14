import { ANNOUNCEMENTS, SHIP_SPECS } from './Constants';

/***********************************/
//  * * * * G E N E R A L * * * * * /
/***********************************/
export const randomizeAnnouncement = (category, shipName) => {
  let topic = ANNOUNCEMENTS[category];
  let announcement = topic.length === 1 ? topic[0] : topic[Math.floor(Math.random() * topic.length)];
  return announcement.includes('SHIP_NAME') ? announcement.replace('SHIP_NAME', shipName) : announcement;
};

export const createAttackAnnouncement = (isPlayersTurn, coordinate) => {
  return isPlayersTurn ? ANNOUNCEMENTS.PLAYER_ATTACK[0].replace('COORDINATE', coordinate) : ANNOUNCEMENTS.ENEMY_ATTACK[0].replace('COORDINATE', coordinate);
};

export const generateAnnouncement = (isPlayersTurn, coordinate, category, shipName) => {
  return `${createAttackAnnouncement(isPlayersTurn, coordinate)} ${randomizeAnnouncement(category, shipName)}`;
};

export const shortenShipName = (shipName) => {
  return shipName.slice(0, -4).split(' ').join('');
};

export const handleHit = () => {};

export const didSink = (board, shipName) => {
  let shipSize;
  // Get the ship's size
  SHIP_SPECS.forEach((ship) => {
    if (ship.name === shipName) shipSize = ship.size; // TODO: This seems not great. Can't you access by ship name, instead of looping?
  });
  console.log(board);
  let shipHitCount = 0;
  //TODO: Could do better logic here; you don't need to loop through the entire array...
  // Kind of difficult, but you actually want to mimic attacking?
  board.forEach((tile) => {
    if (tile === `${shipName} hit`) shipHitCount++;
  });
  if (shipHitCount === shipSize) {
    return shipName;
  }
  return false;
};

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
    addend: -10,
    check: checkN,
    oppositeCheck: checkS,
    oppositeDirection: 's',
  },
  e: {
    addend: 1,
    check: checkE,
    oppositeCheck: checkW,
    oppositeDirection: 'w',
  },
  s: {
    addend: 10,
    check: checkS,
    oppositeCheck: checkN,
    oppositeDirection: 'n',
  },
  w: {
    addend: -1,
    check: checkW,
    oppositeCheck: checkE,
    oppositeDirection: 'e',
  },
};
