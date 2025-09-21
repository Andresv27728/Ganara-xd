import ws from 'ws'
import { performance } from 'perf_hooks'
import os from 'os'

let handler = async (m, { conn, usedPrefix }) => {
  // Nombre del bot (por defecto si no lo detecta)
  let botname = conn.user.name || "Gura-Bot 🦈"
  let _muptime = 0
  
  // Intentar obtener uptime del proceso principal
  if (process.send) {
    try {
      process.send('uptime')
      _muptime = await new Promise(resolve => {
        process.once('message', resolve)
        setTimeout(() => resolve(0), 1000)
      }) * 1000
    } catch (e) {
      _muptime = process.uptime() * 1000
    }
  } else {
    _muptime = process.uptime() * 1000
  }
  
  let muptime = clockString(_muptime)
  
  // Estadísticas globales
  let totalreg = Object.keys(global.db?.data?.users || {}).length || 0
  let totalchats = Object.keys(global.db?.data?.chats || {}).length || 0
  
  // Chats activos
  const chats = Object.entries(conn.chats || {}).filter(([id, data]) => data && !id.endsWith('broadcast'))
  const groups = chats.filter(([id]) => id.endsWith('@g.us'))
  const privados = chats.filter(([id]) => id.endsWith('@s.whatsapp.net'))
  
  // Velocidad
  let old = performance.now()
  let sum = 0
  for (let i = 0; i < 1000000; i++) sum += i
  let neww = performance.now()
  let speed = neww - old
  
  // Info del sistema
  let platform = os.platform()
  let totalmem = os.totalmem()
  let freemem = os.freemem()
  
  const formatMemory = (bytes) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }
  
  let vs = global.vs || '3.2.1'
  let pp = "https://files.catbox.moe/j4w56p.jpg" // 🦈 Imagen temática de Gawr Gura
  
  let estadoMsg = `
╭━━━〔 🌊 *A~ Gura Status!* 🌊 〕━━━⬣
┃ 🦈 *Bot:* ${botname}
┃ 👑 *Maestro del océano:* YO SOY YO
┃ 🪼 *Prefijo:* [ ${usedPrefix} ]
┃ 🐚 *Versión:* ${vs}
╰━━━━━━━━━━━━━━━━━━━━━━⬣

╭━━━〔 📊 *Estadísticas de la Atlántida* 📊 〕━━━⬣
┃ 💬 *Total de Chats:* ${totalchats}
┃ 🏝️ *Grupos Coral:* ${groups.length}
┃ 🐟 *Privados:* ${privados.length}
┃ 🌊 *Usuarios Registrados:* ${totalreg} 
╰━━━━━━━━━━━━━━━━━━━━━━⬣

╭━━━〔 ⚡ *Rendimiento Oceánico* ⚡ 〕━━━⬣
┃ ⏰ *Tiempo nadando:* ${muptime}
┃ 💨 *Velocidad del Tiburón:* ${speed.toFixed(3)}ms
┃ 💻 *Plataforma:* ${platform}
┃ 🐳 *Memoria usada:* ${formatMemory(totalmem - freemem)} / ${formatMemory(totalmem)}
╰━━━━━━━━━━━━━━━━━━━━━━⬣

✨ 〘 *Powered by Gawr Gura 🦈💙* 〙 ✨
`.trim()

  try {
    await conn.sendMessage(m.chat, {
      image: { url: pp },
      caption: estadoMsg,
      mentions: [m.sender]
    }, { quoted: m })
  } catch (e) {
    await conn.sendMessage(m.chat, { 
      text: estadoMsg,
      mentions: [m.sender]
    }, { quoted: m })
  }
}

handler.help = ['status']
handler.tags = ['info']
handler.command = /^(estado|status|estate|state|stado|stats)$/i
handler.register = true

export default handler

function clockString(ms) {
  let h = Math.floor(ms / 3600000)
  let m = Math.floor(ms / 60000) % 60
  let s = Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':')
}
