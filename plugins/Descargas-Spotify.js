// 🦈🌊💙 Plugin Spotify con Estética Gawr Gura 💙🌊🦈
import axios from 'axios'; 
import fetch from 'node-fetch';

// Registro de usuarios que descargan
const userRequests = {};

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return m.reply(`╭───🌊💙 *GAWR GURA* 💙🌊───╮
🦈 *¿Qué canción buscas, amigo del océano?*  
✨ Ejemplo: ${usedPrefix + command} ozuna
╰────────────────────────────╯`);
  }

  if (userRequests[m.sender]) {
    return await conn.reply(m.chat, `⚠️ Hey @${m.sender.split('@')[0]}  
🦈 *Ya estás descargando una canción con Gawr Gura* 💙  
Espera a que termine tu descarga ⌛`, m);
  }

  userRequests[m.sender] = true;
  m.react('🌊');

  try {
    const results = await spotifyxv(text);
    if (!results.length) return m.reply('❌💦 *No encontré nada en el océano de Spotify*');

    const track = results[0];
    const spotifyMessage = `╭───🦈💙 *GAWR GURA SPOTIFY* 💙🦈───╮
*• 🎵 Título:* ${track.name}
*• 👩‍🎤 Artista:* ${track.artista.join(', ')}
*• 💽 Álbum:* ${track.album}
*• ⏱️ Duración:* ${track.duracion}
╰────────────────────────────╯

🌊✨ *Enviando canción desde el fondo del mar...* 🦈`;

    await conn.sendMessage(m.chat, {
      text: spotifyMessage,
      contextInfo: {
        forwardingScore: 1,
        isForwarded: true,
        externalAdReply: {
          showAdAttribution: true,
          renderLargerThumbnail: true,
          title: track.name,
          body: "🌊 Enviando canción con Gawr Gura 🦈",
          mediaType: 1,
          thumbnailUrl: track.imagen,
          mediaUrl: track.url,
          sourceUrl: track.url
        }
      }
    }, { quoted: m });

    // 🌊 Intento de descarga con APIs oceánicas
    const downloadAttempts = [
      async () => {
        const res = await fetch(`https://api.siputzx.my.id/api/d/spotify?url=${track.url}`);
        const data = await res.json();
        return data?.data?.download || null;
      },
      async () => {
        const res = await fetch(`https://tu-api.com/download/spotifydl?url=${track.url}`);
        const data = await res.json();
        return data?.data?.url || null;
      }
    ];

    let downloadUrl = null;
    for (const attempt of downloadAttempts) {
      try {
        downloadUrl = await attempt();
        if (downloadUrl) break;
      } catch (err) {
        console.error(`🌊🦈 Error en intento de descarga: ${err.message}`);
      }
    }

    if (!downloadUrl) throw new Error('💦 No se pudo descargar la canción desde ninguna API submarina');

    await conn.sendMessage(m.chat, {
      audio: { url: downloadUrl },
      fileName: `${track.name}.mp3`,
      mimetype: 'audio/mpeg'
    }, { quoted: m });

    m.react('✅');
  } catch (error) {
    m.reply(`⚠️ Ocurrió un error submarino 🌊\n\n> ${error.message}`);
    console.error(error);
    m.react('❌');
  } finally {
    delete userRequests[m.sender];
  }
};

// 📜 Comandos y configuración del handler
handler.help = ['spotify'];
handler.tags = ['descargas'];
handler.command = /^(spotify|music)$/i;
handler.register = true;
handler.limit = 1;

export default handler;

// 🌊 Función de búsqueda en Spotify con tokens
async function spotifyxv(query) {
  let token = await tokens();
  try {
    let response = await axios.get(`https://api.spotify.com/v1/search?q=${query}&type=track`, {
      headers: { Authorization: 'Bearer ' + token }
    });
    const tracks = response.data.tracks.items;
    return tracks.map(track => ({
      name: track.name,
      artista: track.artists.map(artist => artist.name),
      album: track.album.name,
      duracion: timestamp(track.duration_ms),
      url: track.external_urls.spotify,
      imagen: track.album.images.length ? track.album.images[0].url : ''
    }));
  } catch (error) {
    console.error(`🦈 Error en spotifyxv: ${error}`);
    return [];
  }
}

// 🌊 Función para obtener token de Spotify
async function tokens() {
  try {
    const response = await axios.post('https://accounts.spotify.com/api/token', 'grant_type=client_credentials', {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Basic ' + Buffer.from('TU_CLIENT_ID:TU_CLIENT_SECRET').toString('base64')
      }
    });
    return response.data.access_token;
  } catch (error) {
    console.error(`🦈 Error en tokens: ${error}`);
    throw new Error('No se pudo obtener el token de acceso submarino 🌊');
  }
}

// 🌊 Función para dar formato de tiempo
function timestamp(ms) {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
}
