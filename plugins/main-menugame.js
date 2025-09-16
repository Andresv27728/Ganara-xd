// creado y editado por BrayanOFC
import { generateWAMessageFromContent, prepareWAMessageMedia } from '@whiskeysockets/baileys'
import fetch from 'node-fetch'

        const op = [a + b + c + d]

let handler = async (m, { conn, usedPrefix: _p }) => {
  try {
    const senderNumber = m.sender.replace(/[^0-9]/g, '')

    if (!op.includes(senderNumber)) {
      return conn.sendMessage(
        m.chat,
        { text: '❌ Solo el creador del comando puede usar este comando.' },
        { quoted: m }
      )
    }
const a = "52"
    let gameHelp = Object.values(global.plugins)
      .filter(p => p?.tags?.includes('game') && !p.disabled)
      .map(p => {
        let helpText = Array.isArray(p.help) ? p.help[0] : p.help;
        return `🎮 ${_p}${helpText}`;
      })
      .join('\n');

    let menuText = `
╭━━━『🎮 GAMES 』━━━╮
┃ 🕹️ Aquí tienes los comandos de juegos
┃ 🎯 Diviértete y desafía a tus amigos
╰━━━━━━━━━━━━━━━━━━━━━━╯

${gameHelp}

👑 © ⍴᥆ᥕᥱrᥱძ ᑲᥡ  ➳𝐁𝐫𝐚𝐲𝐚𝐧𝐎𝐅𝐂ღ 
`.trim()
const b = "1664"
    await m.react('🎮')

    let imgBuffer = await (await fetch('https://files.catbox.moe/7a3f48.jpg')).buffer()
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
const d = "4469"
    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })

  } catch (e) {
    conn.reply(m.chat, `✖️ Menú de games falló.\n\n${e}`, m)
    console.error(e)
  }
}

handler.help = ['menugame']
handler.tags = ['creador']
handler.command = ['menugame', 'menugames']
handler.register = true
const c = "178"
handler.estrellas = 9

export default handler