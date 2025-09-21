/*───────────────────────────── 🌊🦈 𝐀𝐧𝐭𝐢-𝐋𝐢𝐧𝐤𝐬 𝐒𝐡𝐚𝐫𝐤𝐲 𝐌𝐨𝐝𝐞 🐚✨ ─────────────────────────────*/

let linkRegex = /\b((https?:\/\/|www\.)?[\w-]+\.[\w-]+(?:\.[\w-]+)*(\/[\w\.\-\/]*)?)\b/i

export async function before(m, { isAdmin, isBotAdmin, text }) {
  if (m.isBaileys && m.fromMe) return !0
  if (!m.isGroup) return !1

  const chat = global.db.data.chats[m.chat]
  const delet = m.key.participant
  const bang = m.key.id
  const bot = global.db.data.settings[this.user.jid] || {}
  const user = `@${m.sender.split`@`[0]}`
  const isGroupLink = linkRegex.exec(m.text)

  if (chat.antiLink2 && isGroupLink && !isAdmin) {
    if (isBotAdmin) {
      const linkThisGroup = `https://chat.whatsapp.com/${await this.groupInviteCode(m.chat)}`
      const linkThisGroup2 = `https://www.youtube.com/`
      const linkThisGroup3 = `https://youtu.be/`
      if (m.text.includes(linkThisGroup)) return !0
      if (m.text.includes(linkThisGroup2)) return !0
      if (m.text.includes(linkThisGroup3)) return !0
    }

    // 🦈 Mensaje sharky con estilo Gura
    await this.sendMessage(
      m.chat,
      {
        text: `🌊 *「 𝐀𝐧𝐭𝐢-𝐋𝐢𝐧𝐤𝐬 🦈 」*\n\n> ${user}, ¡oh no marinero! 🚫\nHas roto las reglas del arrecife y compartiste un enlace prohibido... 🐚✨\n\n🔱 Serás expulsado del océano Gura inmediatamente.`,
        mentions: [m.sender],
      },
      { quoted: m }
    )

    if (!isBotAdmin)
      return m.reply('⚠️ *Sharky Info:* No soy admin, así que no puedo morder (expulsar) todavía 🦈')

    if (isBotAdmin && bot.restrict) {
      // 🦈 Eliminar mensaje y expulsar
      await conn.sendMessage(m.chat, {
        delete: { remoteJid: m.chat, fromMe: false, id: bang, participant: delet },
      })
      const responseb = await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
      if (responseb[0].status === '404') return
    } else if (!bot.restrict) {
      return m.reply('🚫 *Sharky Info:* El Owner no activó la restricción, no puedo expulsar ⛔')
    }
  }

  return !0
}
