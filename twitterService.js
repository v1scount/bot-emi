const axios = require('axios');
const addOAuthInterceptor = require('axios-oauth-1.0a');

const axiosClient = axios.create();
const options = {
  algorithm: 'HMAC-SHA1',
  key: process.env.API_KEY,
  secret: process.env.API_KEY_SECRET,
  token: process.env.ACCESS_TOKEN,
  tokenSecret: process.env.ACCESS_TOKEN_SECRET,
};

addOAuthInterceptor.default(axiosClient, options);

let lastEmiTweet = '';

async function fetchLastEmiTweet() {
  try {
    const response = await axiosClient({
      method: 'get',
      url: 'https://api.x.com/2/users/817711994/tweets?exclude=replies%2Cretweets&max_results=1',
    });
    console.log(response.data);

    if (response.status === 200) {
      const newTweet = response.data.data[0]?.text;
      if (newTweet && newTweet !== lastEmiTweet) {
        lastEmiTweet = newTweet;
        return newTweet;
      }
    }
    return null;
  } catch (error) {
    console.error('Error fetching tweet:', error);
    throw error;
  }
}

module.exports = { fetchLastEmiTweet };