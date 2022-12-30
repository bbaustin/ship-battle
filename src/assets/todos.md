# todos
+ Standardize names
  + Having all emit names contain the word 'emit' probably isn't necessary hah
  + 'cell' or 'tile'? 
+ captains..??? (in the future)
+ Keyboard
  + Allow for ship placement to use computer keys (MEDIUM)
  + Allow for attacking to use of computer keys

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
+ Allow better way for handling garbled text.
  + Now announcement returns if not finished with current message
  + Ideally, you want an "announcementQueue" 
+ Helpers should be Composables? https://vuejs.org/guide/reusability/composables.html 
+ Get a tablet view? Or at least add a few lines of CSS to make the HUD look less weird



# known bugs
+ If it hits 8-9, and 7 is open, when it cycles back to 7, it will (in one turn) hit both 7 and another tile
  + No real idea why right now. Would this be the case on all Right-hand-side ships? 
+ If it his 1, and goes to the right, 0 never gets hit. 
  + You solved this error, I guess for 2, 3, 4, etc. But for some reason not 1.
  + Starting on 2 with 5 hit already didn't go to 1
  + See your error message: //TODO: I thought this would solve an error, but it might not. If not, delete.
+ ShipPlacer movement logic does not work with a one-tile ship (solution: don't use a one tile ship)
+ still a splitting bug with rotate. See image "Screenshot 2022-12-11 at 16.43.57" to recreate
+ Not a bug really, but the AI doesn't know how to handle if ships are next to each other, and it only attacks two adjacent ends. It'll start attacking randomly without attacking the rest of the ships


# next time...
+ PICK YOUR NEXT TASK FROM BELOW

+ Make Constants from ANNOUNCEMENT keys. Some good way to do this, right? 





+ Continue work on Announcements
  + Do you want two announcement boards?
  + Allow for more than one scrolling announcement at a time
  + Make the holder scroll/resize more nicely OK
    + There will also be props being sent around to two places when a ship is sunk (destroyed ship list and announcements)  (?)

+ Change alignment dropdown to buttons




# wont do
+ Colors in announcements? (Red for enemy, green for player, and yellow for coordinate)
+ Figure out how to get a function description to show when you hover over it. Typescript thing?
+ Pretty low priority, but if you can wrangle up a way to get the yellow spotted background to go behind a red hit dot, that'd be cool 



# notes
+ If you ever need to, try to use "store" to pass data between siblings
+ utilizing break or continue, instead of return could helpful in your more complicated loops
+ could probably use scss mixin for _cell. But without it is also ok i guess
+ forEach... bad? https://danthedev.com/stop-using-foreach/ 


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
+ Tanker destroy doesn't trigger switch to random. (Easy fix?) I think it doesn't have time to switch after being destroyed in two shots 
+ Need to emit gameStatusChange from BoardDefense.
  + You're going to move didHit into HELPERS. So... you can use logic there. 
  + And/or also move didWin into HELPERS
+ Make a function for "Register Attack" in BoardDefense.
  + Include register 'hit' or 'miss'
  + Include adding to 'lastSuccessfulEnemyAttack'
  + Include pushing to enemyAttacks
  + Include emitting announcement to App
  + oppositeDirectionAttack (somewhere) is not adding to the enemyAttack array. Debug, please! NOTE: I think this is OK now 
    + make sure to check the enemyStrategy to see emit speciality messages like RELENTLESS 
+ There's no logic for recognizing a player ship has been sunk. Add that and emit accordingly
+ Randomize announcements
  + Hard part might be using SHIP.NAME to replace a placeholder when you are sinking.
    + Easy I think: sentences[1].replace('SHIP_NAME', 'Battleship');

+ You just added 'pending' game state
  + I think you kinda need that, to make sure someone doesn't click after losing
  + If that's the case, add it to the v-if's determinign what's viewable 
  

+ Finish SunkShipsDisplay! Gerd jerb earlier 
  + Last (?) step. Helpers can't $emit (it's a JS file, duh!). So... hmm... Think about if it's worth having didWin() as a helper (I think it still is)
    + If you keep it as a Helper, just call didWin() and have it return true/false, and emit from each respective board
      + BETTER IDEA: gameStatus will be in Store. And so you can update store. 
        + Might add a 'pending' state
  + All you gotta do is have BoardDefense push to store when didSink(), and also adjust to use HELPERS.didWin(isPlayersTurn *false*) 
  + Prev notes (done):
    + sunkShips actually might be something to be controlled by store: YES
      + shared with SunkShipsDisplay
      + right now, didWin is in both boards and emitting game-status-change
+ Download GitLens

+ EnemyIntelDisplay
  + The only tricky one is nextAttackCoordinate, because ...coordinate doeesn't always exist 
  + From BoardDefense, need to emit the following to App:
    + enemyAttacks
      + From this, you can create: 
        + lastEnemyAttack (enemyAttacks.at(-1))
        + nextAttackSuccessLikelihood ((100 - enemyAttacks.length) / 100)
    + enemyStrategy
    + enemyAttackPlan
    + lasSuccessfulEnemyAttack
  + More fun sciency looking stuff. Hit percentages. Percentage to land next hit 
+ Style form
+ Make buttons a little triangle shape
  + You can do this fairly easily with an extra div
    + I wonder if you can use grid or something? IDK, it's probably not worth haha
+ Research :has() in CSS. Alternative for Firefox?
  + So for this, I will add a toggle class on... everything? Or anything that's not blank?
  + And add styles to this class in the main style.css
  + With this, see if you can componentize Toggle Button

  + If ship was destroyed, add visual marker 
  + (probably easy... kind of indirect, but use the DestroyedShipList [from store] and loop through and add a style to each of the tiles that has the class of that ship)
+ Toggle Coordinates button looks weird on ShipPlacer
+ Announcement: 
  + Mashing creates garbled announcement text 
    + Ideally, you want to be able to have more than one ScrollingAnnouncement at once
  + If the text takes longer than the time the enemy takes to attack, there's garbled text
  + Solution: Hold off starting the next announcement until the current one finishes (how?)
    + See note in Announcement SetInterval
  + Or (HACKY): create longer delay for enemy attack/shorter messages
+ Scrollbar styling for Announcements
+ HUD
  + Related to HUD, smartphone styling
+ toggleCoordinates is copy/pasted in all three boards. It's the same logic each time (but different boards). It doesn't make sense to be in "store", I don't think (no logic being shared BETWEEN components). But is there a more DRY way of doing it?
  + I guess emitting to App.js, which would have an array of all boards that have a toggle? But... your way seems OK... Something to think about anyway. 


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
   watch: {
     announcement() {
       for (let i = 0; i < this.announcement.length; i++) {
         console.log(this.announcement, this.announcement.length, this.announcement[i]);
         setTimeout(() => {
           this.scrollingAnnouncement += this.announcement[i];
         }, 500);
       }
     },
   },
  ```

Next expected probability of attack in EnemyIntelDisplay 
```
// TODO: You could make this kind of cool if you used more logic from BoardDefense. But it's not really worth the work?
     nextAttacksProbabilityOfSuccess() {
       if (this.enemyIntel?.boardDefense) {
         let boardDefense = this.enemyIntel.boardDefense;
         let remainingShipTiles = 0;
         let remainingTiles = 0;
         if (this.currentEnemyAttackPattern === 'seek') return '25%';
         if (this.currentEnemyAttackPattern === 'destroy') return '50%';
          //TODO: This could have better logic for sure
         boardDefense.forEach((tile) => {
           console.log(tile);
           if (tile !== '' && !tile.includes(' hit')) remainingShipTiles++;
           else remainingTiles++;
         });
         console.log(remainingShipTiles, remainingTiles);
         return `${(remainingShipTiles / (remainingShipTiles + remainingTiles)) * 100}%`;
       }
       return 'N/A';
     },
```

+ You can use stuff like this when Firefox supports :has()
  + Currently, instead, you're using .toggled class 
```
 .cell.miss:has(span) {
   background: $green;
 }
```


NOTE: If you want arbitrary sci-fi-looking numbers you can use something like this
```
this.scienceyNumberArray.push(`#${this.announcementArray.length}-${Date.now().toString().slice(-4)}: `);
```

+ h1 in App.js
```
<h1 v-if="store.gameStatus === 'placeShips'">Welcome to Ship Battle. Place your ships!</h1>
<template v-else>
  <h1 v-if="isPlayersTurn">Player's Turn</h1>
  <h1 v-else>Computer's Turn</h1>
</template>
```

+ slots 
```
<slot name="0"></slot>
<slot name="1"></slot>
<slot name="2"></slot> -->

<!-- This works, but it won't let your Board update correctly if you swap the board out -->
<h1>big one here</h1>
<slot :name="this.activeSlot"></slot>
```


+ [MAJOR] ScrollingAnnouncement attempt
```
<template>
  <!-- BIG TODO: -->
  <!-- You had scrolling text, but it was leading to garbled text and setInterval weirdness -->
  <!-- It's not needed, really, so if you feel like it, you can come back to it here.  -->
  <section id="announcement">
    <h4>ANNOUNCEMENTS</h4>
    <p v-if="this.scrollingAnnouncement">{{ this.scrollingAnnouncement }}</p>
    <p v-for="announcement in this.announcementArray">{{ announcement }}</p>
  </section>
</template>
<script>
import { ANNOUNCEMENTS } from '../assets/Constants.js';
export default {
  props: ['announcement'],
  data() {
    return {
      announcementArray: [ANNOUNCEMENTS.WELCOME],
      isScrolling: false,
      scrollingAnnouncement: '',
    };
  },
  watch: {
    announcement() {
      // Add previous announcement to list of other previous announcements, ignoring the initial load
      if (this.isScrolling) {
        return;
      }
      if (this.scrollingAnnouncement !== '') this.announcementArray.unshift(this.scrollingAnnouncement);
      // Get ready for a new scrolling announcement
      this.scrollingAnnouncement = '';
      // Split the incoming announcement (from props) into each character
      let individualCharacters = this.announcement.split('');
      let index = 0;
      setInterval(() => {
        if (index < individualCharacters.length) {
          this.isScrolling = true;
          this.scrollingAnnouncement += individualCharacters[index++];
          console.log('lala');
        }
        console.log('titi');
      }, 10);
      console.log('yoyo');
      clearInterval();
      console.log('after');
      this.isScrolling = false;
    },
  },
};
</script>
<style lang="scss" scoped>
@use '../scss/modules/_colors' as *;
#announcement {
  font-size: 13px;
  padding: 0px 20px;
  width: 770px;
}
#announcement p:first-child {
  color: $tng_green;
}
#announcement p {
  padding: 7px 0;
}
@media screen and (min-width: 1020px) {
  h4 {
    display: none;
  }
}
</style>

```
