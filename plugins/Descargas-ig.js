// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
// ┃  📥 INSTAGRAM DOWNLOADER - Gawr Gura Style 🦈
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

import fetch from 'node-fetch'
import axios from 'axios'
import { fileTypeFromBuffer } from 'file-type'

const userMessages = new Map()
const userRequests = {}

const handler = async (m, { conn, args, command, usedPrefix }) => {
  if (!args[0]) {
    return m.reply(
      `⚠️ *Ingresa el enlace del vídeo o imagen de Instagram.*\n\n` +
      `✨ Ejemplo: *${usedPrefix + command}* https://www.instagram.com/p/C60xXk3J-sb/?igsh=YzljYTk1ODg3Zg==`
    )
  }

  if (userRequests[m.sender]) {
    return await conn.reply(
      m.chat,
      `⚠️ Oye @${m.sender.split('@')[0]} ✋\nYa estás descargando algo 🙄\n` +
      `> Espera a que termine tu solicitud antes de pedir otra 🎶`,
      m
    )
  }

  userRequests[m.sender] = true
  await m.react('⌛')

  try {
    // ░▒▓█  INTENTOS DE DESCARGA  █▓▒░
    const downloadAttempts = [
      // 🌐 API 1
      async () => {
        const res = await fetch(`https://api.siputzx.my.id/api/d/igdl?url=${args[0]}`)
        const data = await res.json()
        if (!data.data?.[0]?.url) throw new Error('❌ Sin datos en API 1')

        const fileType = data.data[0].url.includes('.webp') ? 'image' : 'video'
        return {
          url: data.data[0].url,
          type: fileType,
          caption: fileType === 'image'
            ? '🖼️ *Aquí tienes tu imagen de Instagram*'
            : '🎥 *Aquí tienes tu video de Instagram*',
        }
      },
      // 🌐 API 2
      async () => {
        const res = await fetch(`${info.fgmods.url}/downloader/igdl?url=${args[0]}&apikey=${info.fgmods.key}`)
        const data = await res.json()
        if (!data.result?.[0]?.url) throw new Error('❌ Sin datos en API 2')

        const result = data.result[0]
        const fileType = result.url.endsWith('.jpg') || result.url.endsWith('.png') ? 'image' : 'video'
        return {
          url: result.url,
          type: fileType,
          caption: fileType === 'image'
            ? '🖼️ *Aquí tienes tu imagen de Instagram*'
            : '🎥 *Aquí tienes tu video de Instagram*',
        }
      },
      // 🌐 API 3
      async () => {
        const apiUrl = `${info.apis}/download/instagram?url=${encodeURIComponent(args[0])}`
        const apiResponse = await fetch(apiUrl)
        const delius = await apiResponse.json()
        if (!delius.data?.[0]?.url) throw new Error('❌ Sin datos en API 3')

        return {
          url: delius.data[0].url,
          type: delius.data[0].type,
          caption: delius.data[0].type === 'image'
            ? '🖼️ *Aquí tienes tu imagen de Instagram*'
            : '🎥 *Aquí tienes tu video de Instagram*',
        }
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

    if (!fileData) throw new Error('No se pudo descargar el archivo desde ninguna API 😓')

    const fileName = fileData.type === 'image' ? 'instagram.jpg' : 'instagram.mp4'
    await conn.sendFile(m.chat, fileData.url, fileName, fileData.caption, m)

    await m.react('✅')
  } catch (e) {
    await m.react('❌')
    console.log(e)
    handler.limit = 0
    m.reply(`🚨 *Ocurrió un error al descargar*\n\n> ${e.message}`)
  } finally {
    delete userRequests[m.sender]
  }
}

// ░▒▓█  METADATA DEL PLUGIN  █▓▒░
handler.help = ['instagram *<link ig>*']
handler.tags = ['descargas']
handler.command = /^(instagramdl|instagram|igdl|ig|instagramdl2|instagram2|igdl2|ig2|instagramdl3|instagram3|igdl3|ig3)$/i
handler.limit = 1
handler.register = true

export default handler

// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
// ┃ Función auxiliar: detectar tipo de archivo
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
const getBuffer = async (url, options = {}) => {
  const res = await axios({
    method: 'get',
    url,
    headers: { 'DNT': 1, 'Upgrade-Insecure-Request': 1 },
    ...options,
    responseType: 'arraybuffer',
  })
  const buffer = Buffer.from(res.data, 'binary')
  const detectedType = await fileTypeFromBuffer(buffer)

  if (!detectedType || !['image/jpeg', 'image/png', 'video/mp4'].includes(detectedType.mime)) {
    return null
  }
  return { buffer, detectedType }
}
