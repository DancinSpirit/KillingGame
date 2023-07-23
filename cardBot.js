const {Client, Events, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle, StringSelectMenuOptionBuilder, StringSelectMenuBuilder} = require("discord.js");
const db = require("./models");
const botFunctions = require("./botFunctions.js");

const bot = new Client({
    intents: [GatewayIntentBits.Guilds]
});

require('dotenv').config()
const TOKEN = process.env.TOKENTWO;

bot.login(TOKEN);

const runAtSpecificTimeOfDay = function(hour, minutes, func)
{
  const twentyFourHours = 86400000;
  const now = new Date();
  let eta_ms = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minutes, 0, 0).getTime() - now;
  if (eta_ms < 0)
  {
    eta_ms += twentyFourHours;
  }
  setTimeout(function() {
    //run once
    func();
    // run every 24 hours from now on
    setInterval(func, twentyFourHours);
  }, eta_ms);
}

bot.once(Events.ClientReady, event=>{
    console.log("Logged in as " + event.user.tag);
    runAtSpecificTimeOfDay(1,0,async ()=>{
        let waitingChannel = await bot.channels.cache.get("1124365634684321915");
        waitingChannel.send(`<@&${'1124365727915327538'}> This is an end of day reminder reminding you that it's your turn!`)
    })
})

bot.on("interactionCreate", async (interaction) =>{
    
})

bot.updateServer = async function(){
    let users = await db.User.find({}).populate({path: "cards.days",strictPopulate: false});
    for(let x=0; x<users.length; x++){
        if(!users[x].gamemaster){
            updatePlayerStory(users[x])
        }
    }
}

const updatePlayerStory = async function(player){
    let gameState = await db.GameState.findOne({});
    let storyChannel = await bot.channels.cache.get(player.discord.channels.cards.story);
}

module.exports = bot;