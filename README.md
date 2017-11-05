# Box-opener
Yet another pointless box-opener that opens most boxes. It'll reuse any item that produces an item in your inventory, so it works with Rootstock recipes as well. Also suppresses the loot messages (and the RNG window if it's an RNG box) till the very end and gives you the total amounts for each item once it stops.

Forked from Fruit's [Box-opener](https://github.com/soler91/box-opener). Load/unload pattern based off [Pinkpi's](https://github.com/pinkipi) rootbeer script.

### Dependencies
Uses Pinkie Pie's [command](https://github.com/pinkipi/command) module. Just get it.

### Usage
`!box` or `!cook` then use a box or recipe from inventory (not from your shortcut bar). Moving pauses the module, just reuse the box or recipe in that case. Running out of boxes or ingredients (or using a recipe in the wrong area) stops and disables the module.

`!boxdelay ms` to change delay (in milliseconds) before using next item/box. Set it to 0 for no delay.

### Dumb Observations
* Apparently people think I don't want to hook S_INVEN, even though this module does and has always used S_INVEN. Also because of this, spamming your inventory is probably a dumb idea.

* Using some RNG boxes (where you pick from 4 slots) from the shortcut bar still triggers S_GACHA_START, even if you don't actually have them, which is a problem since this and that other box-opener sends a C_GACHA_TRY immediately after it.

* If you already have your inventory open and try to use a 4-slot RNG box you don't have (why are you still doing so?), it won't trigger S_INVEN at all, so good shit.

* Could just save a copy of the inventory items and check before sending a C_USE_ITEM ... or you could just not use shit you don't have.

* The setTimeout does accept a 0 ms arg, so a 'useDelay' flag seems kinda pointless, unless you're doing something strange like using more setTimeouts or calls to openBox than you actually need like some other box-opener.

* Writing an entire class file just to keep track of silly stats like number boxes opened, time elapsed, and total looted obtained seemed like overkill and is apparently the mark of a terrible programmer, so stuffing everything into one index.js seems to be the way to go.
