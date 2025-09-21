import axios from 'axios';
import baileys from '@whiskeysockets/baileys';

async function sendAlbumMessage(jid, medias, options = {}) {
  if (typeof jid !== "string") throw new TypeError(`jid must be string, received: ${jid}`);

  for (const media of medias) {
    if (!media.type || (media.type !== "image" && media.type !== "video")) 
      throw new TypeError(`media.type must be "image" or "video", received: ${media.type}`);
    if (!media.data || (!media.data.url && !Buffer.isBuffer(media.data))) 
      throw new TypeError(`media.data must be object with url or buffer, received: ${media.data}`);
  }

  if (medias.length < 2) throw new RangeError("🐟 Debes darme al menos 2 imágenes para hacer un álbum marino~ 💙🦈");

  const caption = options.text || options.caption || "";
  const delay = !isNaN(options.delay) ? options.delay : 500;
  delete options.text;
  delete options.caption;
  delete options.delay;

  const album = baileys.generateWAMessageFromContent(
    jid,
    {
      messageContextInfo: {},
      albumMessage: {
        expectedImageCount: medias.filter(m => m.type === "image").length,
        expectedVideoCount: medias.filter(m => m.type === "video").length,
        ...(options.quoted ? { contextInfo: options.quoted } : {})
      }
    },
    {}
  );

  await conn.relayMessage(album.key.remoteJid, album.message, { 
    messageId: album.key.id,
    forwardedNewsletterMessageInfo: options.forwardedNewsletterMessageInfo
  });

  for (let i = 0; i < medias.length; i++) {
    const { type, data } = medias[i];
    const img = await baileys.generateWAMessage(
      album.key.remoteJid,
      { [type]: data, ...(i === 0 ? { caption } : {}) },
      { upload: conn.waUploadToServer }
    );

    img.message.messageContextInfo = {
      messageAssociation: { associationType: 1, parentMessageKey: album.key },
      ...(options.quoted || {}),
    };

    await conn.relayMessage(img.key.remoteJid, img.message, { 
      messageId: img.key.id,
      forwardedNewsletterMessageInfo: options.forwardedNewsletterMessageInfo
    });

    await baileys.delay(delay);
  }

  return album;
}

const pins = async (judul) => {
  try {
    const res = await axios.get(`https://anime-xi-wheat.vercel.app/api/pinterest?q=${encodeURIComponent(judul)}`);
    if (Array.isArray(res.data.images)) {
      return res.data.images.map(url => ({
        image_large_url: url,
        image_medium_url: url,
        image_small_url: url
      }));
    }
    return [];
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
};

let handler = async (m, { conn, text }) => {
  if (!text) return conn.sendMessage(m.chat, { 
    text: `⚠️🌊 Ingresa un texto para que Gura busque en Pinterest~ 🦈✨\n\nEjemplo: *.pin Gawr Gura kawaii* 💙`, 
  }, { 
    quoted: m,
    forwardedNewsletterMessageInfo: {
      newsletterJid: '120363399729727124@newsletter',
      newsletterName: '🌊 Gura-Ocean-MD 🦈✨',
      serverMessageId: 100
    }
  });

  try {
    const res2 = await fetch('https://files.catbox.moe/8sl0sc.jpg');
    const thumb2 = Buffer.from(await res2.arrayBuffer());

    const fkontak = {
      key: { 
        participants: "0@s.whatsapp.net", 
        remoteJid: "status@broadcast", 
        fromMe: false, 
        id: "Halo" 
      },
      message: {
        locationMessage: {
          name: '🔎🐟 𝗕𝘂𝘀𝗾𝘂𝗲𝗱𝗮 𝗢𝗰𝗲á𝗻𝗶𝗰𝗮 ✦ 𝗣𝗶𝗻𝘁𝗲𝗿𝗲𝘀𝘁',
          jpegThumbnail: thumb2
        }
      },
      participant: "0@s.whatsapp.net"
    };

    m.react('🌊');
    const results = await pins(text);
    if (!results || results.length === 0) return conn.sendMessage(m.chat, { 
      text: `❌🦈 No encontré olas con resultados para "${text}"... intenta con otra palabra, nya~ 💫` 
    }, { 
      quoted: m,
      forwardedNewsletterMessageInfo: {
        newsletterJid: '120363399729727124@newsletter',
        newsletterName: '🌊 Gura-Ocean-MD 🦈✨',
        serverMessageId: 100
      }
    });

    const maxImages = Math.min(results.length, 15);
    const medias = [];

    for (let i = 0; i < maxImages; i++) {
      medias.push({
        type: 'image',
        data: { url: results[i].image_large_url || results[i].image_medium_url || results[i].image_small_url }
      });
    }

    await sendAlbumMessage(m.chat, medias, {
      caption: `💙✨ Resultados oceánicos de: *${text}* 🐟\n🌊 Cantidad de imágenes encontradas: *${maxImages}* 🦈`,
      quoted: fkontak,
      forwardedNewsletterMessageInfo: {
        newsletterJid: '120363399729727124@newsletter',
        newsletterName: '🌊 Gura-Ocean-MD 🦈✨',
        serverMessageId: 100
      }
    });

    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

  } catch (error) {
    console.error(error);
    conn.sendMessage(m.chat, { 
      text: '❌🐠 Error submarino: No pude atrapar imágenes en Pinterest. Intenta otra vez~ 🦈💦' 
    }, { 
      quoted: m,
      forwardedNewsletterMessageInfo: {
        newsletterJid: '120363399729727124@newsletter',
        newsletterName: '🌊 Gura-Ocean-MD 🦈✨',
        serverMessageId: 100
      }
    });
  }
};

handler.help = ['pinterest'];
handler.command = ['pinterest', 'pin'];
handler.tags = ['gawr-gura', 'buscador'];

export default handler;
