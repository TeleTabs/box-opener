# Box-opener
Opens most boxes. Specifically, it'll reuse any item that produces an item in your inventory, thus it works with Rootstock recipes as well. Forked from Fruit's [Box-opener](https://github.com/soler91/box-opener). Load/unload pattern based off [Pinkpi's](https://github.com/pinkipi) rootbeer script.

### Dependencies
Uses Pinkie Pie's [command](https://github.com/pinkipi/command) module. If you don't have it, just get it, seriously.

### Usage
`!openbox` or `!cook` into the chat (or simply `openbox`/`cook` into the proxy command chat). Then use a box or recipe from inventory (not from your shortcut bar). If you move, the module will automatically pause. Simply reuse the box or recipe. Running out of boxes or ingredients (or using a recipe in the wrong area) stops and disables the module.

### Issues
Some RNG boxes still trigger S_GACHA_START without triggering S_INVEN, even if you don't actually have them.

It hooks does and has always hooked S_INVEN, so spamming your inventory is probably a dumb idea.
