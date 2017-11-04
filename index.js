const Command = require('command'),
      {sysmsg} = require('tera-data-parser')

const STOPCODES = [
        'SMT_USE_ITEM_NO_EXIST', 'SMT_ITEM_MIX_NEED_METERIAL',
        'SMT_CANT_CONVERT_NOW', 'SMT_CANT_USE_ITEM_MISS_AREA', 'SMT_GACHA_CANCEL'
      ],
      BLACKLIST = []  // Stuff you don't need counted

module.exports = function OpenBox(dispatch) {
  let msgmap
  const command = Command(dispatch)

  let enabled = false,
      gotLoot = false,
      gacha = false,
      hooks = [],
      loot = {},
      inventory,
      itemid,
      timer,
      name,
      cid,
      loc

  let minDelay = 250

  command.add(['openbox', 'cook'], () => {
    if (enabled = !enabled) load()
    else stop()
  })

  command.add('boxdelay', (ms) => {minDelay = parseInt(ms, 10)})

  dispatch.hookOnce('S_CHECK_VERSION', 1, () => msgmap = sysmsg.maps.get(dispatch.base.protocolVersion))
  dispatch.hook('S_LOGIN', 2, event => ({cid, name} = event))
  dispatch.hook('C_PLAYER_LOCATION', 1, event => {
    loc = event
    if (timer) pause()
  })

  function pause() {reset(); send('Box opener paused.')}

  function stop() {
    reset()
    unload()
    enabled = false
    send('Box opener stopped.')
    // Boxes over time is a dumb stat, so let's do something just as dumb: loot totals
    for(let item in loot) lootsysmsg(item, loot[item])
    loot = {}
  }

  function reset() {
    clearTimeout(timer)
    timer = null
    itemid = null
    gacha = false
    gotLoot = false
  }

  function load() {
    reset()
    send('Box opener started.')

    // This hook doesn't save you from triggering gacha from shortcut bar, even if you don't have the box
    hook('S_INVEN', 5, event => {
      if (!itemid || !gotLoot) return
      if (event.first) inventory = []
      else if (!inventory) return
      for (let item of event.items) inventory.push(item)
      if (!event.more) {
        gotLoot = false
        let hasMore = false
        for (let item of inventory) {
          if (item.slot < 40) continue
          if (item.item === itemid) {hasMore = true; break}
        }
        if (hasMore) {
          clearTimeout(timer)
          if (!gacha) timer = setTimeout(useItem, minDelay, itemid)
        }
        else stop()
        inventory = null
      }
    })

    hook('C_USE_ITEM', 1, event => itemid = event.item)

    hook('C_GACHA_TRY', 1, () => false)

    hook('S_GACHA_START', 1, event => {
      gacha = true
      dispatch.toServer('C_GACHA_TRY', 1, {id: event.id})
      return false
    })

    hook('S_GACHA_END', 1, () => {
      clearTimeout(timer)
      timer = setTimeout(useItem, minDelay, itemid)
      return false
    })

    hook('C_RETURN_TO_LOBBY', 1, () => false)

    hook('S_SYSTEM_MESSAGE', 1, event => {
      if (STOPCODES.includes(parse(event.message))) stop()
    })

    hook('S_SYSTEM_MESSAGE_LOOT_ITEM', 1, {order: -100}, event => {
      gotLoot = itemid !== null
      let {item, amount} = event
      if (BLACKLIST.includes(item)) return false
      loot[item] = amount + (loot[item] || 0)
      return false
    })
  }

  function unload() {
    for (let h of hooks) dispatch.unhook(h)
    hooks = []
  }

  // Why is this packet so long? It's like Bern's walls of variables
  function useItem(id) {
    if (id) dispatch.toServer('C_USE_ITEM', 1, {
      ownerId: cid,
      item: id,
      id: 0,
      unk1: 0,
      unk2: 0,
      unk3: 0,
      unk4: 1,
      unk5: 0,
      unk6: 0,
      unk7: 0,
      x: loc.x1,
      y: loc.y1,
      z: loc.z1,
      w: loc.w,
      unk8: 0,
      unk9: 0,
      unk10: 0,
      unk11: 1
    })
  }

  // Not as bad, but still, such zeroes
  function lootsysmsg(item, amt) {
    let msg = [
      '@' + msgmap.name.get('SMT_LOOTED_ITEM'),
      'UserName', name,
      'ItemAmount', amt,
      'ItemName', '@item:' + item
    ]
    dispatch.toClient('S_SYSTEM_MESSAGE_LOOT_ITEM', 1, {
      item: item,
      unk1: 0,
      amount: amt,
      unk2: 0,
      unk3: 0,
      unk4: 0,
      unk5: 0,
      unk6: 0,
      unk7: 0,
      sysmsg: msg.join('\u000b')
    })
  }

  function send(msg) {command.message(msg, 'OpenBox')}

  function hook() {hooks.push(dispatch.hook(...arguments))}

  function parse(msg) {
    return msgmap.code.get(parseInt(msg.split('\u000B')[0].substr(1), 10))
  }
}
