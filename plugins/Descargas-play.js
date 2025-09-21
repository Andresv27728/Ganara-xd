import yts from 'yt-search';
import fetch from 'node-fetch';
import { prepareWAMessageMedia, generateWAMessageFromContent } from '@whiskeysockets/baileys';

const handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0]) return conn.reply(m.chat, `🦈✨ 𝙂𝙪𝙧𝙖-𝙎𝙝𝙖𝙖𝙖~ 🌊💙\n\n⚡️ 𝙄𝙣𝙜𝙧𝙚𝙨𝙖 𝙪𝙣 𝙩𝙚𝙭𝙩𝙤 𝙥𝙖𝙧𝙖 𝙗𝙪𝙨𝙘𝙖𝙧 𝙚𝙣 𝙔𝙤𝙪𝙏𝙪𝙗𝙚.\n> *Ejemplo:* ${usedPrefix + command} Shakira`, m);

    await m.react('🌀');
    try {
        let searchResults = await searchVideos(args.join(" "));

        if (!searchResults.length) throw new Error('🌊 Ningún resultado encontrado, Gura triste... 💔🦈');

        let video = searchResults[0];
        let thumbnail = await (await fetch(video.miniatura)).buffer();

        let messageText = `┏━━━━『 🦈💙 𝙂𝙐𝙍𝘼 𝙔𝙊𝙐𝙏𝙐𝘽𝙀 🌊 』━━━━┓\n\n`;
        messageText += `🎶 *Título:* ${video.titulo}\n\n`;
        messageText += `> 🕒 𝘿𝙪𝙧𝙖𝙘𝙞ó𝙣: ${video.duracion || 'No disponible'}\n`;
        messageText += `> 👤 𝘼𝙪𝙩𝙤𝙧: ${video.canal || 'Desconocido'}\n`;
        messageText += `> 📅 𝙋𝙪𝙗𝙡𝙞𝙘𝙖𝙙𝙤: ${convertTimeToSpanish(video.publicado)}\n`;
        messageText += `> 🔗 𝙐𝙧𝙡: ${video.url}\n\n`;
        messageText += `╰━━━━━━⊰ 💙 𝙂𝙪𝙧𝙖 𝙎𝙝𝙖𝙖~ ⊱━━━━━━╯`;

        await conn.sendMessage(m.chat, {
            image: thumbnail,
            caption: messageText,
            footer: `🌊💙 𝙂𝙐𝙍𝘼-𝙐𝙇𝙏𝙍𝘼-𝙈𝘿 🦈✨`,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true
            },
            buttons: [
                {
                    buttonId: `${usedPrefix}ytmp3 ${video.url}`,
                    buttonText: { displayText: '💙 𝗔𝘂𝗱𝗶𝗼 🎶' },
                    type: 1,
                },
                {
                    buttonId: `${usedPrefix}ytmp4 ${video.url}`,
                    buttonText: { displayText: '🌊 𝗩𝗶𝗱𝗲𝗼 🎬' },
                    type: 1,
                }
            ],
            headerType: 1,
            viewOnce: true
        }, { quoted: m });

        await m.react('✅');
    } catch (e) {
        console.error(e);
        await m.react('❌');
        conn.reply(m.chat, '💔🐟 *Error al buscar el video, Gura se confundió...*', m);
    }
};

handler.help = ['play','play2'];
handler.tags = ['downloader'];
handler.command = ['play','play2'];
export default handler;

async function searchVideos(query) {
    try {
        const res = await yts(query);
        return res.videos.slice(0, 10).map(video => ({
            titulo: video.title,
            url: video.url,
            miniatura: video.thumbnail,
            canal: video.author.name,
            publicado: video.timestamp || 'No disponible',
            vistas: video.views || 'No disponible',
            duracion: video.duration.timestamp || 'No disponible'
        }));
    } catch (error) {
        console.error('🐟 Error en yt-search:', error.message);
        return [];
    }
}

function convertTimeToSpanish(timeText) {
    return timeText
        .replace(/year/, 'año').replace(/years/, 'años')
        .replace(/month/, 'mes').replace(/months/, 'meses')
        .replace(/day/, 'día').replace(/days/, 'días')
        .replace(/hour/, 'hora').replace(/hours/, 'horas')
        .replace(/minute/, 'minuto').replace(/minutes/, 'minutos');
}
