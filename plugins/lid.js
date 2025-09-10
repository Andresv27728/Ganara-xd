const lidCommand = {
  name: "lid",
  category: "utilidades",
  description: "Muestra tus IDs de WhatsApp (LID o JID) con detalles.",

  async execute({ sock, msg }) {
    const from = msg.key.remoteJid;
    const isGroup = from.endsWith('@g.us');

    // Primer mensaje loader
    const loader = await sock.sendMessage(from, { text: "⏳ 𝙞𝙣𝙙𝙚𝙣𝙩𝙞𝙛𝙞𝙘𝙖𝙣𝙙𝙤 𝙐𝙣 𝙈𝙤𝙢𝙚𝙣𝙩𝙤..." }, { quoted: msg });

    // Etapa 2: actualizar loader
    setTimeout(async () => {
      await sock.sendMessage(from, { text: "🔍 𝘽𝙪𝙨𝙘𝙖𝙣𝙙𝙤 𝘿𝙖𝙩𝙤𝙨...", edit: loader.key });
    }, 1500);

    // Etapa 3: mostrar "resultados encontrados" y luego IDs
    setTimeout(async () => {
      // ID de participante (solo en grupos)
      const participantId = isGroup ? msg.key.participant : "⚠️ Disponible solo en grupos";

      // ID del chat (grupo o privado)
      const remoteJid = msg.key.remoteJid;

      // Tipo de ID del chat
      const chatType = remoteJid.includes(":") ? "🔑 LID" : "🆔 JID";

      // Tipo de ID del participante
      const participantType = isGroup
        ? (participantId.includes(":") ? "🔑 LID" : "🆔 JID")
        : "⚠️ No aplica";

      const result = `
📊 *Resultados encontrados*

👥 Chat ID: 
${remoteJid}
→ Tipo: ${chatType}

🙋 Participante ID: 
${participantId}
→ Tipo: ${participantType}

✅ Listo, ya tienes tus identificadores.

> ʙᴜsǫᴜᴅᴀ ʙʏ ɢᴀᴀʀᴀ ᴜʟᴛʀᴀ-ᴍᴅ 🌀
      `;

      await sock.sendMessage(from, { text: result.trim(), edit: loader.key });
    }, 3000);
  }
};

export default lidCommand;