# Box-opener
Yet another pointless box-opener that opens most boxes. It'll reuse any item that produces an item in your inventory, so it works with Rootstock recipes as well. Also suppresses the loot messages (and the RNG window if it's an RNG box) till the very end and gives you the total amounts for each item once it stops. And because I can, the module will prevent you from re-opening the inventory until its finished opening boxes or pauses.

Forked from Fruit's [Box-opener](https://github.com/soler91/box-opener). Load/unload pattern based off [Pinkpi's](https://github.com/pinkipi) rootbeer script.

### Dependencies
Uses Pinkie Pie's [command](https://github.com/pinkipi/command) module. Just get it.

### Usage
`!box` or `!cook` then use a box or recipe from inventory (not from your shortcut bar). Moving pauses the module, just reuse the box or recipe in that case. Running out of boxes or ingredients (or using a recipe in the wrong area) stops and disables the module. If for some reason you insist on using non-existent items and demand that I try to idiot-proof a box-opener, use this [branch](https://github.com/Some-AV-Popo/box-opener/tree/inven-stuff).

`!boxdelay ms` to change delay (in milliseconds) before using next item/box. Set it to 0 for no delay.

## Stuff
* If I wanted to prevent you from using items you don't have no matter what, I'd probably need to [keep the S_INVEN hook active all the time](https://github.com/Some-AV-Popo/box-opener/tree/inven-stuff) (rather than just temporarily), because who knows what dastardly combination of inputs users might try to break your modules.

* Using some RNG boxes (the ones where a window pops up) from the shortcut bar still triggers `S_GACHA_START`, even if you don't actually have them, which is a problem since this and that other box-opener sends a `C_GACHA_TRY` immediately after it.

* The `setTimeout` function does accept a 0 ms arg, so a 'useDelay' flag seems kinda pointless, unless you're doing something strange like using more setTimeouts or calls to openBox than you need like some other box-opener.

* Writing an entire [class file](https://github.com/Some-AV-Popo/box-opener/commit/cce6821ac1d04fd7544228fdf32bfbe03d909a1e) just to keep track of silly stats like number boxes opened, time elapsed, and total looted obtained seemed like overkill and is apparently the mark of a terrible programmer, so stuffing everything into one index.js seems to be the way to go.

* If you're wondering why all this unrelated stuff is here, I just wanted to give you something to read, because some people need practice in that area.

* Contact Gus for support.
