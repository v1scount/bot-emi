require('dotenv').config();
const app = require('./server');
const { initializeWhatsAppClient } = require('./whatsappClient');

const port = process.env.PORT || 3030;

initializeWhatsAppClient().then(() => {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});