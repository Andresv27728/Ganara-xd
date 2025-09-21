export async function before(m, {conn, isAdmin, isBotAdmin, isOwner, isROwner}) {
  if (m.isBaileys && m.fromMe) return !0;
  if (m.isGroup) return !1;
  if (!m.message) return !0;
  if (m.text.includes('PIEDRA') || m.text.includes('PAPEL') || m.text.includes('TIJERA') || m.text.includes('serbot') || m.text.includes('jadibot')) return !0;
  
  const chat = global.db.data.chats[m.chat];
  const bot = global.db.data.settings[this.user.jid] || {};

  // Evitar activar en canal de noticias
  if (m.chat === '120363399729727124@newsletter') return !0;

  if (bot.antiPrivate && !isOwner && !isROwner) {
    await m.reply(
`╭───────────────༺☆༻───────────────╮
  🌊🐬 ʜᴏʟᴀ ʙᴇʙɪᴛᴏ @${m.sender.split`@`[0]} 🐬🌊
╰───────────────༺☆༻───────────────╯

🦈 𝐒𝐨𝐲 𝐆𝐚𝐰𝐫 𝐆𝐮𝐫𝐚-𝐁𝐨𝐭 🦈  
༺───────────────༻
⚠️ 𝐌𝐢 𝐜𝐫𝐞𝐚𝐝𝐨𝐫 𝐝𝐞𝐬𝐚𝐜𝐭𝐢𝐯𝐨́ 𝐥𝐨𝐬 𝐜𝐨𝐦𝐚𝐧𝐝𝐨𝐬 𝐞𝐧 𝐜𝐡𝐚𝐭𝐬 𝐩𝐫𝐢𝐯𝐚𝐝𝐨𝐬.  
Por eso serás 𝐛𝐥𝐨𝐪𝐮𝐞𝐚𝐝𝐨 🚫.  

✨ 𝐏𝐞𝐫𝐨 𝐧𝐨 𝐭𝐫𝐢𝐬𝐭𝐞𝐬 🐟, únete al  
🏝️ 𝐆𝐫𝐮𝐩𝐨 𝐏𝐫𝐢𝐧𝐜𝐢𝐩𝐚𝐥 🦈 y disfruta mis comandos.  

${gp1}
༺───────────────༻
> 🌊 𝐒𝐡𝐚𝐫𝐤𝐨 𝐬𝐚𝐲𝐬: 𝐆𝐫𝐮𝐩𝐨𝐬 > 𝐏𝐫𝐢𝐯𝐚𝐝𝐨𝐬  
`, false, {mentions: [m.sender]});
    
    await this.updateBlockStatus(m.chat, 'block');
  }
  return !1;
}
