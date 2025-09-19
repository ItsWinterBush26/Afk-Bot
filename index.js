const mineflayer = require('mineflayer')
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder')
const { GoalBlock } = goals

const config = require('./settings.json')
const express = require('express')

const app = express()

app.get('/', (req, res) => {
  res.send('Bot is running')
})

app.listen(8000, () => {
  console.log('server started')
})

function createBot() {
  const bot = mineflayer.createBot({
    username: config['bot-account']['username'],
    //password: config['bot-account']['password'],
    auth: config['bot-account']['type'], // "microsoft" or "offline"
    host: config.server.ip,
    port: config.server.port,
    version: config.server.version
  })

  // load pathfinder
  bot.loadPlugin(pathfinder)

  const mcData = require('minecraft-data')(bot.version)
  const defaultMove = new Movements(bot, mcData)

  bot.once('spawn', () => {
    console.log('\x1b[33m[AfkBot] Bot joined to the server\x1b[0m')

    // 🔑 Auto-auth
    if (config.utils['auto-auth'].enabled) {
      console.log('[INFO] Started auto-auth module')
      const password = config.utils['auto-auth'].password
      setTimeout(() => {
        bot.chat(`/register ${password} ${password}`)
        bot.chat(`/login ${password}`)
      }, 500)
      console.log(`[Auth] Authentication commands executed.`)
    }

    // 💬 Auto chat messages
    if (config.utils['chat-messages'].enabled) {
      console.log('[INFO] Started chat-messages module')
      const messages = config.utils['chat-messages']['messages']

      if (config.utils['chat-messages'].repeat) {
        let i = 0
        const delay = config.utils['chat-messages']['repeat-delay'] * 1000
        setInterval(() => {
          bot.chat(messages[i])
          i = (i + 1) % messages.length
        }, delay)
      } else {
        messages.forEach((msg) => bot.chat(msg))
      }
    }

    // 🗺️ Move to position
    const pos = config.position
    if (pos.enabled) {
      console.log(
        `\x1b[32m[AfkBot] Moving to target location (${pos.x}, ${pos.y}, ${pos.z})\x1b[0m`
      )
      bot.pathfinder.setMovements(defaultMove)
      bot.pathfinder.setGoal(new GoalBlock(pos.x, pos.y, pos.z))
    }

    // ⛏️ Anti-AFK
    if (config.utils['anti-afk'].enabled) {
      bot.setControlState('jump', true)
      if (config.utils['anti-afk'].sneak) {
        bot.setControlState('sneak', true)
      }
    }
  })

  // 📜 Chat log
  bot.on('messagestr', (msg) => {
    if (config.utils['chat-log']) {
      console.log(`[ChatLog] ${msg}`)
    }
  })

  bot.on('goal_reached', () => {
    console.log(
      `\x1b[32m[AfkBot] Bot arrived at target: ${bot.entity.position}\x1b[0m`
    )
  })

  bot.on('death', () => {
    console.log(
      `\x1b[33m[AfkBot] Bot died and respawned at: ${bot.entity.position}\x1b[0m`
    )
  })

  // 🔁 Auto-reconnect
  if (config.utils['auto-reconnect']) {
    bot.on('end', () => {
      setTimeout(() => {
        createBot()
      }, config.utils['auto-recconect-delay'])
    })
  }

  bot.on('kicked', (reason) =>
    console.log(
      '\x1b[33m',
      `[AfkBot] Kicked from server. Reason:\n${reason}`,
      '\x1b[0m'
    )
  )

  bot.on('error', (err) =>
    console.log(`\x1b[31m[ERROR] ${err.message}\x1b[0m`)
  )
}

createBot()

