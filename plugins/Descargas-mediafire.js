// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
// ┃  📥 MEDIAFIRE DOWNLOADER - Gawr Gura Style 🦈
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

import axios from 'axios'
import fetch from 'node-fetch'
import fg from 'api-dylux'

let free = 150
let prem = 500
const userCaptions = new Map()
const userRequests = {}

const handler = async (m, { conn, args, usedPrefix, command }) => {
  const sticker = 'https://qu.ax/Wdsb.webp'

  if (!args[0]) {
    return m.reply(
      `⚠️ *Ingresa un enlace válido de MediaFire*\n\n` +
      `✨ Ejemplo: *${usedPrefix + command}* https://www.mediafire.com/file/sd9hl31vhhzf76v/EvolutionV1.1-beta.apk/file`
    )
  }

  if (userRequests[m.sender]) {
    return await conn.reply(
      m.chat,
      `⚠️ Oye @${m.sender.split('@')[0]} 🙄\nYa estás descargando algo...\n` +
      `> Espera a que termine tu solicitud antes de pedir otra 💙`,
      userCaptions.get(m.sender) || m
    )
  }

  userRequests[m.sender] = true
  m.react('🚀')

  try {
    // ░▒▓█  INTENTOS DE DESCARGA  █▓▒░
    const downloadAttempts = [
      async () => {
        const res = await fetch(`https://api.delirius.store/download/mediafire?url=${args[0]}`)
        const data = await res.json()
        return {
          url: data.data[0].link,
          filename: data.data[0].filename,
          filesize: data.data[0].size,
          mimetype: data.data[0].mime,
        }
      },
      async () => {
        const res = await fetch(`https://api.neoxr.eu/api/mediafire?url=${args[0]}&apikey=russellxz`)
        const data = await res.json()
        if (!data.status || !data.data) throw new Error('⚠️ API Neoxr sin datos')
        return {
          url: data.data.url,
          filename: data.data.title,
          filesize: data.data.size,
          mimetype: data.data.mime,
        }
      },
      async () => {
        const res = await fetch(`https://api.agatz.xyz/api/mediafire?url=${args[0]}`)
        const data = await res.json()
        return {
          url: data.data[0].link,
          filename: data.data[0].nama,
          filesize: data.data[0].size,
          mimetype: data.data[0].mime,
        }
      },
      async () => {
        const res = await fetch(`https://api.siputzx.my.id/api/d/mediafire?url=${args[0]}`)
        const data = await res.json()
        return data.data.map(file => ({
          url: file.link,
          filename: file.filename,
          filesize: file.size,
          mimetype: file.mime,
        }))[0]
      },
    ]

    let fileData = null
    for (const attempt of downloadAttempts) {
      try {
        fileData = await attempt()
        if (fileData) break
      } catch (err) {
        console.error(`⚠️ Error en intento: ${err.message}`)
        continue
      }
    }

    if (!fileData) throw new Error('❌ No se pudo descargar el archivo desde ninguna API')

    const file = Array.isArray(fileData) ? fileData[0] : fileData

    // 🦈 Mensaje decorado estilo Gawr Gura
    const caption = `
┏━━━━━━━━━━━━━━━┓
┃ 📥 𝗠𝗘𝗗𝗜𝗔𝗙𝗜𝗥𝗘 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗𝗘𝗥 🦈
┃━━━━━━━━━━━━━━━┃
┃ 🔰 *Nombre:* ${file.filename}
┃ ⚡ *Peso:* ${file.filesize}
┃ 📂 *Tipo:* ${file.mimetype}
┗━━━━━━━━━━━━━━━┛
> ⏳ *Espere un momento mientras envío su archivo...* 💙
`.trim()

    const captionMessage = await conn.reply(m.chat, caption, m)
    userCaptions.set(m.sender, captionMessage)

    await conn.sendFile(m.chat, file.url, file.filename, '', m, null, {
      mimetype: file.mimetype,
      asDocument: true,
    })

    m.react('✅')
  } catch (e) {
    await conn.sendFile(m.chat, sticker, 'error.webp', '', m)
    m.react('❌')
    console.error(e)
    handler.limit = false
  } finally {
    delete userRequests[m.sender]
  }
}

// ░▒▓█  METADATA DEL PLUGIN  █▓▒░
handler.help = ['mediafire', 'mediafiredl']
handler.tags = ['downloader']
handler.command = /^(mediafire|mediafiredl|dlmediafire)$/i
handler.register = true
handler.limit = 3

export default handler
