// créditos y creador de código BrayanOFC Y Modificado Por xzzys26
// 🦈 Re-decorado por Jules con temática de Gawr Gura 🌊✨
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
  'main': '📜 Menú Principal',
  'info': '🌊 Información',
  'game': '🎮 Juegos',
  'rpg': '⚔️ RPG & Economía',
  'anime': '🧧 Anime & Gacha',
  'downloader': '📥 Descargas',
  'tools': '🧰 Herramientas',
  'sticker': '🖼️ Stickers',
  'group': '🏝️ Grupos',
  'owner': '👑 Owner',
  'serbot': '🦈 Sub-Bots',
  'nable': '⚙️ Opciones',
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
╭━━〔 *${botname}* 〕━━⬣
┃
┃ 🦈 ¡Hola, *${m.name}*!
┃ 🌊 *Creador:* ${creador}
┃ 🐟 *Estado:* ${modo}
┃ ☁️ *Saludo:* ${saludo}
┃ ⏳ *Uptime:* ${uptime}
┃ 💎 *Premium:* ${totalPremium}
┃ ⚡ *Versión:* ${versionBot}
┃
╰━━━━━━━━━━━━━━━━━━⬣

╭━━〔 *MENÚ DE COMANDOS* 〕━━⬣`

    for (let tag in tags) {
      let comandos = help.filter(menu => menu.tags.includes(tag))
      if (!comandos.length) continue

      menuText += `\n┃\n┃ *${tags[tag]}*\n`
      menuText += `${comandos.map(menu => {
        const firstCommand = menu.help[0];
        return `┃ ${_p}${firstCommand}${menu.limit ? ' 🐚' : ''}${menu.premium ? ' 🔒' : ''}`;
      }).join('\n')}`
    }

    menuText += `\n╰━━━━━━━━━━━━━━━━━━⬣\n
> 🌊🐚 *Gura-Shark Power On* 🦈✨`

    await m.react('🦈')

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
