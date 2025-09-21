import fs from 'fs';

// 🌊⏳ Configuración
const timeout = 60000; // ⏱️ 60 seg
const poin = 10000;   // 🪙 premio monedas

const handler = async (m, { conn, usedPrefix }) => {
  conn.tekateki = conn.tekateki ? conn.tekateki : {};
  const id = m.chat;

  // 🦈 Si ya hay un acertijo activo
  if (id in conn.tekateki) {
    conn.reply(m.chat, '⚠️ UwU~ Todavía tienes un acertijo sin responder, shaa~ 🦈', conn.tekateki[id][0]);
    throw false;
  }

  // 📖 Cargar acertijos
  const tekateki = JSON.parse(fs.readFileSync(`./src/Game/acertijo.json`));
  const json = tekateki[Math.floor(Math.random() * tekateki.length)];
  const _clue = json.response;
  const clue = _clue.replace(/[A-Za-z]/g, '_');

  // 📝 Mensaje principal decorado con Gura vibes
  const caption = `
🌊💙 *ACERTI-GURA* 🦈✨
──────────────────
❓ *Pregunta:*  
${json.question}

⏱️ *Tiempo:* ${(timeout / 1000).toFixed(2)} segundos  
🎁 *Premio:* +${poin} monedas 🪙  
──────────────────
> Responde rápido antes de que Gura te muerda, shaaa~ 🐬
`.trim();

  // Guardar estado
  conn.tekateki[id] = [
    await conn.reply(m.chat, caption, m),
    json,
    poin,
    setTimeout(async () => {
      if (conn.tekateki[id]) {
        await conn.reply(
          m.chat,
          `⏳ Waa~ se acabó el tiempo, onii-chan 💦\n🔑 Respuesta correcta: *${json.response}* 🦈`,
          conn.tekateki[id][0]
        );
      }
      delete conn.tekateki[id];
    }, timeout)
  ];
};

// 🦈 Comandos temáticos
handler.help = ['acertijo', 'acert', 'adivinanza', 'tekateki'];
handler.tags = ['game'];
handler.command = ['acertijo', 'acert', 'adivinanza', 'tekateki'];

export default handler;
