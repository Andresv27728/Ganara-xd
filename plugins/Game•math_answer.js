// 🌊✨ Código sharky creado por The Carlos 👑 con temática Gawr Gura 🦈💙
global.math = global.math ? global.math : {};

const handler = async (m, { conn }) => {
  const id = m.chat;
  if (!m.quoted) return;
  if (m.quoted.sender != conn.user.jid) return;
  if (!/^🦈 ¿Cuánto es el resultado de/i.test(m.quoted.text)) return;
  if (!(m.chat in global.math)) 
    return conn.reply(m.chat, `🌊💤 Esa pregunta ya fue respondida, kouhai~`, m, rcanal);

  if (m.quoted.id == global.math[id][0].id) {
    const math = global.math[id][1];
    const user = global.db.data.users[m.sender] || {};

    // Inicializa monedas si no existe
    if (!isNumber(user.monedas)) user.monedas = 0;

    if (parseInt(m.text) === parseInt(math.result)) {
      user.monedas = (user.monedas || 0) + math.bonus;

      conn.reply(
        m.chat,
        `🦈💙 *Correcto, desu~!*  
✨ Has atrapado el resultado como una verdadera Gawr Gura!  
💰 Recompensa: *${math.bonus.toLocaleString()} Monedas* 🌊`,
        m,
        rcanal
      );

      clearTimeout(global.math[id][3]);
      delete global.math[id];
    } else {
      if (--global.math[id][2] === 0) {
        conn.reply(
          m.chat,
          `⏳🌊 *Oh no! Ya no tienes más oportunidades.*  
⭐️ La respuesta era: *${math.result}*  
🐟 ¡Inténtalo otra vez, pequeño tiburón! 🦈`,
          m,
          rcanal
        );
        clearTimeout(global.math[id][3]);
        delete global.math[id];
      } else {
        conn.reply(
          m.chat,
          `❌🦈 *Respuesta incorrecta~*  
✨ Oportunidades restantes: *${global.math[id][2]}*  
Sigue nadando y piensa como Gura~ 🌊`,
          m,
          rcanal
        );
      }
    }
  }
};

handler.customPrefix = /^-?[0-9]+(\.[0-9]+)?$/;
handler.command = new RegExp;
export default handler;

function isNumber(x) {
  return typeof x === 'number' && !isNaN(x);
}
