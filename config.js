import { watchFile, unwatchFile } from 'fs' 
import chalk from 'chalk'
import { fileURLToPath } from 'url'
import fs from 'fs'
import fetch from 'node-fetch'
import axios from 'axios'
import moment from 'moment-timezone' 

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

//BETA: Si quiere evitar escribir el número que será bot en la consola, agregué desde aquí entonces:
//Sólo aplica para opción 2 (ser bot con código de texto de 8 digitos)
global.botNumber = '' //Ejemplo: 573218138672

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.owner = [
// <-- Número @s.whatsapp.net -->
  ['573133374132', 'Creador', true],
  ['176742836768966'],
  ['176742836768966@lid'],

// <-- Número @lid -->
  ['176742836768966', 'lid', true],
  ['176742836768966', 'lid', true], 
  ['176742836768966', 'lid', true]
];

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.mods = []
global.suittag = [''] 
global.prems = []

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.libreria = 'Baileys'
global.baileys = 'V 6.7.17'  
global.languaje = 'Español'
global.vs = '2.13.2'
global.vsJB = '5.0'
global.nameqr = 'Gura-Ultra-MD' 
global.namebot = 'Gura-Ultra-MD'
global.vegetasessions = 'GuraSessions'
global.jadi = 'JadiBots' 
global.vegetaJadibts = true

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.packname = `Xzzys26 Gaara-Ultra-MD`
global.botname = '𝗚UR𝗔 𝗨𝗟𝗧𝗥𝗔-𝗠𝗗'
global.dev = '𝙿𝙾𝚆𝙴𝚁𝙳 𝙱𝚈 YO SOY YO'
global.textbot = '𝐆u𝐫𝐚 𝐔𝐥𝐭𝐫𝐚-𝐌𝐃'

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.moneda = 'coin'
global.welcom1 = '𝙀𝙙𝙞𝙩𝙖 𝘾𝙤𝙣 𝙀𝙡 𝘾𝙤𝙢𝙖𝙣𝙙𝙤 𝙎𝙚𝙩𝙬𝙚𝙡𝙘𝙤𝙢𝙚'
global.welcom2 = '𝙀𝙙𝙞𝙩𝙖 𝘾𝙤𝙣 𝙀𝙡 𝘾𝙤𝙢𝙖𝙣𝙙𝙤 𝙎𝙚𝙩𝙗𝙮𝙚'
global.banner = 'https://files.catbox.moe/ove7tq.jpg'
global.catalogo = 'https://files.catbox.moe/8sl0sc.jpg'

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒──ׄ─ׅ─ׄ─

global.gp1 = 'https://chat.whatsapp.com/CdXkcGZ3M8CF8VoeUau9ik?mode=ems_copy_t'
global.comunidad1 = 'https://chat.whatsapp.com/CMj2uXEY78pAHtCAby2gQh?mode=ems_copy_t'
global.channel = 'https://whatsapp.com/channel/0029VbAmMiM96H4KgBHZUn1z'
global.channel2 = 'https://whatsapp.com/channel/0029VbAmMiM96H4KgBHZUn1z'
global.md = ''
global.correo = ''

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

// global.catalogo = fs.readFileSync('./src/catalogo.jpg')
global.estilo = { key: {  fromMe: false, participant: `0@s.whatsapp.net`, ...(false ? { remoteJid: "5219992095479-1625305606@g.us" } : {}) }, message: { orderMessage: { itemCount : -999999, status: 1, surface : 1, message: global.packname, orderTitle: 'Bang', thumbnail: global.catalogo, sellerJid: '0@s.whatsapp.net'}}}
global.ch = {
ch1: '120363399729727124@newsletter',
ch2: "120363399729727124@newsletter",
ch3: "120363399729727124@newsletter"
}
global.multiplier = 100

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.fs = fs
global.fetch = fetch
global.axios = axios
global.moment = moment   

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
  unwatchFile(file)
  console.log(chalk.redBright("Update 'config.js'"))
  import(`${file}?update=${Date.now()}`)
})
