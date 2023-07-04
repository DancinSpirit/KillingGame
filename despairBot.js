const {Client, Events, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle, StringSelectMenuOptionBuilder, StringSelectMenuBuilder} = require("discord.js");
const db = require("./models");
const botFunctions = require("./botFunctions.js")

const bot = new Client({
    intents: [GatewayIntentBits.Guilds]
});

require('dotenv').config()
const TOKEN = process.env.TOKEN;

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
        let waitingChannel = await bot.channels.cache.get("799874873714802739");
        waitingChannel.send(`<@&${'660664223625641994'}> This is an end of day reminder reminding you that it's your turn!`)
    })
})

bot.on("interactionCreate", async (interaction) =>{
    if(interaction.isButton()){
        if(interaction.customId=="reactContinue"){
            let user = interaction.user;
            let gameState = await db.GameState.findOne({});
            let player = await db.User.findOne({"discord.id": user.id});
            let day = await db.Day.findById(player.despair.chapters[gameState.chapter-1].days[gameState.day-1])
            day[gameState.phase][day[gameState.phase].length-1] = "[ACT]Continue"
            day.save();
            interaction.message.delete();
            bot.updateServer();
        }
        if(interaction.customId=="reactReact"){
            let modal = new ModalBuilder()
                .setCustomId("reactModal")
                .setTitle("RE:ACT!")
            let reactInput = new TextInputBuilder()
                .setCustomId("reactInput")
                .setLabel("What do you do?")
                .setStyle(TextInputStyle.Paragraph)
            let reactInputRow = new ActionRowBuilder().addComponents(reactInput);
            modal.addComponents(reactInputRow);
            await interaction.showModal(modal);
        }
    }
    if(interaction.isModalSubmit()){
        if(interaction.customId == "reactModal"){
        const action = interaction.fields.getTextInputValue("reactInput")
        let user = interaction.user;
        let gameState = await db.GameState.findOne({});
        let player = await db.User.findOne({"discord.id": user.id});
        let day = await db.Day.findById(player.despair.chapters[gameState.chapter-1].days[gameState.day-1])
        day[gameState.phase][day[gameState.phase].length-1] = "[ACT]" + action;
        day.save(); 
        interaction.message.delete();
        await interaction.reply({content:"Successful submission!"})
        interaction.deleteReply();
        bot.updateServer();
        }
    }
    if(interaction.customId=="investigationContinue"){
        let user = interaction.user;
        let gameState = await db.GameState.findOne({});
        let player = await db.User.findOne({"discord.id":user.id})
        let day = await db.Day.findById(player.despair.chapters[gameState.chapter-1].days[gameState.day-1])
        day[gameState.phase][day[gameState.phase].length-1] = "[ACT]" + interaction.values;
        day.save();
        interaction.message.delete();
        await interaction.reply({content:"Successful submission!"})
        interaction.deleteReply();
        bot.updateServer();
    }
})

bot.updateServer = async function(){
    let users = await db.User.find({}).populate({path: "despair.chapters.days",strictPopulate: false});
    for(let x=0; x<users.length; x++){
        if(!users[x].gamemaster){
            updatePlayerStory(users[x])
        }
    }
    //Below is stuff written for updating phases, should do it all at once with a bot command instead of reading from the text.
    /*  if(text == "Free Time"){
                        text = "freeTime";
                    }
                    if(text == "Morning"){
                        text = "morning";
                    }
                    gameState.phase = text;
                    gameState.save();
                    player.despair.currentLine = -1;
                    player.despair.currentPhase = text;
                    let day = await db.Day.findById(player.despair.chapters[gameState.chapter-1].days[gameState.day-1]);
                    day[text] = [""];
                    console.log(day);
                    player.save();
                    day.save();
                    if(text =="freeTime"){
                        text = "Free Time!"
                    }
                    if(text == "morning"){
                        text = "Morning Phase!"
                    }
                    let phaseShiftEmbed = new EmbedBuilder()
                        .setTitle(text)
                    await storyChannel.send({embeds: [phaseShiftEmbed]}) */
}

const updatePlayerStory = async function(player){
    let gameState = await db.GameState.findOne({});
    let storyChannel = await bot.channels.cache.get(player.discord.channels.despair.story);
    for(let x=player.despair.currentDay-1; x<gameState.day; x++){
        for(let y=player.despair.currentLine+1; y<player.despair.chapters[gameState.chapter-1].days[x][player.despair.currentPhase].length; y++){
            await botFunctions.sendStoryText(storyChannel,player.despair.chapters[gameState.chapter-1].days[x][player.despair.currentPhase][y],player);
        }
        player.despair.currentLine = 0;
        //player.despair.currentPhase = getnextPhasefromPointervariable
        //if phase matches do it one more time other wise do again or whatever might ahve to make another function
    }
    player.despair.currentDay = gameState.day;
    player.despair.currentPhase = gameState.phase;
    player.despair.currentLine = player.despair.chapters[gameState.chapter-1].days[gameState.day-1][gameState.phase].length-1;
    player.save();
    let gamemasterWaiting = false;
    let guild = await bot.guilds.cache.get("659245797333925919")
    let gamemaster = await guild.members.fetch("206648363729289216");
    let user = await guild.members.fetch(player.discord.id)
    if(player.despair.chapters[gameState.chapter-1].days[gameState.day-1][gameState.phase][player.despair.currentLine]>0){
        if(player.despair.chapters[gameState.chapter-1].days[gameState.day-1][gameState.phase][player.despair.currentLine].includes("RE:ACT")){
            user.roles.add("660664223625641994")
        }else if(player.despair.chapters[gameState.chapter-1].days[gameState.day-1][gameState.phase][player.despair.currentLine].includes("[ACT]")){
            user.roles.remove("660664223625641994")
            gamemasterWaiting = true;
        }else{
            user.roles.remove("660664223625641994")
        }
        if(gamemasterWaiting ==true){
            gamemaster.roles.add("660664223625641994")
        }else{
            gamemaster.roles.remove("660664223625641994")
        }
    }
}

module.exports = bot;