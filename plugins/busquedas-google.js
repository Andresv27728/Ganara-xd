// 🌊✨ Créditos github.com/BrayanOFC (no quitar créditos) 🦈💙
import fetch from 'node-fetch';

let handler = async (m, { text, conn }) => {
  if (!text) {
    return m.reply(`🦈💫 *Aru~!* Ingresa lo que quieras que mi *Google-Shark* busque para ti.  
      
🌊 Ejemplo:  
> .google ¿quién es el personaje principal de Gawr Gura?`);
  }

  try {
    const apiUrl = `https://delirius-apiofc.vercel.app/search/googlesearch?query=${encodeURIComponent(text)}`;
    let api = await fetch(apiUrl);
    let data = await api.json();

    if (!data || !data.result || data.result.length === 0) {
      return m.reply(`❌ UwU~ No encontré nada en las profundidades de Google-Shark 🌊🔍`);
    }

    let results = `💙🔎 *Resultados de Google-Shark para:* 「 ${text} 」\n\n`;

    for (let i = 0; i < Math.min(5, data.result.length); i++) {
      results += `🦈✨ *${data.result[i].title}*\n🔗 ${data.result[i].link}\n\n`;
    }

    await conn.reply(m.chat, results.trim(), m);
  } catch (e) {
    console.error(e);
    m.reply(`⚠️ Auu~ ocurrió un error con mi radar de Google-Shark 💔🐟`);
  }
};

handler.help = ['google <texto>'];
handler.tags = ['buscador'];
handler.command = /^google$/i;

export default handler;
