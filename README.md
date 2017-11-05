# Box-opener/inven-stuff
A branch of the [box-opener](https://github.com/Some-AV-Popo/box-opener/tree/master) for messing around with inventory stuff. Why? Because I'm bored.

Saves the inventory and checks if you actually have the item before attempting to use it in order to avoid extra packets like C_GACHA_TRY from being sent. Probably doesn't matter much, but the TERA community will complain about or make fun of anything (like the fact that this branch even exists).

Also while it's opening boxes, I decided to prevent you from spam re-opening your inventory (you can still close it if it's already open). Once it stops or pauses, you can open it again.

### Dependencies
Uses Pinkie Pie's [command](https://github.com/pinkipi/command) module. Just get it.

### Usage
`!box` or `!cook` then use a box or recipe. Moving pauses the module, just reuse the box or recipe in that case. Running out of boxes or ingredients (or using a recipe in the wrong area) stops and disables the module.

`!boxdelay ms` to change delay (in milliseconds) before using next item/box. Set it to 0 for no delay.

## Stuff
* Maybe I should delete this branch ... or replace master with it ... meh
