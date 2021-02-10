const { Client } = require('discord.js')
const axios = require('axios')
require('dotenv').config()

const markets = [
  {code:"BTCCLP", token: process.env.BTCCLP , client: new Client(), name: "BTC", icon: "฿"},
  {code:"ETHCLP", token: process.env.ETHCLP, client: new Client(), name: "ETH", icon: "Ξ"}
]

for(const market of markets){
  market.client.on('ready', async () =>{
    const ticker = await currencies()
    const thisTicker = ticker[market.name]
    let arrow = '▲';
    let color = '00FC0F';
    if(thisTicker.vari < 0){
    arrow = '▼';
    color = 'FC0000';
    }
    const guild = market.client.guilds.cache.get('453589841268178955').member(market.client.user)
    guild.setNickname(`${market.name} ${market.icon} ${arrow} ${thisTicker.lastPrice}`).then(user => console.log(`User : ${user}`)).catch(console.error)
    const role = market.client.guilds.cache.get('453589841268178955').roles.cache.find(role => role.name === market.name)
    role.setColor(color).catch(console.error)
    market.client.user.setActivity(`${market.icon} 24h: ${thisTicker.vari}%`, {type: "WATCHING"}).catch(console.error)
  })
  market.client.login(market.token)
}

async function currencies(){
  try{
    const response = await axios.get('https://stats.orionx.com/ticker')
    const res = {}
    for(const market of markets){
      res[market.name] = {lastPrice: response.data[market.code].lastPrice, vari : Math.round(response.data[market.code].variation24h * 100) / 100}
    }
    return res;
  } catch (err) {
    console.error(err)
  }
}

async function update(){
  for(const market of markets){
    const ticker = await currencies()
    const thisTicker = ticker[market.name]
    let arrow = '▲';
    let color = '00FC0F';
    if(thisTicker.vari < 0){
    arrow = '▼';
    color = 'FC0000';
    }
    const guild = market.client.guilds.cache.get('453589841268178955').member(market.client.user)
    guild.setNickname(`${market.name} ${market.icon} ${arrow} ${thisTicker.lastPrice}`).catch(console.error)
    const role = market.client.guilds.cache.get('453589841268178955').roles.cache.find(role => role.name === market.name)
    role.setColor(color).catch(console.error)
    market.client.user.setActivity(`${market.icon} 24h: ${thisTicker.vari}%`, {type: "WATCHING"}).catch(console.error)
  }
}

setInterval(async ()=>{
  await update()
},5000)
