# Box-opener
Yet another pointless box-opener that opens most boxes. It'll reuse any item that produces an item in your inventory, thus it works with Rootstock recipes as well. Forked from Fruit's [Box-opener](https://github.com/soler91/box-opener). Load/unload pattern based off [Pinkpi's](https://github.com/pinkipi) rootbeer script.

### Dependencies
Uses Pinkie Pie's [command](https://github.com/pinkipi/command) module. Just get it.

### Usage
`!openbox` or `!cook` then use a box or recipe from inventory (not from your shortcut bar). Moving pauses the module, just reuse the box or recipe in that case. Running out of boxes or ingredients (or using a recipe in the wrong area) stops and disables the module.

`!boxdelay ms` to change delay (in milliseconds). Set it to 0 to disable the delay (setTimeout does actually accept a 0 ms arg, so a 'useDelay' flag seems kinda pointless).

### Issues
Some RNG boxes still trigger S_GACHA_START without triggering S_INVEN, even if you don't actually have them, so don't use the shortcut bar if you don't actually have the box.

It hooks does and has always hooked S_INVEN, so spamming your inventory is probably a dumb idea.
