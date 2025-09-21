// 🌊🦈 Sistema Diario Oceánico de Gawr Gura 🦈🌊
const cooldown = 12 * 60 * 60 * 1000 // ⏳ 12 horas

var handler = async (m, { conn, isPrems }) => {
  const user = global.db.data.users[m.sender]
  const now = Date.now()

  // ⏳ Verificación de cooldown
  if (user.lastclaim && now - user.lastclaim < cooldown) {
    const timeLeft = msToTime(cooldown - (now - user.lastclaim))
    return conn.reply(m.chat, `🌊 *Banco Marino de Gura bloqueado*\n\n🦈 Vuelve en: *${timeLeft}*`, m)
  }

  // 🐟 Recompensas aleatorias
  const dragones = pickRandom([500, 700, 1000, 1500, 2000, 3000, 5000]) 
  const exp = isPrems
    ? pickRandom([1500, 2000, 2500, 3000, 4000])
    : pickRandom([700, 900, 1200, 1500, 1800])
  const diamonds = pickRandom([1, 2, 3, 4, 5])

  // 💾 Guardar en el perfil
  user.dragones = (user.dragones || 0) + dragones
  user.exp = (user.exp || 0) + exp
  user.diamond = (user.diamond || 0) + diamonds
  user.lastclaim = now

  // 📜 Mensaje decorado
  return conn.reply(m.chat, `
╭━━━〔 🦈💙 𝙍𝙀𝘾𝙊𝙈𝙋𝙀𝙉𝙎𝘼 𝙂𝙐𝙍𝘼 〕━━━╮
🌊 ᴜsᴜᴀʀɪᴏ: *@${m.sender.split("@")[0]}*
✨ ᴘʀᴇᴍɪᴜᴍ: *${isPrems ? '✅ Sí, Tiburoncito VIP' : '❌ No, Nadador Básico'}*
╰━━━━━━━━━━━━━━━━━━━━━━━╯

🐟 ᴅʀᴀɢᴏɴᴇs (ᴍᴏɴᴇᴅᴀs): *+${dragones}*
💎 ᴅɪᴀᴍᴀɴᴛᴇs: *+${diamonds}*
📘 ᴇxᴘ ᴅᴇ ɢᴜʀᴀ: *+${exp}*
━━━━━━━━━━━━━━━━━━━━━━━
🕐 Próxima inmersión en 12 horas.
💙 𝙂𝙖𝙬𝙧 𝙂𝙪𝙧𝙖 𝙥𝙧𝙤𝙩𝙚𝙜𝙚 𝙩𝙪 𝙤𝙘é𝙖𝙣𝙤 🌊
`, m, { mentions: [m.sender] })
}

handler.help = ['daily', 'claim']
handler.tags = ['rpg']
handler.command = ['daily', 'claim']

export default handler

// 🎲 Función de aleatoriedad marina
function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)]
}

// ⏳ Conversor de tiempo a formato bonito
function msToTime(duration) {
  const hours = Math.floor(duration / 3600000)
  const minutes = Math.floor((duration % 3600000) / 60000)
  const seconds = Math.floor((duration % 60000) / 1000)
  return `${hours}h ${minutes}m ${seconds}s`
}
