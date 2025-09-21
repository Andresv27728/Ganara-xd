import fg from 'api-dylux';

const handler = async (m, { conn, text, args, usedPrefix, command }) => {
  try {
    if (!args[0]) {
      return conn.sendMessage(m.chat, { 
        text: `🦈✨ 𝙂𝙪𝙧𝙖-𝙎𝙝𝙖𝙖~ 🌊💙\n\n⚡️ 𝘿𝙚𝙗𝙚𝙨 𝙞𝙣𝙜𝙧𝙚𝙨𝙖𝙧 𝙪𝙣 𝙚𝙣𝙡𝙖𝙘𝙚 𝙫á𝙡𝙞𝙙𝙤 𝙙𝙚 𝙏𝙞𝙠𝙏𝙤𝙠.\n\n📌 *Ejemplo:* ${usedPrefix + command} https://vm.tiktok.com/ZMreHF2dC/` 
      }, { quoted: m });
    }

    if (!/(?:https:?\/{2})?(?:w{3}|vm|vt|t)?\.?tiktok\.com\/([^\s&]+)/gi.test(text)) {
      return conn.sendMessage(m.chat, { 
        text: `❎🌊 𝙀𝙣𝙡𝙖𝙘𝙚 𝙙𝙚 𝙏𝙞𝙠𝙏𝙤𝙠 𝙞𝙣𝙫á𝙡𝙞𝙙𝙤... 𝙂𝙪𝙧𝙖 𝙨𝙚 𝙘𝙤𝙣𝙛𝙪𝙣𝙙𝙞ó 🐟💔` 
      }, { quoted: m });
    }

    if (typeof m.react === 'function') m.react('🌀');

    let data = await fg.tiktok(args[0]);
    let { title, play, duration } = data.result;
    let { nickname } = data.result.author;

    let caption = `
┏━━━━『 🦈💙 𝙂𝙐𝙍𝘼 𝙏𝙄𝙆𝙏𝙊𝙆 🌊 』━━━━┓
┃ 🎀 *Autor:* ${nickname}
┃ 🎶 *Título:* ${title}
┃ 🕒 *Duración:* ${duration}
╰━━━━━━━━━⊰ 💙 𝙂𝙪𝙧𝙖 𝙎𝙝𝙖𝙖~ ⊱━━━━━━━━━╯
`.trim();

    await conn.sendMessage(m.chat, {
      video: { url: play },
      caption
    }, { quoted: m });

    if (typeof m.react === 'function') m.react('✅');
  } catch (e) {
    return conn.sendMessage(m.chat, { 
      text: `❌🐟 *Error:* ${e.message}\n\n💔 𝙂𝙪𝙧𝙖 𝙣𝙤 𝙥𝙪𝙙𝙤 𝙙𝙚𝙨𝙘𝙖𝙧𝙜𝙖𝙧 𝙚𝙨𝙩𝙚 𝙫𝙞𝙙𝙚𝙤...` 
    }, { quoted: m });
  }
};

handler.help = ["tiktok"];
handler.tags = ["downloader"];
handler.command = ["tt", "tiktok", "ttdl"];

export default handler;
