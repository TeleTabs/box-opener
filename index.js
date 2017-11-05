const Command = require('command'),
      {sysmsg} = require('tera-data-parser')

const STOPCODES = [
        'SMT_USE_ITEM_NO_EXIST', 'SMT_ITEM_MIX_NEED_METERIAL',
        'SMT_CANT_CONVERT_NOW', 'SMT_CANT_USE_ITEM_MISS_AREA', 'SMT_GACHA_CANCEL'
      ],
      // List item IDs for loot you want to ignore
      BLACKLIST = []

module.exports = function OpenBox(dispatch) {
  const command = Command(dispatch)
  let delay = 200,
  // Leave these vars alone
      msgmap, name, cid, loc,
      gotLoot = false,
      gacha = false,
      hooks = [],
      loot = {},
      inventory,
      invenLock,
      itemID,
      timer

  command.add(['box', 'cook'], () => {
    if (hooks.length) stop()
    else load()
  })

  command.add('boxdelay', (ms) => {
    if (!isNaN(ms)) delay = parseInt(ms, 10)
    send(delay? `Delay set to ${delay} ms.` : 'No delay.')
  })

  dispatch.hookOnce('S_CHECK_VERSION', 1, () => msgmap = sysmsg.maps.get(dispatch.base.protocolVersion))
  dispatch.hook('S_LOGIN', 2, event => ({cid, name} = event))
  dispatch.hook('C_PLAYER_LOCATION', 1, event => {
    loc = event
    if (timer) pause()
  })

  dispatch.hook('S_INVEN', 5, {order: -200}, event => {
    if (event.first) inventory = []
    else if (!inventory) return
    for (let item of event.items)
      if (item.slot >= 40) inventory.push(item.item)
    if (!itemID || !gotLoot) return
    if (!event.more) {
      gotLoot = false
      if (inventory.includes(itemID)) {
        clearTimeout(timer)
        if (!gacha) timer = setTimeout(useItem, delay, itemID)
      }
      else stop()
    }
  })

  function load() {
    reset()
    send('Please use a box/recipe.')

    hook('C_USE_ITEM', 1, event => {
      if (!inventory.includes(event.item)) return false
      if (!itemID) send('Opening/cooking in progress ...')
      itemID = event.item
      if (!invenLock) invenLock = dispatch.hook('C_SHOW_INVEN', 1, () => false)
    })

    hook('C_GACHA_TRY', 1, () => false)

    hook('S_GACHA_START', 1, event => {
      gacha = true
      dispatch.toServer('C_GACHA_TRY', 1, {id: event.id})
      return false
    })

    hook('S_GACHA_END', 1, () => {
      clearTimeout(timer)
      timer = setTimeout(useItem, delay, itemID)
      return false
    })

    hook('C_RETURN_TO_LOBBY', 1, () => false)

    hook('S_SYSTEM_MESSAGE', 1, event => {
      if (STOPCODES.includes(parse(event.message))) stop()
    })

    hook('S_SYSTEM_MESSAGE_LOOT_ITEM', 1, {order: -100}, event => {
      gotLoot = itemID !== null
      let {item, amount} = event
      if (BLACKLIST.includes(item)) return false
      loot[item] = amount + (loot[item] || 0)
      return false
    })
  }

  function reset() {
    clearTimeout(timer)
    timer = null
    itemID = null
    gacha = false
    gotLoot = false
    if (invenLock) dispatch.unhook(invenLock)
    invenLock = null
  }

  function pause() {
    reset()
    send('Paused. Use a box/recipe to resume.')
  }

  function stop() {
    reset()
    unload()
    send('Stopped. See system messages for loot totals.')
    // Boxes over time is a dumb stat, so let's do something just as dumb: loot totals
    for(let item in loot) lootMsg(item, loot[item])
    loot = {}
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
  function lootMsg(item, amt) {
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

  function parse(msg) {return msgmap.code.get(parseInt(msg.split('\u000B')[0].substr(1), 10))}

  function hook() {hooks.push(dispatch.hook(...arguments))}

  function unload() {
    for (let h of hooks) dispatch.unhook(h)
    hooks = []
  }
}
