// 🌊🦈 Plugin TOURl con estilo Gawr Gura 💙
// Créditos base: github.com/BrayanOFC

import axios from 'axios';

let handler = async (m, { conn, text }) => {
  if (!text) return m.reply(`🦈✨ *Aru~!* Ingresa un enlace válido para que mi magia marina lo convierta en un *TO-URL* 🌊\n\nEjemplo:\n> .tourl https://...`);

  await m.react('🐟'); // reacción kawaii mientras procesa

  try {
    const result = await terabox(text);
    if (!result.length) return m.reply(`💔🐠 Oops~ Ese enlace no es válido, prueba con otro link, desu~`);

    for (let i = 0; i < result.length; i++) {
      const { fileName, type, thumb, url } = result[i];
      if (!fileName || !url) {
        console.error('Error: Datos incompletos', { fileName, url });
        continue;
      }

      const caption = `🦈💙 *Archivo encontrado en las profundidades del océano*\n\n📄 *Nombre:* ${fileName}\n📂 *Formato:* ${type}\n🔗 *Enlace SharkURL:* ${url}`;
      console.log(`🌊 Enviando archivo: ${fileName}, URL: ${url}`);

      try {
        await conn.sendFile(m.chat, url, fileName, caption, m, false, {
          thumbnail: thumb ? await getBuffer(thumb) : null
        });
        await m.react('✅');
      } catch (error) {
        console.error('Error al enviar archivo:', error);
        m.reply(`💔🐟 Error al enviar el archivo: *${fileName}*`);
      }
    }
  } catch (err) {
    console.error('Error general:', err);
    m.reply(`⚡️💔 Auu~ ocurrió un error en el océano al procesar tu enlace 🦈`);
  }
};

handler.help = ["tourl <url>"];
handler.tags = ["descargas"];
handler.command = ['tourl']; // comando cambiado a TOURl
handler.group = true;
handler.register = true;
handler.coin = 5;

export default handler;

async function terabox(url) {
  return new Promise(async (resolve, reject) => {
    await axios
      .post('https://teradl-api.dapuntaratya.com/generate_file', {
        mode: 1,
        url: url
      })
      .then(async (a) => {
        const array = [];
        for (let x of a.data.list) {
          let dl = await axios
            .post('https://teradl-api.dapuntaratya.com/generate_link', {
              js_token: a.data.js_token,
              cookie: a.data.cookie,
              sign: a.data.sign,
              timestamp: a.data.timestamp,
              shareid: a.data.shareid,
              uk: a.data.uk,
              fs_id: x.fs_id
            })
            .then((i) => i.data)
            .catch((e) => e.response);

          if (!dl.download_link || !dl.download_link.url_1) {
            console.error('⚠️ Enlace de descarga no encontrado', dl);
            continue;
          }

          array.push({
            fileName: x.name,
            type: x.type,
            thumb: x.image,
            url: dl.download_link.url_1
          });
        }
        resolve(array);
      })
      .catch((e) => {
        console.error('🐠 Error en la API Terabox:', e.response?.data || e);
        reject(e.response?.data || e);
      });
  });
}

async function getBuffer(url) {
  try {
    const res = await axios({
      method: 'get',
      url,
      responseType: 'arraybuffer'
    });
    return res.data;
  } catch (err) {
    console.error('🐟 Error al obtener el buffer:', err);
    return null;
  }
}
