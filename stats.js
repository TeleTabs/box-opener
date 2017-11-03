const BLACKLIST = []

class Stats {

  constructor(dispatch, command) {
    this.command = command
    this.dispatch = dispatch

    this.name = ''
    this.hooks = []
    this.loot = {}
    this.lootid = 0

    dispatch.hook('S_LOGIN', 2, event => {this.name = event.name})
  }

  hook() {this.hooks.push(this.dispatch.hook(...arguments))}

  start() {
    this.hook('S_SYSTEM_MESSAGE_LOOT_ITEM', 1, {order: 100}, event => {
      if (!this.lootid) this.lootid = event.sysmsg.split('\u000b')[0]
      let {item, amount} = event
      if (BLACKLIST.includes(item)) return false
      this.loot[item] = amount + (this.loot[item] || 0)
      return false
    })
  }

  reset() {
    this.loot = {}
    for (let h of this.hooks) this.dispatch.unhook(h)
    this.hooks = []
  }

  stop() {
    for(let item of Object.keys(this.loot).sort()) this.sysmsg(item, this.loot[item])
    this.reset()
    this.send('See system messages for total loot.')
  }

  sysmsg(item, amt) {
    let msg = [this.lootid, 'UserName', this.name, 'ItemAmount', amt, 'ItemName', '@item:'+item]
    this.dispatch.toClient('S_SYSTEM_MESSAGE_LOOT_ITEM', 1, {
      item: item, unk1: 0, amount: amt,
      unk2: 0, unk3: 0, unk4: 0, unk5: 0, unk6: 0, unk7: 0,
      sysmsg: msg.join('\u000b')
    })
  }

  send(msg) {this.command.message(msg, 'OpenBox-Stats')}
}

module.exports = function Require(dispatch, command) {
  return new Stats(dispatch, command)
}
