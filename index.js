import './config.js'
import { createRequire } from 'module'
import { fileURLToPath } from 'url'
import path from 'path'
import { makeWASocket } from './lib/simple.js'
import { Low, JSONFile } from 'lowdb'
import { DisconnectReason, useMultiFileAuthState } from '@whiskeysockets/baileys'
import P from 'pino'
import yargs from 'yargs'
import readline from 'readline'
import fs from 'fs'
import chalk from 'chalk'
import { DisconnectReason, useMultiFileAuthState, fetchLatestBaileysVersion, Browsers } from '@whiskeysockets/baileys'
import { makeWASocket } from './lib/simple.js'

console.log('Iniciando index.js mínimo...');

global.opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse())

async function start() {
    const { state, saveCreds } = await useMultiFileAuthState(global.vegetasessions)
    const { version } = await fetchLatestBaileysVersion()

    const methodCodeQR = process.argv.includes("qr")
    const methodCode = !!global.botNumber || process.argv.includes("code")
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
    const question = (texto) => new Promise((resolver) => rl.question(texto, resolver))
    let opcion
    if (methodCodeQR) {
        opcion = '1'
    }
    if (!methodCodeQR && !methodCode && !fs.existsSync(`./${global.vegetasessions}/creds.json`)) {
        do {
            opcion = await question(chalk.bold.white("Seleccione una opción:\n") + chalk.blueBright("1. Con código QR\n") + chalk.cyan("2. Con código de texto de 8 dígitos\n--> "))
            if (!/^[1-2]$/.test(opcion)) {
                console.log(chalk.bold.redBright(`No se permiten numeros que no sean 1 o 2, tampoco letras o símbolos especiales.`))
            }
        } while (opcion !== '1' && opcion !== '2' || fs.existsSync(`./${global.vegetasessions}/creds.json`))
    }

    const conn = makeWASocket({
        logger: P({ level: 'silent' }),
        printQRInTerminal: opcion == '1' ? true : methodCodeQR ? true : false,
        browser: opcion == '1' ? Browsers.macOS("Desktop") : methodCodeQR ? Browsers.macOS("Desktop") : Browsers.macOS("Chrome"),
        auth: state,
        version: version,
    })

    if (!fs.existsSync(`./${global.vegetasessions}/creds.json`)) {
        if (opcion === '2' || methodCode) {
            opcion = '2'
            if (!conn.authState.creds.registered) {
                let addNumber
                if (!!global.botNumber) {
                    addNumber = global.botNumber.replace(/[^0-9]/g, '')
                } else {
                    do {
                        let phoneNumber = await question(chalk.bgBlack(chalk.bold.greenBright(`[ ⚡️ ]  Por favor, Ingrese el número de WhatsApp.\n${chalk.bold.magentaBright('---> ')}`)))
                        phoneNumber = phoneNumber.replace(/\D/g, '')
                        if (!phoneNumber.startsWith('+')) {
                            phoneNumber = `+${phoneNumber}`
                        }
                        addNumber = phoneNumber.replace(/\D/g, '')
                    } while (addNumber.length === 0)
                    rl.close()
                }
                setTimeout(async () => {
                    let codeBot = await conn.requestPairingCode(addNumber)
                    codeBot = codeBot?.match(/.{1,4}/g)?.join("-") || codeBot
                    console.log(chalk.bold.white(chalk.bgMagenta(`[♡]  Código:`)), chalk.bold.white(chalk.white(codeBot)))
                }, 3000)
            }
        }
    }

    conn.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update
        if (connection === 'close') {
            console.log('Conexión cerrada, reconectando...');
            start()
        } else if (connection === 'open') {
            console.log('Conectado a WhatsApp');
        }
    })

    conn.ev.on('creds.update', saveCreds)
}

start()