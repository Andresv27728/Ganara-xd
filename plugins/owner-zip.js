// 🌊🦈╭━━━━━━━━━━━━╮🦈🌊
//     𝗚𝗮𝘄𝗿 𝗚𝘂𝗿𝗮 - Zip Uploader
//   By Destroy | The Shark Queen 🐟
// 🌊🦈╰━━━━━━━━━━━━╯🦈🌊

import fetch from 'node-fetch'
import AdmZip from 'adm-zip'
import { Buffer } from 'buffer'

let handler = async (m, { conn }) => {
  if (!m.quoted) {
    return conn.reply(m.chat, '🦈 *Gura dice:* ¡Debes citar un archivo `.zip` para subirlo al océano GitHub! 🌊', m)
  }
  
  await m.react('🌊')

  try {
    const zipBuffer = await m.quoted.download()
    if (!zipBuffer) return conn.reply(m.chat, '⚠️ *Gura triste...* No pude descargar el archivo citado. 🐟', m)

    const zip = new AdmZip(zipBuffer)
    const entries = zip.getEntries()
    let success = 0

    for (const entry of entries) {
      if (entry.isDirectory) continue
      const filePath = entry.entryName.replace(/\\/g, '/')
      const fileContent = entry.getData()

      const result = await uploadFileToGitHub(filePath, fileContent)
      if (result.ok) {
        success++
        await conn.reply(m.chat, `✅ 🦈 *Archivo Subido:* \`${filePath}\``, m)
      } else {
        await conn.reply(m.chat, `⚠️ 🌊 *Falló:* ${filePath} → ${result.status} ${result.statusText}`, m)
      }

      await new Promise(r => setTimeout(r, 1000)) // ⚓ evita límite de API
    }

    await conn.reply(m.chat, `🌊✨ *Misiones completadas, desu!* ✨🌊\n\n🦈 Subida terminada: *${success}/${entries.length}* archivos.`, m)
    await m.react('🦈')
  } catch (err) {
    await m.react('💦')
    await conn.reply(m.chat, `❌ *Error del océano:* ${err.message}`, m)
  }
}

// 🌐 Comandos de handler
handler.help = ['zip']
handler.tags = ['tools']
handler.command = ['zip']
handler.rowner = true

export default handler

// === 🌊 Función para subir a GitHub con el poder del tiburón ===
async function uploadFileToGitHub(filePath, fileContent) {
  const token = 'TU_TOKEN_AQUI' // 🐟 pon tu token aquí
  const repoOwner = 'TU_USUARIO'
  const repoName = 'TU_REPO'

  const url = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`

  // ⚓ Verificar si ya existe el archivo
  const existing = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `token ${token}`,
      'Accept': 'application/vnd.github.v3+json'
    }
  })

  const json = existing.ok ? await existing.json() : null
  const sha = json?.sha

  // 🌊 Preparar cuerpo con estilo Gura
  const body = {
    message: `🦈 Gawr-GuraBot | Archivo subido por el tiburóncito 🌊`,
    content: Buffer.from(fileContent).toString('base64'),
    ...(sha ? { sha } : {})
  }

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Authorization': `token ${token}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })

  return response
}
