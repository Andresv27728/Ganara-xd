/*───────────────────────────── 🌊🦈 𝑨𝒏𝒕𝒊-𝑳𝒊𝒏𝒌 𝑮𝒂𝒘𝒓 𝑮𝒖𝒓𝒂 🐚✨ ─────────────────────────────*/

const groupLinkRegex = /chat.whatsapp.com\/(?:invite\/)?([0-9A-Za-z]{20,24})/i
const channelLinkRegex = /whatsapp.com\/channel\/([0-9A-Za-z]+)/i

export async function before(m, { conn, isAdmin, isBotAdmin }) {
  if (!m || !m.text) return
  if (m.isBaileys && m.fromMe) return !0
  if (!m.isGroup) return !1
  if (!isBotAdmin) return

  let chat = global.db?.data?.chats?.[m.chat]
  if (!chat || !chat.antiLink) return !0

  // 🦈 Detectamos links de grupos o canales
  let isGroupLink = m.text.match(groupLinkRegex)
  let isChannelLink = m.text.match(channelLinkRegex)

  if ((isGroupLink || isChannelLink) && !isAdmin) {
    if (isBotAdmin) {
      try {
        const linkThisGroup = `https://chat.whatsapp.com/${await conn.groupInviteCode(m.chat)}`
        if (isGroupLink && m.text.includes(linkThisGroup)) return !0
      } catch (error) {
        console.error("🌊 [Error Sharky] No se pudo obtener el código del grupo:", error)
      }
    }

    // 🐚 Aviso con estilo Gura
    await conn.reply(
      m.chat,
      `🦈 *Anti-Link Activado* 🌊\n\n> El pequeño tiburón detectó un enlace sospechoso...  
> ✦ Usuario: @${m.sender.split`@`[0]}  
> ❌ No permitimos enlaces de *${isChannelLink ? 'Canales' : 'Otros Grupos'}* aquí.  
> 🌊 ¡Hasta pronto, marinero desobediente! 🐚✨`,
      null,
      { mentions: [m.sender] }
    )

    if (isBotAdmin) {
      try {
        // 🦈 Eliminamos el mensaje y expulsamos al usuario
        await conn.sendMessage(m.chat, { delete: m.key })
        await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
        console.log(`🦈 Usuario ${m.sender} expulsado del grupo ${m.chat}`)
      } catch (error) {
        console.error("🐚 No se pudo eliminar el mensaje o expulsar al usuario:", error)
      }
    }
  }

  return !0
}
