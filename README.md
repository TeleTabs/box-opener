# Box-opener
Yet another pointless box-opener that opens most boxes. It'll reuse any item that produces an item in your inventory, so it works with Rootstock recipes as well. It'll suppress the loot messages till the very end and give you a total amounts for each item once it stops.

Forked from Fruit's [Box-opener](https://github.com/soler91/box-opener). Load/unload pattern based off [Pinkpi's](https://github.com/pinkipi) rootbeer script.

### Dependencies
Uses Pinkie Pie's [command](https://github.com/pinkipi/command) module. Just get it.

### Usage
`!openbox` or `!cook` then use a box or recipe from inventory (not from your shortcut bar). Moving pauses the module, just reuse the box or recipe in that case. Running out of boxes or ingredients (or using a recipe in the wrong area) stops and disables the module.

`!boxdelay ms` to change delay (in milliseconds) before using next item/box. Set it to 0 for no delay (setTimeout does actually accept a 0 ms arg, so a 'useDelay' flag seems kinda pointless).

### Dumb Observations
It does and has always hooked S_INVEN, so spamming your inventory is probably a dumb idea.

Using some RNG boxes (where you pick from 4 slots) from the shortcut bar still trigger S_GACHA_START, even if you don't actually have them, which is a problem since this and that other box-opener sends a C_GACHA_TRY immediately after it.

Could probably enforce a small delay to check inventory before sending C_GACHA_TRY ... screw it, just don't use shit you don't have.

If you already have your inventory open and try to use a 4-slot RNG box you don't have (why are you still doing so?), it won't trigger S_INVEN at all, so good shit.
