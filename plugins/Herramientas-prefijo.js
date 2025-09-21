let handler = async (m, { conn, args, usedPrefix, command }) => {
    let chat = global.db.data.chats[m.chat]
    if (!args[0]) throw `No se ha especificado ningún prefijo. Uso: ${usedPrefix + command} .`

    let prefix = args[0]
    if (prefix.toLowerCase() === 'none' || prefix.toLowerCase() === 'sinprefijo') {
        prefix = ''
    }

    chat.prefix = prefix
    m.reply(`El prefijo se ha cambiado a: ${prefix || 'ninguno'}`)
}

handler.help = ['prefix <prefijo|none>']
handler.tags = ['group']
handler.command = ['prefix', 'prefijo']
handler.admin = true
handler.group = true

export default handler
