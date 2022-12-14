require('dotenv').config()
const qrcode = require('qrcode-terminal');
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express()
const port = process.env.PORT || 3030;

app.listen(port, () => {

    const { Client, LocalAuth } = require('whatsapp-web.js');
    const client = new Client();
    
    
    
    
    
    client.on('qr', qr => { 
        qrcode.generate(qr, {small: true});
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
            axios({
                method: 'get',
                url: 'https://api.twitter.com/2/users/817711994/tweets?exclude=replies%2Cretweets&max_results=5',
                headers: {
                    Authorization: `Bearer ${process.env.BEARER_TOKEN_TWITTER}`
                }
            }).then((response) => {
                console.log('TWEETS', response.data)
                if(response.status === 502) {
                    fetchLastEmiTweet();
                } else if(response.status !== 200){
                    console.log(response.statusText);
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
        }, 300000)
    
    });
    
    
    
    client.initialize();
     
})