# todos
+ Standardize names
  + Having all emit names contain the word 'emit' probably isn't necessary hah
  + 'cell' or 'tile'? 
+ captains..??? (in the future)

+ Figure out how to get a function description to show when you hover over it
+ Not totally needed, but gameStatus could be controlled via store
+ Allow for ship placement to use computer keys (MEDIUM)
+ Allow for use of computer keys instead of clicking when attacking
+ toggleCoordinates is copy/pasted in all three boards. It's the same logic each time (but different boards). It doesn't make sense to be in "store", I don't think (no logic being shared BETWEEN components). But is there a more DRY way of doing it?
  + I guess emitting to App.js, which would have an array of all boards that have a toggle? But... your way seems OK... Something to think about anyway. 
+ sounds!
  + In Ableton, FUNKWELL LEAD with major/minor triads
  + playerMove  [snare]
  + playerPlace [cymbal]
  + playerRotate[trombone]
  + playerHit   [major-triad]
  + playerMiss  [low-note]
  + playerSink  [happy-melody] Like a microwave song
  + playerWin   [super-happy-melody]
  + enemyHit    [minor-triad]
  + enemyMiss   [lower-note]
  + enemySink   [sad-melody]
  + enemyWin    [even-sadder-melody]
+ More fun sciency looking stuff. Hit percentages. Percentage to land next hit 
+ Style form
+ Research :has() in CSS. Alternative for Firefox?
+ If ship was destroyed, add visual marker 
  + (probably easy... kind of indirect, but use the DestroyedShipList and loop through and add a style to each of the tiles that has the class of that ship)



# known bugs
+ If it hits 8-9, and 7 is open, when it cycles back to 7, it will (in one turn) hit both 7 and another tile
  + No real idea why right now. Would this be the case on all Right-hand-side ships? 
+ If it his 1, and goes to the right, 0 never gets hit. 
  + You solved this error, I guess for 2, 3, 4, etc. But for some reason not 1.
  + Starting on 2 with 5 hit already didn't go to 1
  + See your error message: //TODO: I thought this would solve an error, but it might not. If not, delete.
+ ShipPlacer movement logic does not work with a one-tile ship (solution: don't use a one tile ship)
+ still a splitting bug with rotate. See image "Screenshot 2022-12-11 at 16.43.57" to recreate


# next time...
+ There's no logic for recognizing a player ship has been sunk. Add that and emit accordingly

+ Continue with the DestroyedShipsList component OR

+ Continue work on Announcements
  + Adding time (Date.now())
  + Make the holder scroll/resize more nicely
  + Randomize messages
    + Hard part might be using SHIP.NAME to replace a placeholder when you are sinking.
      + Easy I think: sentences[1].replace('SHIP_NAME', 'Battleship');
    + There will also be props being sent around to two places when a ship is sunk (destroyed ship list and announcements) 

+ Make a function for "Register Attack" in BoardDefense.
  + Include register 'hit' or 'miss'
  + Include adding to 'lastSuccessfulEnemyAttack'
  + Include pushing to enemyAttacks
  + Include emitting announcement to App


# notes
+ If you ever need to, try to use "store" to pass data between siblings
+ utilizing break or continue, instead of return could helpful in your more complicated loops


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


+ CONTINUE figuring out how to do rotation (BIG)
  + Still buggy AF
  + You're a little unclear about when/how to reset a loop when you reach an illegal number, etc.
  + Also, you're console.tabling some useful stuff. Some of the numbers might be a little off (esp with negatives?). See if it matters. 
+ let human finalize their ship placement (SMALL)
+ let human place own ship
  + easiest way is with a form, I guess. 
  + Show this instead of the attackBoard
  + Right now, I'm randomizing initial ship placement. 
    + Need to look for ship overlap when making select form
  + What I think you can do is try to use "store" here. 
    + Very clear docs: https://vuejs.org/guide/scaling-up/state-management.html#simple-state-management-with-reactivity-api
    + Unclear if you want to initialize values in store. Initalize them in BoardDefense. Or initialize them in ShipPlacer. See what makes the most sense... 
    + UPDATE: Wait, maybe store doesn't make sense. Because after gameStatus is not placeShips, you never use ShipPlacer again.
    + So instead, maybe you want shipPlacer to place its own ships on its own board. Or you want... to simply pass the data from shipPlacer to DefenseBoard
+ Continuing with below:
  + Try to make handleDown actually handle all of the directions. 
    + Using addend, direction as a parameter, etc.
    + Basically, you can't have 4 different functions, one for each direction.

+ Could have a toggleIndex button to show grid numbers or not

+ stylin (PROBABLY USE SCSS FOR COLOR VARIABLES AND STUFF)
  + black background
  + matrix green, (outline and good guy ships)
  + bright red (hits),
  + pylon yellow (misses),
  + orange? purple? idk (selected)
  + computer-looking text
  + scrolly text (maybe js, not stylin)
  + blinking stuff? 

+ I think in every case, you want to send the coordinate to the helper and add another sentence to your message. So, add that logic in announcements.  DONE-ish
+ The enemy will have to emit for each variation of an attack. Later, this can be combined into its own method (that's in your todos). But for now, you can emit each time the new announcement is GENERATED 


# Removed code
+ Using select for rows/columns
```
<!-- ROW -->
<select>
  <template v-if="this.alignment === 'vertical'">
    <option v-for="n in 10">{{ n }}</option>
  </template>
  <template v-else>
    <option>TODO</option>
  </template>
</select>

<!-- COLUMN -->
<select>
  <template v-if="this.alignment === 'horizontal'">
    <option v-for="n in 10">{{ n }}</option>
  </template>
  <template v-else>
    <option>TODO</option>
  </template>
</select>
```

+ Randomizing alphabet (you're using numbers 0-99, rather than A1-J9 or whatever)
```
export const createAlphabet = (howManyLetters) => {
  const alpha = Array.from(Array(howManyLetters)).map((e, i) => i + 65);
  const alphabet = alpha.map((x) => String.fromCharCode(x));
  return alphabet;
};
```

+ Not working scrolling text
```
  // watch: {
  //   announcement() {
  //     for (let i = 0; i < this.announcement.length; i++) {
  //       console.log(this.announcement, this.announcement.length, this.announcement[i]);
  //       setTimeout(() => {
  //         this.scrollingAnnouncement += this.announcement[i];
  //       }, 500);
  //     }
  //   },
  // },
  ```
