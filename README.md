# Box-opener
Opens most boxes. Specifically, it'll reuse any item that produces an item in your inventory, thus it works with Rootstock recipes as well. Forked from Fruit's [Box-opener](https://github.com/soler91/box-opener). Load/unload pattern based off [Pinkpi's](https://github.com/pinkipi) rootbeer script.

### Dependencies
Uses Pinkie Pie's [command](https://github.com/pinkipi/command) module. If you don't have it, just get it, seriously.

### Usage
First enter `!openbox` or `!cook` into the chat (or simply `openbox`/`cook` into the proxy command chat). Then use a box or recipe from inventory (not from your shortcut bar).

If you move, the module will automatically pause. Simply reuse the box or recipe.

Running out of boxes or ingredients (or using a recipe in the wrong area) stops and disables the module.

### Issues
Using an item from the shortcut bar without actually having it may send a C_USE_ITEM or C_GACHA_TRY packet once. Just don't do it.

There's a lot of things that can interfere with the module, mainly looting or spam-opening your inventory, so just sit still.
