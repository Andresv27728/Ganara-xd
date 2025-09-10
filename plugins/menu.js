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

    // --- Construcción del menú con tu decoración ---
    ╭━━━〔 𝑴𝑬𝑵𝑼 𝑮𝑨𝑨𝑹𝑨 𝑼𝑳𝑻𝑹𝑨-𝑴𝑫 🩸 〕━━━╮
┃ ➪ Usuario: @${userId.split('@')[0]}
┃ ➪ Modo: ᴘʀɪᴠᴀᴅᴏ
┃ ➪ Bot: *${botname}*
┃ ✍︎ Tipo: ${(conn.user.jid == global.conn.user.jid ? 'Principal 🅥' : 'Sub Bot 🅑')}
┃ ➪ Activa: ${uptime}
┃ ➪ Plataforma: ᴅᴇʟᴜxᴇ ʜᴏsᴛ ᴠɪᴘ ⚡
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

    for (const category of sortedCategories) {
      const emoji = categoryEmojis[category] || categoryEmojis['default'];
      menuText += `╭━━━〔 ${emoji} ${category.toUpperCase()} 〕\n`;

      const commandList = categories[category]
        .filter((cmd, index, self) => self.findIndex(c => c.name === cmd.name) === index) // evitar duplicados
        .map(cmd => `┃ ➺ ${cmd.name}`)
        .join('\n');

      menuText += `${commandList}\n`;
      menuText += `╰━━━━━━━━━━━━━━━━━━╯\n\n`;
    }

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