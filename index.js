require('dotenv').config()
const qrcode = require('qrcode-terminal');
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const addOAuthInterceptor = require('axios-oauth-1.0a');
const QRCode = require('qrcode')

const app = express()
const port = process.env.PORT || 3030;

app.listen(port, () => {
    
    const axiosClient = axios.create();
    const options = {
        algorithm: 'HMAC-SHA1',
        key:process.env.API_KEY,
        secret:process.env.API_KEY_SECRET,
        token:process.env.ACCESS_TOKEN,
        tokenSecret:process.env.ACCESS_TOKEN_SECRET,
    }
    const { Client, LocalAuth } = require('whatsapp-web.js');
    const client = new Client({
        puppeteer: {
            args: ['--no-sandbox'],
        }
    });
    addOAuthInterceptor.default(axiosClient, options)   
    
    
    
    
    client.on('qr', qr => { 
        QRCode.toString(qr,{type: 'terminal', small: true}, function (err, url) {
            console.log(url)
          })
    });
    
    client.on('ready', async () => {
        let lastEmiTweet = `Mi novia tiene más ganas de vicear al cs que io 😅😅`;
        let newTweet = false;
    
        console.log('Client is ready!');
        const sendMessage = async (tweet) => {
            await client.sendMessage('5493874035411-1529594598@g.us', tweet)
            console.log('mensaje enviado')
        }

        const sendControllMessage = async (response) => {
            await client.sendMessage('120363028011665348@g.us', response)
        }
        
        const fetchLastEmiTweet = async () => { 
            axiosClient({
                method: 'get',
                url: 'https://api.twitter.com/2/users/817711994/tweets?exclude=replies%2Cretweets&max_results=5',
            }).then((response) => {
                if(response.status === 502) {
                    fetchLastEmiTweet();
                } else if(response.status !== 200){
                    sendControllMessage(`${response.statusText}: La conexión estuvo esperando por mucho tiempo`)
                    setTimeout(() => fetchLastEmiTweet(), 1000)
                } else {
                    if(lastEmiTweet !== response.data.data[0]?.text) {
                        lastEmiTweet = response.data.data[0]?.text;
                        sendMessage(lastEmiTweet);
                        sendControllMessage(`${response.statusText}: Mensaje enviado \n ${lastEmiTweet}`)
                    }
                    else if(lastEmiTweet === response.data.data[0]?.text) {
                        console.log('nada nuevo');
                        newTweet = false;
                        sendControllMessage(`${response.statusText}: Ningún tweet nuevo`)
                    } else {
                        console.log('algo raro')
                        sendControllMessage(`${response.statusText}: Comprueba el bot`)
                        newTweet = false;
                    }
                }
            })
        }
        
        fetchLastEmiTweet();
    
        setInterval(() => {
            fetchLastEmiTweet();
        }, 1500000)
    
    });
    
    
    
    client.initialize();
     
})