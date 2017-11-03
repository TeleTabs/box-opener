const Command = require('command'),
      {sysmsg} = require('tera-data-parser')

const DELAY = 300,
      LOOTCODE = 'SMT_LOOTED_ITEM',
      STOPCODES = [
        'SMT_USE_ITEM_NO_EXIST', 'SMT_ITEM_MIX_NEED_METERIAL',
        'SMT_CANT_CONVERT_NOW', 'SMT_CANT_USE_ITEM_MISS_AREA', 'SMT_GACHA_CANCEL'
      ]

module.exports = function OpenBox(dispatch) {
  const command = Command(dispatch)

  let msgmap,
      enabled = false,
      hasMore = false,
      gotLoot = false,
      hooks = [],
      inventory,
      gachaid,
      itemid,
      timer,
      cid,
      loc

  dispatch.hookOnce('S_CHECK_VERSION', 1, () =>
    msgmap = sysmsg.maps.get(dispatch.base.protocolVersion).code
  )

  command.add(['openbox', 'cook'], () => {
    if (enabled = !enabled) load()
    else stop()
  })

  dispatch.hook('S_LOGIN', 1, event => cid = event.cid)
  dispatch.hook('C_PLAYER_LOCATION', 1, event => {
    loc = event
    if (timer) pause()
  })

  function stop() {
    reset()
    unload()
    enabled = false
    send('Box opener stopped.')
  }

  function pause() {
    reset()
    send('Box opener paused.')
  }

  function reset() {
    clearTimeout(timer)
    timer = null
    itemid = null
    gachaid = null
    hasMore = false
    gotLoot = false
  }

  function load() {
    reset()
    send('Box opener started.')

    // I could probably scrap this hook if I don't care about sending an extra packet
    hook('S_INVEN', 5, event => {
      if (!itemid || !gotLoot) return
      if (event.first) inventory = []
      else if (!inventory) return
      for (let item of event.items) inventory.push(item)
      if (!event.more) {
        hasMore = false
        for (let item of inventory) {
          if (item.slot < 40) continue
          if (item.item === itemid) {hasMore = true; break}
        }
        if (gotLoot && itemid && hasMore) {
          clearTimeout(timer)
          gotLoot = false
          if (!gachaid) timer = setTimeout(useItem, delay(), itemid)
        }
        else stop()
        inventory = null
      }
    })

    hook('C_USE_ITEM', 1, event => itemid = event.item)

    hook('C_GACHA_TRY', 1, () => false)

    hook('S_GACHA_START', 1, event => {
      gachaid = event.id
      dispatch.toServer('C_GACHA_TRY', 1, {id: event.id})
      return false
    })

    hook('S_GACHA_END', 1, () => {
      clearTimeout(timer)
      if (hasMore) timer = setTimeout(useItem, delay(), itemid)
      return false
    })

    hook('C_RETURN_TO_LOBBY', 1, () => false)

    hook('S_SYSTEM_MESSAGE', 1, event => {
      if (STOPCODES.includes(parse(event.message))) stop()
    })

    // Redundant sysmsg check is redundant
    hook('S_SYSTEM_MESSAGE_LOOT_ITEM', 1, event => {
      if (parse(event.sysmsg) === LOOTCODE && itemid) gotLoot = true
    })
  }

  function unload() {
    if (hooks.length) {
      for (let h of hooks) dispatch.unhook(h)
      hooks = []
    }
  }

  function useItem(id) {
    if (!id) return
    dispatch.toServer('C_USE_ITEM', 1, {
      ownerId: cid, item: id,
      id: 0, unk1: 0, unk2: 0, unk3: 0,
      unk4: 1, unk5: 0, unk6: 0, unk7: 0,
      x: loc.x1, y: loc.y1, z: loc.z1, w: loc.w,
      unk8: 0, unk9: 0, unk10: 0,  unk11: 1
    })
  }

  function send(msg) {command.message(msg, 'OpenBox')}

  function hook() {hooks.push(dispatch.hook(...arguments))}

  function delay() {return Math.floor(Math.random() * 100) + DELAY}

  function parse(msg) {
    return msgmap.get(parseInt(msg.split('\u000B')[0].substr(1), 10))
  }
}
