import { areJidsSameUser } from '@whiskeysockets/baileys'

export async function before(m, { participants, conn }) {
    if (m.isGroup) {
        let chat = global.db.data.chats[m.chat];

        if (!chat.antiBot2) {
            return
        }

        let botJid = global.conn.user.jid // 🦈 JID del bot principal (Gura-sama)

        if (botJid === conn.user.jid) {
            return
        } else {
            let isBotPresent = participants.some(p => areJidsSameUser(botJid, p.id))

            if (isBotPresent) {
                setTimeout(async () => {
                    await conn.reply(
                        m.chat, 
                        `🌊🦈 *Gawr Gura-Bot* ha detectado otro tiburón en el océano 🦈🌊

> ⚠️ En este grupo ya nada el *Bot Principal*.  
> Para evitar maremotos de *SPAM*, me retiro suavemente~ 💦

*(bye-bye, shaaaark~ 🐟)*`, 
                        m, 
                        rcanal
                    );
                    await this.groupLeave(m.chat)
                }, 5000) // 5 segundos ⏳
            }
        }
    }
}
