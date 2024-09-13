const express = require('express');
const bodyParser = require('body-parser');
const { fetchLastEmiTweet } = require('./twitterService');
const { sendMessage, sendControlMessage } = require('./messageService');

const app = express();

app.use(bodyParser.json());

app.post('/send-latest-tweet', async (req, res) => {
  try {
    const lastTweet = await fetchLastEmiTweet();
    if (lastTweet) {
    //   await sendMessage(lastTweet);
      await sendControlMessage(`OK: Message sent\n${lastTweet}`);
      res.status(200).json({ message: 'Tweet sent successfully', tweet: lastTweet });
    } else {
      await sendControlMessage('OK: No new tweet');
      res.status(200).json({ message: 'No new tweet found' });
    }
  } catch (error) {
    console.error('Error:', error);
    await sendControlMessage(`Error: ${error.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = app;