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

    let rpgHelp = Object.values(global.plugins)
      .filter(p => p?.tags?.includes('rpg') && !p.disabled)
      .map(p => {
        let helpText = Array.isArray(p.help) ? p.help[0] : p.help
        return `⚔️ ${_p}${helpText}`
      })
      .join('\n')

    let menuText = `
╭━━━『⚔️ RPG 』━━━╮
┃ 🛡️ Aquí tienes tus comandos de rol
┃ 🎲 Participa en aventuras y sube de nivel
╰━━━━━━━━━━━━━━━━━━━━━━╯

${rpgHelp}

👑 © ⍴᥆ᥕᥱrᥱძ ᑲᥡ  ➳𝐁𝐫𝐚𝐲𝐚𝐧𝐎𝐅𝐂ღ
`.trim()

    await m.react('⚔️')

    let imgBuffer = await (await fetch('https://files.catbox.moe/7rgyj0.jpg')).buffer()
    let media = await prepareWAMessageMedia(
      { image: imgBuffer },
      { upload: conn.waUploadToServer }
    )
const a = "52"
    let msg = generateWAMessageFromContent(
      m.chat,
      {
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
      },
      { userJid: m.sender, quoted: m }
    )
const b = "1664"
    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
const d = "4469"
  } catch (e) {
    conn.reply(m.chat, `✖️ Menú de RPG falló.\n\n${e}`, m)
    console.error(e)
  }
}
const c = "178"
handler.help = ['menurpg']
handler.tags = ['creador']
handler.command = ['menurpg', 'menurpgs']
handler.register = true

export default handler