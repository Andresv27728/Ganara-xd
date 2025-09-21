// 🌊 Código redecorado por Gawr Gura 🦈💙 
global.math = global.math || {};

const handler = async (m, { conn, args, usedPrefix, command }) => {
  const textoAyuda = `
🌊✨ *ACERTI-GURA MATH* 🦈💙

Elige tu nivel de dificultad, shaa~  
Disponibles: *${Object.keys(modes).join(' | ')}*

📌 Ejemplo: *${usedPrefix + command} noob*
`.trim();

  if (args.length < 1) return await conn.reply(m.chat, textoAyuda, m, rcanal);

  const mode = args[0].toLowerCase();
  if (!(mode in modes)) return await conn.reply(m.chat, textoAyuda, m, rcanal);

  const id = m.chat;
  if (id in global.math) 
    return conn.reply(m.chat, '⚠️ UwU~ Ya hay un desafío matemático activo en este chat, shaaa~ 🦈', global.math[id][0]);

  const math = genMath(mode);

  // Inicializar usuario
  if (!global.db.data.users[m.sender]) global.db.data.users[m.sender] = { monedas: 0 };
  const user = global.db.data.users[m.sender];
  if (!isNumber(user.monedas)) user.monedas = 0;

  // Guardar el reto activo
  global.math[id] = [
    await conn.reply(
      m.chat,
      `
🧮💫 *DESAFÍO GURA-MATH* 🐬
────────────────────────────
❓ Resuelve: *${math.str}*

⏱️ Tiempo: ${(math.time / 1000).toFixed(2)} segundos  
💰 Recompensa: +${math.bonus.toLocaleString()} monedas 🪙  
────────────────────────────
> ¡Piensa rápido o Gura te muerde, shaaa~ 🦈
`.trim(),
      m,
      rcanal
    ),
    math,
    4,
    setTimeout(() => {
      if (global.math[id]) {
        conn.reply(m.chat, `⏳ Waa~ se acabó el tiempo, onii-chan 💦\n✔️ La respuesta correcta era: *${math.result}* 🐬`, m, rcanal);
        delete global.math[id];
      }
    }, math.time)
  ];
};

// 🎮 Control de respuestas
handler.before = async function (m, { conn }) {
  const id = m.chat;
  if (!(id in global.math)) return;

  const [msg, math, tries] = global.math[id];

  // Usuario
  if (!global.db.data.users[m.sender]) global.db.data.users[m.sender] = { monedas: 0 };
  const user = global.db.data.users[m.sender];
  if (!isNumber(user.monedas)) user.monedas = 0;

  if (m.text && (parseInt(m.text) === math.result || parseFloat(m.text) === math.result)) {
    user.monedas = (user.monedas || 0) + math.bonus;

    conn.reply(m.chat, `🎉✨ ¡Correcto, shaaa~! Ganaste *${math.bonus.toLocaleString()}* monedas 🪙🐬`, m, rcanal);

    clearTimeout(global.math[id][3]);
    delete global.math[id];
  } else if (tries > 1) {
    global.math[id][2]--;
    conn.reply(m.chat, `❌ Nya~ incorrecto.\n🔁 Intentos restantes: *${global.math[id][2]}*`, m, rcanal);
  } else {
    conn.reply(m.chat, `⏳ Waa~ se acabaron tus intentos 💦\n✔️ Respuesta correcta: *${math.result}* 🦈`, m, rcanal);
    clearTimeout(global.math[id][3]);
    delete global.math[id];
  }
};

// 📚 Configuración
handler.help = ['math'];
handler.tags = ['game'];
handler.command = ['math', 'mates', 'matemáticas'];
export default handler;

const modes = {
  noob: [-3, 3, -3, 3, '+-', 15000, 2000],
  easy: [-10, 10, -10, 10, '*/+-', 20000, 50000],
  medium: [-50, 50, -50, 50, '*/+-^%√', 30000, 100000],
  hard: [-100, 100, -100, 100, '*/+-^%√∛', 45000, 150000],
  extreme: [-1000, 1000, -1000, 1000, '*/+-^%√∛log', 60000, 180000],
  insane: [-5000, 5000, -5000, 5000, '*/+-^%√∛log!', 90000, 200000],
  genius: [-10000, 10000, -10000, 10000, '*/+-^%√∛log!', 120000, 220000],
  ultra: [-50000, 50000, -50000, 50000, '*/+-^%√∛log!^^', 150000, 250000],
  impossible: [-999999, 999999, -999999, 999999, '*/+-^%√∛log!^^', 180000, 270000],
  god: [-9999999, 9999999, -9999999, 9999999, '*/+-^%√∛log!^^', 240000, 280000],
  omega: [-99999999, 99999999, -99999999, 99999999, '*/+-^%√∛log!^^C', 300000, 100000],
  infinity: [-999999999, 999999999, -999999999, 999999999, '*/+-^%√∛log!^^C', 400000, 300000],
};

const operators = {
  '+': '+',
  '-': '-',
  '*': '×',
  '/': '÷',
  '^': '^',
  '%': '%',
  '√': '√',
  '∛': '∛',
  '!': '!',
  'log': 'log',
  '^^': '^^',
  'C': 'C',
};

function genMath(mode) {
  const [a1, a2, b1, b2, ops, time, bonus] = modes[mode];
  let a = randomInt(a1, a2);
  let b = randomInt(b1, b2);
  const op = pickRandom([...ops]);
  let result;

  if (op === '^' || op === '^^') {
    b = Math.max(2, Math.min(op === '^^' ? 6 : 4, b));
    result = Math.pow(a, b);
  } else if (op === '%') {
    b = b === 0 ? 1 : b;
    result = a % b;
  } else if (op === '√') {
    a = Math.abs(a);
    result = Math.floor(Math.sqrt(a));
  } else if (op === '∛') {
    a = Math.abs(a);
    result = Math.floor(Math.cbrt(a));
  } else if (op === 'log') {
    a = Math.abs(a) + 1;
    result = Math.floor(Math.log10(a));
  } else if (op === '!') {
    a = Math.abs(a % 10);
    result = factorial(a);
  } else if (op === 'C') {
    a = Math.abs(a % 15) + 1;
    b = Math.min(Math.abs(b % a), a);
    result = combinatoria(a, b);
  } else if (op === '/') {
    b = b === 0 ? 1 : b;
    result = (a * b) / b;
  } else if (op === '*') {
    result = a * b;
  } else if (op === '+') {
    result = a + b;
  } else if (op === '-') {
    result = a - b;
  }

  return { str: `${a} ${operators[op]} ${b}`, mode, time, bonus, result };
}

function randomInt(from, to) {
  if (from > to) [from, to] = [to, from];
  return Math.floor((to - from) * Math.random() + from);
}

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function factorial(n) {
  return n <= 1 ? 1 : n * factorial(n - 1);
}

function combinatoria(n, r) {
  return factorial(n) / (factorial(r) * factorial(n - r));
}

function isNumber(x) {
  return typeof x === 'number' && !isNaN(x);
}
