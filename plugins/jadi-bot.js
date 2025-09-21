// Código creado por The Carlos 👑 y Modificado por Xzzys26 
// Rediseñado con ❤️ temática de Gawr Gura 🦈✨

// 🌊🐚 Handler para mostrar los Sub-Bots activos estilo Gura-Chan 🐟
async function handler(m, { conn: gura, usedPrefix }) {
  const maxSubBots = 324;
  const conns = Array.isArray(global.conns) ? global.conns : [];

  const isConnOpen = (c) => {
    try {
      return c?.ws?.socket?.readyState === 1;
    } catch {
      return !!c?.user?.id;
    }
  };

  const unique = new Map();
  for (const c of conns) {
    if (!c || !c.user) continue;
    if (!isConnOpen(c)) continue;

    const jidRaw = c.user.jid || c.user.id || '';
    if (!jidRaw) continue;

    unique.set(jidRaw, c);
  }

  const users = [...unique.values()];
  const totalUsers = users.length;
  const availableSlots = Math.max(0, maxSubBots - totalUsers);

  const title = `🦈『 𝙂𝙐𝙍𝘼-𝘽𝙊𝙏𝙎 𝙊𝙉𝙇𝙄𝙉𝙀 』🌊`;

  let responseMessage = '';

  if (totalUsers === 0) {
    responseMessage = `╭━━━〔 *${title}* 〕━━━╮
┃ 🌊 Sub-Bots activos: *0*
┃ ❌ Ningún tritón conectado aún
┃ 🐚 Espacios disponibles: *${availableSlots}*
╰━━━━━━━━━━━━━━━━━━━━━━╯

> 🦈✨ ¡Conéctate ya y nada junto a la *Shark Army*!`;
  } else {
    const listado = users
      .map((v, i) => {
        const num = v.user.jid.replace(/[^0-9]/g, '');
        const nombre = v?.user?.name || v?.user?.pushName || '🌟 𝙂𝙪𝙧𝙖-𝙎𝙪𝙗𝘽𝙤𝙩';
        const waLink = `https://wa.me/${num}?text=${usedPrefix}code`;
        return `╭━━━〔 🐟 𝙂𝙐𝙍𝘼-𝙎𝙐𝘽𝘽𝙊𝙏 #${i + 1} 〕━━━╮
┃ 👤 Usuario: @${num}
┃ 💙 Nombre: ${nombre}
┃ 🌊 Link: ${waLink}
╰━━━━━━━━━━━━━━━━━━━━━━╯`;
      })
      .join('\n\n');

    responseMessage = `╭━━━〔 *${title}* 〕━━━╮
┃ 🧜‍♀️ Total conectados: *${totalUsers}*
┃ 🐚 Espacios disponibles: *${availableSlots}*
╰━━━━━━━━━━━━━━━━━━━━━━╯

${listado}`.trim();
  }

  const imageUrl = 'https://files.catbox.moe/e2n2sq.jpg'; // 🦈 Imagen Gawr Gura

  const fkontak = {
    key: {
      participants: "0@s.whatsapp.net",
      remoteJid: "status@broadcast",
      fromMe: false,
      id: "GuraOcean",
    },
    message: {
      contactMessage: {
        displayName: "GuraSubBot",
        vcard: "BEGIN:VCARD\nVERSION:3.0\nN:;GuraSubBot;;;\nFN:GuraSubBot\nEND:VCARD",
      },
    },
  };

  const mentions = typeof gura.parseMention === 'function'
    ? gura.parseMention(responseMessage)
    : [...new Set(
        (responseMessage.match(/@(\d{5,16})/g) || []).map(v => v.replace('@', '') + '@s.whatsapp.net')
      )];

  try {
    await gura.sendMessage(
      m.chat,
      { image: { url: imageUrl }, caption: responseMessage, mentions },
      { quoted: fkontak }
    );
  } catch (e) {
    console.error('❌ Error enviando listado de subbots Gura:', e);
    await gura.sendMessage(
      m.chat,
      { text: responseMessage, mentions },
      { quoted: fkontak }
    );
  }
}

handler.command = ['listabots', 'Bots', 'subots'];
handler.help = ['guraBots'];
handler.tags = ['jadibot'];

export default handler;
