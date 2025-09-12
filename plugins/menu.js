// Mapa de emojis para las categorías
const categoryEmojis = {
  'general': 'ℹ️',
  'descargas': '📥',
  'diversion': '🎉',
  'juegos': '🎮',
  'grupos': '👥',
  'propietario': '👑',
  'utilidades': '🛠️',
  'informacion': '📚',
  'subbots': '🤖',
  'ias': '🧠',
  'default': '⚙️'
};

// Función para formatear el uptime
function formatUptime(ms) {
  let seconds = Math.floor(ms / 1000);
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);

  seconds %= 60;
  minutes %= 60;
  hours %= 24;

  return `${hours}h ${minutes}m ${seconds}s`;
}

const menuCommand = {
  name: "menu",
  category: "general",
  description: "Muestra el menú de comandos del bot.",
  aliases: ["help", "ayuda"],

  async execute({ sock, msg, commands, config }) {
    const categories = {};

    // Agrupar comandos por categoría
    commands.forEach(command => {
      if (!command.category || command.name === 'test') return;

      if (!categories[command.category]) {
        categories[command.category] = [];
      }

      categories[command.category].push(command);
    });

    // Ordenar categorías alfabéticamente
    const sortedCategories = Object.keys(categories).sort();

    // Obtener uptime y fecha/hora actual
    const uptime = formatUptime(process.uptime() * 1000);
    const fecha = new Date().toLocaleDateString("es-ES", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
    const hora = new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

    // --- Encabezado versión Gaara ---
    let menuText = `╭━━━〔 *${config.botName}* 〕━━━⬣\n`;
    menuText += `┃ ➪ 𝗛𝗼𝗹𝗮: *${msg.pushName}*\n`;
    menuText += `┃ ➪ 👑 Owner: *${config.ownerName}*\n`;
    menuText += `┃ ➪ 📦 Versión: *${config.version || '1.0.0'}*\n`;
    menuText += `┃ ➪ ⏰ Uptime: *${uptime}*\n`;
    menuText += `┃ ➪ 📅 Fecha: *${fecha}*\n`;
    menuText += `┃ ➪ 🕒 Hora: *${hora}*\n`;
    menuText += `╰━━━━━━━━━━━━━━━━━━━━━━━⬣\n\n`;

    // --- Construcción del menú ---
    for (const category of sortedCategories) {
      const emoji = categoryEmojis[category] || categoryEmojis['default'];

      menuText += `╭━━━〔 ${emoji} ${category.toUpperCase()} 〕━━━⬣\n`;

      const commandList = categories[category]
        .filter((cmd, index, self) => self.findIndex(c => c.name === cmd.name) === index) // evitar duplicados
        .map(cmd => `> ╰┈➤ :: \`\`\`.${cmd.name}\`\`\``)
        .join('\n');

      menuText += `${commandList}\n`;
      menuText += `╰━━━━━━━━━━━━━━━━━━⬣\n\n`;
    }

    // --- Enviar menú ---
    await sock.sendMessage(
      msg.key.remoteJid,
      {
        image: { url: 'https://files.catbox.moe/vm9t7c.jpg' },
        caption: menuText,
        mimetype: 'image/png'
      },
      { quoted: msg }
    );
  }
};

export default menuCommand;