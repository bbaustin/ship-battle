# todos
+ ship placement overlap checker and re-do-er
+ let human place own ship
+ ai (yeahh...?)
+ move steps (copy from tic tac toe)
+ stylin
+ in BoardDefense, have the playerShips use the ship object and/or find some other way to make it register when a ship is sunk. 
+ Make a function for "Register Attack" in BoardDefense.
  + Include register 'hit' or 'miss'
  + Include adding to 'lastSuccessfulEnemyAttack'
  + Include pushing to enemyAttacks
  + Include sending announcement


# known bugs
+ If it hits 8-9, and 7 is open, when it cycles back to 7, it will (in one turn) hit both 7 and another tile
  + No real idea why right now. Would this be the case on all Right-hand-side ships? 
+ If it his 1, and goes to the right, 0 never gets hit. 
  + You solved this error, I guess for 2, 3, 4, etc. But for some reason not 1.
  + Starting on 2 with 5 hit already didn't go to 1
  + See your error message: //TODO: I thought this would solve an error, but it might not. If not, delete.


# next time...
+ Try to get turns to switch back and forth between computer and player
  + Although you could probably emit straight between BoardAttack and BoardDefense, I think it's safer and more flexible to use App.vue as a middleman, and keep an arguably arbitrary state of whose turn it is
  + So, you'll want to trigger switchPlayers() with a setTimeout when: 
    + player clicks to attack
    + computer finishes a turn (probably strangely hard to find when that happens. Good reason to make a function for that reason, so you don't have to copy/paste)
+ Make an '


# Solved?
+ ai is not handling '0' tile correctly... 
  + it can find when aiRandom()
  + the error lies in seek or destroy
    + I think it's destroy. you get "outta bounds!" before you make the 0 attack
+ major error in seek when you've already hit an adjacent ship 
+ you're duplicating some logic between tryOppositeAttack() and destroy() [after calling tryOppositeAttack()]
+ If you're on 'seek', and there are no possible attacks, it doesn't switch back to random. This is likely to happen towards the end of the game, if you happened to miss one tile. 
+ Figure out what tryOppositeAttack() should do;
  + Should it actually DO THE ATTACK?
  + Or should it return true/false values so that aiDestroy() can DO THE ATTACK
  + Right now, you're kind of mixing both, and it's not so clear to yourself.
  + Should also probably work with pen and paper nearby. 
+ Try to get the attackAnnouncement and defenseAnnouncement working.
  + Can you emit straight from child to child? (MAYBE? BUT I DID NOT)
  + Or should you use the intermediary of App (YES I DID THIS)


+ 48 was shot at. Later, it goes 68, 58, and then doesn't turn around.
+ I think these were both solved by adding the second condition in `if ((!nextAttack && nextAttack !== 0) || this.enemyAttacks.includes(nextAttack)) { ...`
