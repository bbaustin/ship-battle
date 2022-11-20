+ overlap checker and re-do-er
+ let human place own ship
+ ai 
+ move steps (copy from tic tac toe)
+ stylin
+ in BoardDefense, consider making a "registerHit" function, which will 
  + add to this.enemyAttacks
  + mark the style as "hit"
  + eventually, run a "check if ship sunk" or "check if game won" function


# known bugs
+ ai is not handling '0' tile correctly... 
  + it can find when aiRandom()
  + the error lies in seek or destroy
    + I think it's destroy. you get "outta bounds!" before you make the 0 attack
+ major error in seek when you've already hit an adjacent ship 
+ you're duplicating some logic between tryOppositeAttack() and destroy() [after calling tryOppositeAttack()]
+ If you're on 'seek', and there are no possible attacks, it doesn't switch back to random. This is likely to happen towards the end of the game, if you happened to miss one tile. 



# When you come back!
+ Figure out what tryOppositeAttack() should do;
  + Should it actually DO THE ATTACK?
  + Or should it return true/false values so that aiDestroy() can DO THE ATTACK
  + Right now, you're kind of mixing both, and it's not so clear to yourself.
  + Should also probably work with pen and paper nearby. 
