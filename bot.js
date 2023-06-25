const {Client, Events, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle} = require("discord.js");
const db = require("./models");

const bot = new Client({
    intents: [GatewayIntentBits.Guilds]
});

require('dotenv').config()
const TOKEN = process.env.TOKEN;

bot.login(TOKEN);

bot.once(Events.ClientReady, event=>{
    console.log("Logged in as " + event.user.tag);
    updateServer();
})

bot.on("interactionCreate", async (interaction) =>{
    if(interaction.isButton()){
        if(interaction.customId=="reactContinue"){
            let user = interaction.user;
            let gameState = await db.GameState.findOne({});
            let player = await db.User.findOne({"discord.id": user.id});
            let day = await db.Day.findById(player.despair.days[gameState.day-1])
            day[gameState.phase][day[gameState.phase].length-1] = "[ACT]Continue"
            day.save();
            interaction.message.delete();
            updateServer();
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
        let day = await db.Day.findById(player.despair.days[gameState.day-1])
        day[gameState.phase][day[gameState.phase].length-1] = "[ACT]" + action;
        day.save(); 
        interaction.message.delete();
        await interaction.reply({content:"Successful submission!"})
        interaction.deleteReply();
        updateServer();
        }
    }
})

const updateServer = async function(){
    let users = await db.User.find({}).populate("despair.days");
    for(let x=0; x<users.length; x++){
        if(!users[x].gamemaster){
            updatePlayerStory(users[x])
        }
    }
}

const updatePlayerStory = async function(player){
    let gameState = await db.GameState.findOne({});
    let storyChannel = await bot.channels.cache.get(player.discord.channels.story);
    for(let x=player.despair.currentDay-1; x<gameState.day; x++){
        for(let y=player.despair.currentLine+1; y<player.despair.days[x][player.despair.currentPhase].length; y++){
            await sendStoryText(storyChannel,player.despair.days[x][player.despair.currentPhase][y]);
        }
        player.despair.currentLine = 0;
        //player.despair.currentPhase = getnextPhasefromPointervariable
        //if phase matches do it one more time other wise do again or whatever might ahve to make another function
    }
    player.despair.currentDay = gameState.day;
    player.despair.currentPhase = gameState.phase;
    player.despair.currentLine = player.despair.days[gameState.day-1][gameState.phase].length-1;
    player.save();
    let gamemasterWaiting = false;
    let guild = await bot.guilds.cache.get("659245797333925919")
    let gamemaster = await guild.members.fetch("206648363729289216");
    let user = await guild.members.fetch(player.discord.id)
    if(player.despair.days[gameState.day-1][gameState.phase][player.despair.currentLine].includes("RE:ACT")){
        user.roles.add("660664223625641994")
    }else if(player.despair.days[gameState.day-1][gameState.phase][player.despair.currentLine].includes("[ACT]")){
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

const sendStoryText = async function(storyChannel,sentText){
    return new Promise(async (resolve)=>{
        if(sentText.includes("[")){
            let command = sentText.replace("[","").split(`]`)[0];
            let text = sentText.replace("[","").split(`${command}]`)[1];
            switch(command){
                case "SCENE TRANSITION":
                    resolve();
                    break;
                case "MUSIC":
                    resolve();
                    break;
                case "ACTIVE OPTION":
                    let titleR = text.split("|")[1]
                    let descriptionR = text.split("|")[0]
                    let optionsNumberR = text.split("|")[2]

                    resolve();
                    break;
                case "OPTION":
                    //Description|Title|NUMofOPTIONS|{OPTIONS WITH CHOSEN OPTION HAVING <CHOSEN>}
                    let title = text.split("|")[1]
                    let description = text.split("|")[0]
                    let optionEmbed = new EmbedBuilder()
                        .setTitle(title)
                        .setDescription(description)
                    let optionsNumber = text.split("|")[2]
                    let optionsNumberTwo = parseInt(optionsNumber)+3;
                    let optionButtons = [];
                    for(let x=3; x<optionsNumberTwo; x++){
                        let option = text.split("|")[x];
                        if(option.includes("<CHOSEN>")){
                            optionButtons.push(new ButtonBuilder()
                                .setCustomId("optionButton"+(x+1))
                                .setLabel(option.split(">")[1])
                                .setStyle(ButtonStyle.Success)
                                .setDisabled(true))
                        }else{
                            optionButtons.push(new ButtonBuilder()
                                .setCustomId("optionButton"+(x+1))
                                .setLabel(option)
                                .setStyle(ButtonStyle.Secondary)
                                .setDisabled(true))
                        }
                    }
                    let optionsRow = new ActionRowBuilder()
                        .addComponents(...optionButtons)
                    await storyChannel.send({
                        embeds: [optionEmbed], 
                        components: [optionsRow]
                    })
                    resolve();
                    break;
                case "CHARACTER":
                    //character.firstName|Text Name|Dialogue
                    let firstName = text.split("|")[0]
                    let characterName = text.split("|")[1];
                    let dialogue = text.split("|")[2];
                    let characterEmbed = new EmbedBuilder()
                        .setAuthor({name: characterName, iconURL:`attachment://${firstName}.png`})
                        .setDescription(dialogue);
                    await storyChannel.send({ embeds: [characterEmbed], files: [`./public/avatars/${firstName}.png`]});
                    resolve();
                    break;
                case "ACT":
                    resolve();
                    break;
                case "RE:ACT":
                    let reactEmbed = new EmbedBuilder()
                        .setTitle("RE:ACT")
                        .setDescription("RE:ACT Opportunity! Either RE:ACT or continue.")
                    let reactContinue = new ButtonBuilder()
                        .setCustomId("reactContinue")
                        .setLabel("Continue")
                        .setStyle(ButtonStyle.Secondary)
                    let reactReact = new ButtonBuilder()
                        .setCustomId("reactReact")
                        .setLabel("RE:ACT")
                        .setStyle(ButtonStyle.Primary)
                    let reactRow = new ActionRowBuilder()
                        .addComponents(reactReact, reactContinue);
                    await storyChannel.send({
                        embeds: [reactEmbed],
                        components: [reactRow]
                    })
                    resolve();
                    break;
                default:
                    await storyChannel.send(text);
                    resolve();
            }
        }else{
            await storyChannel.send(sentText);
            resolve();
        }
    })
}

module.exports = bot;