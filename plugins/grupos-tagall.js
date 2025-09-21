let handler = async function (m, { conn, groupMetadata }) {
  if (!m.isGroup) return m.reply('❌ Este comando solo funciona en grupos.');

  const participantes = groupMetadata?.participants || [];
  const mencionados = participantes.map(p => p.id).filter(Boolean);

  let listaUsuarios = mencionados.map(jid => `┃ 🦈 @${jid.split('@')[0]}`).join('\n');

  const mensaje = [
    '╭━━━〔 🌊 𝙂𝙐𝙍𝘼-𝙎𝙃𝘼𝙍𝙆 𝙄𝙉𝙑𝙊𝘾𝘼𝙏𝙄𝙊𝙉 🌊 〕━━━⬣',
    '┃ ✨ *¡Invocación marina completada!* ✨',
    '┃ 📢 Todos los habitantes del arrecife han sido llamados:',
    listaUsuarios,
    '╰━━━━━━━━━━━━━━━━━━━━⬣',
    '',
    '💙 *Powered by Gawr Gura* 🦈'
  ].join('\n');

  const imagenURL = 'https://files.catbox.moe/f6vksl.jpg'; // Imagen temática de Gura

  await conn.sendMessage(
    m.chat,
    { 
      image: { url: imagenURL },
      caption: mensaje,
      mentions: mencionados
    },
    { quoted: m }
  );

  await conn.sendMessage(m.chat, { react: { text: '🌊', key: m.key } });
};

handler.command = ['invocar', 'hidetag', 'tag'];
handler.help = ['invocar'];
handler.tags = ['grupos'];

export
