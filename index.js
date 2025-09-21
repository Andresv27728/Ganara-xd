import './config.js'
import { createRequire } from 'module'
import { fileURLToPath } from 'url'
import path from 'path'
import { makeWASocket } from './lib/simple.js'
import { Low, JSONFile } from 'lowdb'
import { DisconnectReason, useMultiFileAuthState } from '@whiskeysockets/baileys'
import P from 'pino'

console.log('Iniciando index.js mínimo...');

async function start() {
  const { state, saveCreds } = await useMultiFileAuthState(global.vegetasessions)
  const conn = makeWASocket({
    logger: P({ level: 'silent' }),
    printQRInTerminal: true,
    auth: state,
  })

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