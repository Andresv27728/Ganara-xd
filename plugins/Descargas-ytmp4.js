import axios from 'axios';
import fetch from 'node-fetch';

// 🌊🐬 CONFIGURACIONES PRINCIPALES SHAA~ 🦈💙
const MAX_FILE_SIZE = 280 * 1024 * 1024; // 📦 Máx 280 MB
const VIDEO_THRESHOLD = 70 * 1024 * 1024; // 🎥 Límite video docs
const HEAVY_FILE_THRESHOLD = 100 * 1024 * 1024; // ⚠️ Archivo pesado
const REQUEST_LIMIT = 3; // 🌀 Límite de spam
const REQUEST_WINDOW_MS = 10000;
const COOLDOWN_MS = 120000; // 💤 Cooldown 2 min
const MAX_AUDIO_DURATION = 6 * 60; // 🎶 Máx 6 min

// 🦈 Control de requests ~
const requestTimestamps = [];
let isCooldown = false;
let isProcessingHeavy = false;

// 🌊 Regex para detectar links válidos de YouTube
const isValidYouTubeUrl = url =>
  /^(?:https?:\/\/)?(?:www\.|m\.|music\.)?youtu\.?be(?:\.com)?\/?.*(?:watch|embed)?(?:.*v=|v\/|\/)([\w\-_]+)\&?/.test(url);

function checkRequestLimit() {
  const now = Date.now();
  requestTimestamps.push(now);
  while (requestTimestamps.length > 0 && now - requestTimestamps[0] > REQUEST_WINDOW_MS) {
    requestTimestamps.shift();
  }
  if (requestTimestamps.length >= REQUEST_LIMIT) {
    isCooldown = true;
    setTimeout(() => {
      isCooldown = false;
      requestTimestamps.length = 0;
    }, COOLDOWN_MS);
    return false;
  }
  return true;
}

// 🎶 Función para convertir YouTube en audio/video con GuraPower ⚡🦈
async function ytdl(url, type = 'mp4') {
  const headers = {
    accept: '*/*',
    'accept-language': 'en-US,en;q=0.9',
    'sec-ch-ua': '"Chromium";v="132", "Not A(Brand";v="8"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'cross-site',
    referer: 'https://id.ytmp3.mobi/',
    'referrer-policy': 'strict-origin-when-cross-origin'
  };

  const videoId = url.match(/(?:youtu\.be\/|youtube\.com\/(?:.*v=|.*\/|.*embed\/))([^&?/]+)/)?.[1];
  if (!videoId) throw new Error('❌ No pude encontrar el ID del video, ahoo~ 🦈');

  const init = await (await fetch(`https://d.ymcdn.org/api/v1/init?p=y&23=1llum1n471&_=${Date.now()}`, { headers })).json();
  const convert = await (await fetch(`${init.convertURL}&v=${videoId}&f=${type}&_=${Date.now()}`, { headers })).json();

  let info;
  for (let i = 0; i < 3; i++) {
    const res = await fetch(convert.progressURL, { headers });
    info = await res.json();
    if (info.progress === 3) break;
    await new Promise(r => setTimeout(r, 1000));
  }

  if (!info || !convert.downloadURL) throw new Error('⚡ No pude conseguir el link de descarga, shaa~ 🐬');

  // ⏳ Limitar duración de audios
  if (type === 'mp3' && info.duration > MAX_AUDIO_DURATION) {
    throw new Error('🎶 Este audio es muy largo (>6min), no lo puedo traer... uwu 🦈');
  }

  return { url: convert.downloadURL, title: info.title || '🌊 Archivo Misterioso 🦈' };
}

// 📥 Obtener Buffer kawaii~
async function fetchBuffer(url) {
  const res = await fetch(url);
  const arrayBuffer = await res.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

// 🌸 Handler principal con temática Gura
let handler = async (m, { conn, text, usedPrefix, command }) => {
  const react = emoji => m.react(emoji);

  if (!text) 
    return conn.reply(m.chat, `💙 Uso correcto:\n> ${usedPrefix}${command} <enlace de YouTube>\n\n✨ Ejemplo: ${usedPrefix}${command} https://youtu.be/dQw4w9WgXcQ`, m);

  if (!isValidYouTubeUrl(text)) {
    await react('🔴');
    return m.reply('🚫 Este link de YouTube no es válido, shaa~ 🦈');
  }

  if (isCooldown || !checkRequestLimit()) {
    await react('🔴');
    return conn.reply(m.chat, '⏳ Waa~ muchas solicitudes 💦 Espera 2 minutos, onii-chan.', m);
  }

  if (isProcessingHeavy) {
    await react('🔴');
    return conn.reply(m.chat, '⚠️ Ya estoy nadando con un archivo gigante 🌊🐬 espera un poco, shaa~', m);
  }

  await react('🔍');

  try {
    const type = command.toLowerCase().includes('audio') ? 'mp3' : 'mp4';
    const { url, title } = await ytdl(text, type);

    const buffer = await fetchBuffer(url);
    const size = buffer.length;

    if (size > MAX_FILE_SIZE) throw new Error('📦 El archivo es demasiado grande (>280MB), no puedo traerlo, uwu 🦈');

    if (size > HEAVY_FILE_THRESHOLD) {
      isProcessingHeavy = true;
      await conn.reply(m.chat, '💾 Gura está mordiendo este archivo gigante, espera un poquito... 🦈', m);
    }

    const caption = `
🌊✨ *GAWR GURA ULTRA-MD DESCARGAS* ✨🌊  
🦈 Archivo listo, shaaa~ 💙  
🎶 Título: *${title}*`.trim();

    await conn.sendFile(
      m.chat,
      buffer,
      `${title}.${type}`,
      caption,
      m,
      null,
      {
        mimetype: type === 'mp4' ? 'video/mp4' : 'audio/mpeg',
        asDocument: size >= VIDEO_THRESHOLD,
        filename: `${title}.${type}`
      }
    );

    await react('✅');
    isProcessingHeavy = false;
  } catch (e) {
    await react('❌');
    isProcessingHeavy = false;
    return m.reply(`📌 *ERROR GURA~:* ${e.message}`);
  }
};

// 🦈 Comandos kawaii~
handler.help = ['ytmp4 <url>', 'ytaudio <url>'];
handler.tags = ['descargas'];
handler.command = ['ytmp4', 'ytaudio'];

export default handler;
