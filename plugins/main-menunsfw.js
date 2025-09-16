    const creador = ['5216631288816']

let handler = async (m, { conn, usedPrefix: _p }) => {
  try {
    const senderNumber = m.sender.replace(/[^0-9]/g, '')

    if (!creador.includes(senderNumber)) {
      return conn.sendMessage(
        m.chat,
        { text: '❌ Solo el creador del comando puede usar este comando.' },
        { quoted: m }
      )
    }

    let nsfwHelp = Object.values(global.plugins)
      .filter(p => p?.tags?.includes('nsfw') && !p.disabled)
      .map(p => {
        let helpText = Array.isArray(p.help) ? p.help[0] : p.help;
        return `🔞 ${_p}${helpText}`;
      })
      .join('\n');

    let menuText = `
╭━━━『🔞 NSFW 』━━━╮
┃ 🔥 Aquí tienes los comandos NSFW
┃ 💥 Usa con responsabilidad
╰━━━━━━━━━━━━━━━━━━━━━━╯

${nsfwHelp}

👑 © ⍴᥆ᥕᥱrᥱძ ᑲᥡ  ➳𝐁𝐫𝐚𝐲𝐚𝐧𝐎𝐅𝐂ღ 
`.trim()

    await m.react('🔞')

    let imgBuffer = await (await fetch('https://files.catbox.moe/vs2w90.jpg')).buffer()
    let media = await prepareWAMessageMedia({ image: imgBuffer }, { upload: conn.waUploadToServer })

    let msg = generateWAMessageFromContent(m.chat, {
      viewOnceMessage: {
        message: {
          imageMessage: {
            ...media.imageMessage,
            caption: menuText,
            contextInfo: {
              isForwarded: true,
              forwardedNewsletterMessageInfo: {
                newsletterJid: '120363394965381607@newsletter',
                newsletterName: '𝚅𝙴𝙶𝙴𝚃𝙰-𝙱𝙾𝚃-𝙼𝙱 • Update',
                serverMessageId: 101
              }
            }
          }
        }
      }
    }, { userJid: m.sender, quoted: m })

    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })

  } catch (e) {
    conn.reply(m.chat, `✖️ Menú NSFW falló.\n\n${e}`, m)
    console.error(e)
  }
}

handler.help = ['menunsfw']
handler.tags = ['creador']
handler.command = ['menunsfw', 'menuerotico']
handler.register = true
handler.estrellas = 9

export default handler

