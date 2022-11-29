# todos
+ stylin
+ Having all emit names contain the word 'emit' probably isn't necessary hah
+ captains..??? (in the future)
+ Randomize messages
  + Hard part might be using SHIP.NAME to replace a placeholder. 
+ Figure out how to get a function description to show when you hover over it


# known bugs
+ If it hits 8-9, and 7 is open, when it cycles back to 7, it will (in one turn) hit both 7 and another tile
  + No real idea why right now. Would this be the case on all Right-hand-side ships? 
+ If it his 1, and goes to the right, 0 never gets hit. 
  + You solved this error, I guess for 2, 3, 4, etc. But for some reason not 1.
  + Starting on 2 with 5 hit already didn't go to 1
  + See your error message: //TODO: I thought this would solve an error, but it might not. If not, delete.


# next time...
+ Make messages recognizing ship destruction, and add to "sunkShips" additional message board
+ let human place own ship
  + easiest way is with a form, I guess. 
  + Show this instead of the attackBoard

+ Make a function for "Register Attack" in BoardDefense.
  + Include register 'hit' or 'miss'
  + Include adding to 'lastSuccessfulEnemyAttack'
  + Include pushing to enemyAttacks
  + Include sending announcement (currently not happening)


# notes
+ If you ever need to, try to use "store" to pass data between siblings


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
+ Try to get turns to switch back and forth between computer and player
  + Although you could probably emit straight between BoardAttack and BoardDefense, I think it's safer and more flexible to use App.vue as a middleman, and keep an arguably arbitrary state of whose turn it is
  + So, you'll want to trigger switchPlayers() with a setTimeout when: 
    + player clicks to attack
    + computer finishes a turn (probably strangely hard to find when that happens. Good reason to make a function for that reason, so you don't have to copy/paste)

+ I think I did this... compare how I had to do it on BoardDefense and BoardAttack. Strange? 
+ See if you can make sense of how to use Constants. 
  + On... created, (or using .once? But I think created) make a copy of the Constant that you will use in different places. And then use that, rather than the constant itself. 
    + Object.assign https://stackoverflow.com/questions/54108402/share-constants-between-vue-components 
    + https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign

+ Easy: when you click an already clicked square, it goes to computer turn

+ Ship placement overlap checker and re-do-er
+ Also ship destruction recognition
  + A ton of ways to do this... 
  + A cool way to do this might be to add it in boardAttack
  + Like ['', '', '', '', '', 'carrier', 'carrier', 'carrier', 'carrier', 'carrier', '', ''], etc.
    + Could do string trickery here, using regex or just js. carrier_hit
    + if (tile !== ''), // do something... tile += ', hit' 
    + else { tile = 'miss' }

+ GameEnd dialog thing.
  + Use `<dialog>`? I guess so. Do you need `open` attribute? Maybe.
  + Do you need an additional emit to say who won? Or can you somehow use some logic about what component the emit came from? Look into that.
    + About this, I'm just adding an additional option to gameStatus. Feels a little cheap, but I think it's simpler. 

+ ai (yeahh...?)
+ move steps (copy from tic tac toe)
+ in BoardDefense, have the playerShips use the ship object and/or find some other way to make it register when a ship is sunk. 
