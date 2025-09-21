// 🌊🦈 Código creado x The Carlos 👑 
// 💙 No quiten créditos, Gura los está vigilando desde el océano ~

let handler = async (m, { conn, command }) => {
    // 📜 Lista de owners autorizados
    const OWNERS = ['18493907272', '5216631288816'];

    // Extraer número limpio
    const senderNumber = m.sender.replace(/[^0-9]/g, '');

    // 🔒 Verificación de permisos
    if (!OWNERS.includes(senderNumber)) {
        return conn.sendMessage(m.chat, { 
            text: '❌💦 *Solo Gura-sama (owner) puede usar este comando.*' 
        });
    }

    if (!global.mainBot) global.mainBot = null;
    if (!global.officialBots) global.officialBots = new Map();

    // ⚡ Verifica si un bot está realmente activo
    const isBotActive = (botConn) => botConn?.ws?.socket?.readyState === 1;

    // 📝 Registra un bot en la lista oficial
    const registerBot = (botConn, isMain = false) => {
        global.officialBots.set(botConn.user?.jid, { conn: botConn, active: true });
        if (isMain) global.mainBot = botConn;
    };

    // 🧹 Limpieza de bots inactivos
    const cleanupBots = () => {
        for (let [jid, bot] of global.officialBots) {
            if (!isBotActive(bot.conn)) {
                bot.active = false;
            }
        }
    };

    cleanupBots();

    // ⚡ Promover bot
    if (command === 'promotebot') {
        if (!global.mainBot || !isBotActive(global.mainBot)) {
            registerBot(conn, true);
            await conn.sendMessage(m.chat, { 
                text: '🌊🦈 *Gura ha proclamado a este bot como el PRINCIPAL!* 💙✨' 
            });
        } else if (global.mainBot === conn) {
            await conn.sendMessage(m.chat, { 
                text: '⚠️💦 Este bot ya es el *principal del océano*, no necesitas promoverlo más.' 
            });
        } else {
            registerBot(conn, false);
            await conn.sendMessage(m.chat, { 
                text: '🤖✨ Este bot fue registrado como *oficial*, pero no es el principal aún. 🌊' 
            });
        }
    }

    // ⚡ Consultar o reasignar main bot
    if (command === 'mainbot') {
        if (global.mainBot && isBotActive(global.mainBot)) {
            await conn.sendMessage(m.chat, { 
                text: '💙🦈 *Bot principal activo y conectado con las mareas.* 🌊✨' 
            });
        } else {
            let reassigned = false;
            for (let [jid, bot] of global.officialBots) {
                if (isBotActive(bot.conn)) {
                    global.mainBot = bot.conn;
                    reassigned = true;
                    await bot.conn.sendMessage(m.chat, { 
                        text: '⚠️🌊 El bot principal anterior fue arrastrado por la marea... Este bot ahora es el *principal de Gura*. 🦈' 
                    });
                    break;
                }
            }

            if (!reassigned) {
                registerBot(conn, true);
                await conn.sendMessage(m.chat, { 
                    text: '⚠️💦 No había bot principal activo.\n🌊 Este bot ahora es el *principal elegido por Gura*. ✅🦈' 
                });
            }
        }
    }
};

handler.command = ['promotebot', 'mainbot'];
handler.tags = ['owner'];
handler.help = ['promotebot', 'mainbot'];
handler.estrellas = 9;

export default handler;
