// créditos y creador de código BrayanOFC Y Modificado Por xzzys26
// 🦈 Re-decorado por ChatGPT con temática de Gawr Gura 🌊✨
import { xpRange } from '../lib/levelling.js'
import ws from 'ws'
import { generateWAMessageFromContent, prepareWAMessageMedia } from '@whiskeysockets/baileys'
import fetch from 'node-fetch'

// Nombre y datos base
const botname = global.botname || '🦈💙 𝙂𝙐𝙍𝘼-𝙎𝙃𝘼𝙍𝙆-𝙈𝘿 🌊✨'
const creador = '+573133374132'
const versionBot = '3.0' // cámbiala si quieres

// Categorías decoradas con Gura
let tags = {
  'serbot': '🦈 𝗦𝗨𝗕-𝗚𝗨𝗥𝗔𝗕𝗢𝗧𝗦',
  'info': '🌊 𝗜𝗡𝗙𝗢𝗦',
  'main': '📜 𝗠𝗘𝗡𝗨 𝗢𝗖𝗘𝗔𝗡𝗢',
  'nable': '⚡ 𝗠𝗢𝗗𝗢 𝗧𝗜𝗕𝗨𝗥𝗢𝗡',
  'cmd': '📝 𝗖𝗢𝗠𝗔𝗡𝗗𝗢𝗦',
  'advanced': '✨ 𝗣𝗢𝗗𝗘𝗥𝗘𝗦 𝗔𝗩𝗔𝗡𝗭𝗔𝗗𝗢𝗦',
  'game': '🎮 𝗝𝗨𝗘𝗚𝗢𝗦 𝗚𝗨𝗥𝗔',
  'rpg': '⚔️ 𝗥𝗣𝗚 𝗢𝗖𝗘𝗔𝗡𝗢',
  'group': '🏝️ 𝗚𝗥𝗨𝗣𝗢𝗦',
  'downloader': '📥 𝗗𝗘𝗦𝗖𝗔𝗥𝗚𝗔𝗦',
  'sticker': '🖼️ 𝗦𝗧𝗜𝗖𝗞𝗘𝗥 𝗚𝗨𝗥𝗔',
  'audio': '🔊 𝗔𝗨𝗗𝗜𝗢',
  'search': '🔎 𝗕𝗨𝗦𝗤𝗨𝗘𝗗𝗔',
  'tools': '🧰 𝗛𝗘𝗥𝗔𝗠𝗜𝗘𝗡𝗧𝗔𝗦',
  'fun': '🎉 𝗗𝗜𝗩𝗘𝗥𝗦𝗜𝗢𝗡 𝗞𝗔𝗪𝗔𝗜',
  'anime': '🧧 𝗔𝗡𝗜𝗠𝗘',
  'nsfw': '🔞 𝗡𝗦𝗙𝗪',
  'premium': '💎 𝗣𝗥𝗘𝗠𝗜𝗨𝗠 𝗦𝗛𝗔𝗥𝗞',
  'weather': '☔ 𝗖𝗟𝗜𝗠𝗔',
  'news': '📄 𝗡𝗢𝗧𝗜𝗖𝗜𝗔𝗦',
  'finance': '🏛️ 𝗙𝗜𝗡𝗔𝗡𝗭𝗔',
  'education': '📚 𝗘𝗗𝗨𝗖𝗔𝗖𝗜𝗢𝗡',
  'health': '❤️ 𝗦𝗔𝗟𝗨𝗗',
  'entertainment': '📲 𝗘𝗡𝗧𝗥𝗘𝗧𝗘𝗡𝗜𝗠𝗜𝗘𝗡𝗧𝗢',
  'sports': '⚽ 𝗗𝗘𝗣𝗢𝗥𝗧𝗘𝗦',
  'travel': '✈️ 𝗔𝗩𝗘𝗡𝗧𝗨𝗥𝗔𝗦',
  'food': '🍣 𝗖𝗢𝗠𝗜𝗗𝗔',
  'shopping': '🛍️ 𝗖𝗢𝗠𝗣𝗥𝗔',
  'productivity': '🔖 𝗣𝗥𝗢𝗗𝗨𝗖𝗧𝗜𝗩𝗜𝗗𝗔𝗗',
  'social': '📸 𝗥𝗘𝗗𝗘𝗦',
  'security': '🔱 𝗦𝗘𝗚𝗨𝗥𝗜𝗗𝗔𝗗',
  'custom': '⚙️ 𝗣𝗘𝗥𝗦𝗢𝗡𝗔𝗟'
}

let handler = async (m, { conn, usedPrefix: _p }) => {
  try {
    let userId = m.mentionedJid?.[0] || m.sender
    let user = global.db.data.users[userId] || { exp: 0, level: 1, premium: false }

    let { level } = user

    if (!global.db.data.users) global.db.data.users = {}

    let totalUsers = Object.values(global.db.data.users).filter(u => u.exp > 0).length
    let totalPremium = Object.values(global.db.data.users).filter(u => u.premium).length

    let { min, xp, max } = xpRange(level, global.multiplier || 1)

    let help = Object.values(global.plugins).filter(plugin => !plugin.disabled).map(plugin => ({
      help: Array.isArray(plugin.help) ? plugin.help : (plugin.help ? [plugin.help] : []),
      tags: Array.isArray(plugin.tags) ? plugin.tags : (plugin.tags ? [plugin.tags] : []),
      limit: plugin.limit,
      premium: plugin.premium,
    }))

    let saludo = getSaludo()
    let uptime = clockString(process.uptime() * 1000)
    let modo = global.opts?.self ? "🔒 Privado" : "🌍 Público"

    // 🌊 Bloque inicial decorado Gura
    let menuText = `
╭━━━〔 💙 *GURA-SHARK-MENU* 💙 〕━━━⬣
┃ 🦈 *Nombre*: *${botname}*
┃ 🌊 *Creador*: *${creador}*
┃ 🐟 *Estado*: *${modo}*
┃ ☁️ *Saludo*: *${saludo}*
┃ ⏳ *Uptime*: *${uptime}*
┃ 💎 *Premium*: *${totalPremium}*
┃ ⚡ *Versión*: *${versionBot}*
╰━━━━━━━━━━━━━━━━━━━━━━⬣
`

    for (let tag in tags) {
      let comandos = help.filter(menu => menu.tags.includes(tag))
      if (!comandos.length) continue

      menuText += `
╭━━━〔 ${tags[tag]} 〕━━━⬣
${comandos.map(menu => menu.help.map(help =>
  `┃ 🦈 ${_p}${help}${menu.limit ? ' 🐚' : ''}${menu.premium ? ' 🔒' : ''}`
).join('\n')).join('\n')}
╰━━━━━━━━━━━━━━━━━━━━━━⬣
`
    }

    menuText += `
> 🌊🐚 𝙂𝙪𝙧𝙖-𝙎𝙝𝙖𝙧𝙠 𝙋𝙤𝙬𝙚𝙧 𝙊𝙣 🦈✨
`

    await m.react('🦈')
    await m.react('🌊')

    let vidBuffer = await (await fetch('https://files.catbox.moe/9ifmlp.mp4')).buffer()
    let media = await prepareWAMessageMedia(
      { video: vidBuffer, gifPlayback: true },
      { upload: conn.waUploadToServer }
    )

    let msg = generateWAMessageFromContent(m.chat, {
      viewOnceMessage: {
        message: {
          videoMessage: {
            ...media.videoMessage,
            gifPlayback: true,
            caption: menuText,
            contextInfo: {
              isForwarded: true,
              forwardedNewsletterMessageInfo: {
                newsletterJid: '120363399729727124@newsletter',
                newsletterName: '🌊🦈 𝙂𝙐𝙍𝘼 𝙎𝙃𝘼𝙍𝙆-𝙈𝘿 💙',
                serverMessageId: 100
              }
            }
          }
        }
      }
    }, { userJid: m.sender, quoted: m })

    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })

  } catch (e) {
    conn.reply(m.chat, `❌ Error al mostrar el menú de Gawr Gura.\n\n${e}`, m)
    console.error(e)
  }
}

handler.help = ['menu']
handler.tags = ['main']
handler.command = ['menu', 'allmenu', 'menú']
handler.register = true

export default handler

// Funciones extra
function clockString(ms) {
  let h = Math.floor(ms / 3600000)
  let m = Math.floor(ms / 60000) % 60
  let s = Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}

function getSaludo() {
  let options = { timeZone: "America/Marigot", hour: "numeric", minute: "numeric", second: "numeric", hour12: false }
  let horaStr = new Date().toLocaleString("es-DO", options)
  let [hora] = horaStr.split(":").map(n => parseInt(n))

  let saludo
  if (hora >= 5 && hora < 12) saludo = "🌅 Buenos días marinero"
  else if (hora >= 12 && hora < 18) saludo = "☀️ Buenas tardes del océano"
  else saludo = "🌙 Buenas noches bajo el mar"

  return `${saludo} | 🕒 ${horaStr}`
}
