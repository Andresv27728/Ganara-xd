// créditos by xzzys26 adaptado a Gawr-Gura-MD 🦈💙

async function handler(m, { conn, usedPrefix }) {
  try {
    await m.react('🦈')

    const imageUrl = 'https://files.catbox.moe/ove7tq.jpg' // imagen de Gura temática

    let messageText = `
🌊 *Gawr-Gura-MD* 🦈💙
👑 *Creador:*yo soy yo
📱 *Número:* +573133374132
`

    await conn.sendMessage(m.chat, {
      image: { url: imageUrl },
      caption: messageText,
      footer: '🦈✨ *Conexiones bajo el océano con la calidad de Atlantis* 🌊',
      buttons: [
        {
          buttonId: `${usedPrefix}code`,
          buttonText: { displayText: "𝗖𝗼𝗱𝗲" },
          type: 1,
        },
        {
          buttonId: `${usedPrefix}menu`,
          buttonText: { displayText: "𝗠𝗲𝗻𝘂" },
          type: 1,
        },
      ],
      headerType: 4
    }, { quoted: m })

  } catch (error) {
    console.error('Error:', error)
    await conn.sendMessage(m.chat, { 
      text: '🌊 *Gawr-Gura-MD* 🦈💙\n👑 *Creador:* xzzys26\n📱 *Número:* +573133374132\n🦈✨ *Conexiones bajo el océano con la calidad de Atlantis* 🌊'
    }, { quoted: m })
  }
}

handler.help = ['creador']
handler.tags = ['info']
handler.command = ['owner', 'creator', 'creador', 'dueño']

export default handler
