const { getClient } = require('./whatsappClient');

async function sendMessage(tweet) {
  const client = getClient();
  await client.sendMessage('5493874035411-1529594598@g.us', tweet);
  console.log('Message sent');
}

async function sendControlMessage(response) {
  const client = getClient();
  await client.sendMessage('120363028011665348@g.us', response);
}

module.exports = { sendMessage, sendControlMessage };