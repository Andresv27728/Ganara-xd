/*───────────────────────────── 🌊🦈 𝑮𝒂𝒘𝒓 𝑮𝒖𝒓𝒂 𝑺𝒕𝒊𝒄𝒌𝒆𝒓 𝑺𝒚𝒔𝒕𝒆𝒎 🐚✨ ─────────────────────────────*/

const {
  proto,
  generateWAMessage,
  areJidsSameUser,
} = (await import('@whiskeysockets/baileys')).default;

// 🌊 Sistema mágico para detectar stickers guardados y responder al estilo Gawr Gura 🦈💙
export async function all(m, chatUpdate) {
  if (m.isBaileys) return; // ❌ Evitar bucles infinitos entre bots
  if (!m.message) return; // 📭 Ignorar mensajes vacíos
  if (!m.msg.fileSha256) return; // 🐚 Solo actuar si hay sticker
  if (!(Buffer.from(m.msg.fileSha256).toString('base64') in global.db.data.sticker)) return; // 🌊 Si no existe en la db, no hacemos nada

  // 🦈 Recuperamos el sticker registrado en la base de datos acuática
  const hash = global.db.data.sticker[Buffer.from(m.msg.fileSha256).toString('base64')];
  const { text, mentionedJid } = hash;

  // 🌊 Creamos el mensaje estilo Gawr Gura para responder
  const messages = await generateWAMessage(
    m.chat, 
    { text: `🌊🦈 ${text} 🐚✨`, mentions: mentionedJid }, 
    {
      userJid: this.user.id,
      quoted: m.quoted && m.quoted.fakeObj,
    }
  );

  messages.key.fromMe = areJidsSameUser(m.sender, this.user.id);
  messages.key.id = m.key.id;
  messages.pushName = m.pushName;

  if (m.isGroup) messages.participant = m.sender;

  // 🌊 Emitimos el mensaje al océano del bot (Baileys)
  const msg = {
    ...chatUpdate,
    messages: [proto.WebMessageInfo.fromObject(messages)],
    type: 'append',
  };

  this.ev.emit('messages.upsert', msg);
}
