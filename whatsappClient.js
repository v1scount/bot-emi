const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

let client;

function initializeWhatsAppClient() {
  return new Promise((resolve) => {
    client = new Client({
      puppeteer: {
        args: ['--no-sandbox'],
      }
    });

    client.on('qr', (qr) => {
      qrcode.generate(qr, { small: true });
    });

    client.on('ready', () => {
      console.log('WhatsApp client is ready!');
      resolve();
    });

    client.initialize();
  });
}

module.exports = { initializeWhatsAppClient, getClient: () => client };