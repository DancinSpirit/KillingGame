const camMasterChan = 1373690432546148442;
const krisMasterChan = 1373690332474118155;
const emiMasterChan = 1373690599332380772;
const tinaMasterChan = 1373690599332380772;


const {Client, Events, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle, StringSelectMenuOptionBuilder, StringSelectMenuBuilder} = require("discord.js");
const db = require("./models");
const botFunctions = require("./botFunctions.js")

const bot = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
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

bot.on("messageCreate", async(message)=>{
    if(message.author.id == 206648363729289216){
        let users = await db.User.find().populate({path: "despair.chapters.days",strictPopulate: false});;
        for(let x=0; x<users.length; x++){
            if(!users[x].gamemaster){
                if(message.channel.id == users[x].discord.channels.despair.gamemaster){
                    let user = users[x];
                    let day = await db.Day.findById(user.despair.chapters[user.despair.currentChapter-1].days[user.despair.currentDay-1])
                    await botFunctions.saveGamemasterText(day,user.despair.currentPhase,message.content, user)
                    bot.updateServer()
                }
            }
        }
    }
})

bot.on("interactionCreate", async (interaction) =>{
    bot.updateServer();
    if(interaction.customId.includes("submitSocial")){
        let user = interaction.user;
        let player = await db.User.findOne({"discord.id": user.id});
        let day = await db.Day.findById(player.despair.chapters[player.despair.currentChapter-1].days[player.despair.currentDay-1])
        if(day[player.despair.currentPhase][day[player.despair.currentPhase].length-1].includes("Unselected")){
        
        }else{
            interaction.message.delete()
            await interaction.reply({content:"Successful submission!"})
            interaction.deleteReply();
        }
    }
    if(interaction.customId.includes("submitMixed")){
        let user = interaction.user;
        let player = await db.User.findOne({"discord.id": user.id});
        let day = await db.Day.findById(player.despair.chapters[player.despair.currentChapter-1].days[player.despair.currentDay-1])
        if(day[player.despair.currentPhase][day[player.despair.currentPhase].length-1].includes("Unselected")){
            
        }else{
            interaction.message.delete()
            await interaction.reply({content:"Successful submission!"})
            interaction.deleteReply();
        }
    }
    if(interaction.customId.includes("socialMenu")){
        let user = interaction.user;
        let player = await db.User.findOne({"discord.id": user.id});
        let day = await db.Day.findById(player.despair.chapters[player.despair.currentChapter-1].days[player.despair.currentDay-1])
        let fullString = "";
        if(interaction.customId.includes("Mixed")){
            let x = interaction.customId.split("Menu")[1].split("Mixed")[0];
            let stringPart1 = "[ACT][FREE TIME START]MIXED"
            let stringPart2 = day[player.despair.currentPhase][day[player.despair.currentPhase].length-1].split("|")[1]
            let stringPart3 = day[player.despair.currentPhase][day[player.despair.currentPhase].length-1].split("|")[2]
            let stringPart4 = day[player.despair.currentPhase][day[player.despair.currentPhase].length-1].split("|")[3]
            if(x==1){
                stringPart2 = interaction.values;
            }
            if(x==2){
                stringPart3 = interaction.values
            }
            fullString = stringPart1 + "|" + stringPart2 + "|" + stringPart3 + "|" + stringPart4;
        }else{
            let x = interaction.customId.split("Menu")[1];
            let stringPart1 = "[ACT][FREE TIME START]SOCIAL"
            let stringPart2 = day[player.despair.currentPhase][day[player.despair.currentPhase].length-1].split("|")[1]
            let stringPart3 = day[player.despair.currentPhase][day[player.despair.currentPhase].length-1].split("|")[2]
            let stringPart4 = day[player.despair.currentPhase][day[player.despair.currentPhase].length-1].split("|")[3]
            if(x==1){
                stringPart2 = interaction.values;
            }
            if(x==2){
                stringPart3 = interaction.values
            }
            if(x==3){
                stringPart4 = interaction.values
            }
            fullString = stringPart1 + "|" + stringPart2 + "|" + stringPart3 + "|" + stringPart4;
        }
        day[player.despair.currentPhase][day[player.despair.currentPhase].length-1] = fullString;
        day.save();
        await interaction.reply({content:"Successful submission!"})
        interaction.deleteReply();
    }
    if(interaction.isButton()){
        if(interaction.customId=="reactContinue"){
            let user = interaction.user;
            let player = await db.User.findOne({"discord.id": user.id});
            let day = await db.Day.findById(player.despair.chapters[player.despair.currentChapter-1].days[player.despair.currentDay-1])
            day[player.despair.currentPhase][day[player.despair.currentPhase].length-1] = "[ACT]Continue"
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
        if(interaction.customId=="actionButton"){
            let user = interaction.user;
            let player = await db.User.findOne({"discord.id": user.id});
            let day = await db.Day.findById(player.despair.chapters[player.despair.currentChapter-1].days[player.despair.currentDay-1])
            day[player.despair.currentPhase][day[player.despair.currentPhase].length-1] = "[ACT][FREE TIME START]ACTION|Unselected|Unselected";
            day.save();
            let actionModal = new ModalBuilder()
                .setCustomId("actionModal")
                .setTitle("2 Actions")
            let actionOneInput = new TextInputBuilder()
                .setCustomId("actionOneInput")
                .setLabel("Action 1:")
                .setStyle(TextInputStyle.Paragraph)
            let actionTwoInput = new TextInputBuilder()
                .setCustomId("actionTwoInput")
                .setLabel("Action 2:")
                .setStyle(TextInputStyle.Paragraph)
            let actionInputRow = new ActionRowBuilder().addComponents(actionOneInput);
            let actionInputRow2 = new ActionRowBuilder().addComponents(actionTwoInput);
            actionModal.addComponents(actionInputRow,actionInputRow2);
            await interaction.showModal(actionModal);
        }
        if(interaction.customId=="socialButton"){
            let user = interaction.user;
            let player = await db.User.findOne({"discord.id": user.id});
            let day = await db.Day.findById(player.despair.chapters[player.despair.currentChapter-1].days[player.despair.currentDay-1])
            day[player.despair.currentPhase][day[player.despair.currentPhase].length-1] = "[ACT][FREE TIME START]SOCIAL|Unselected|Unselected|Unselected";
            day.save();
            let students = [];
            for(let x=0; x<player.despair.reportCards.length; x++){
                if(player.despair.reportCards[x] != player.despair.fullReport){
                    let student = await db.ReportCard.findById(player.despair.reportCards[x]);
                    if(!student.dead){
                        studentButton = new StringSelectMenuOptionBuilder()
                            .setLabel(student.firstName + " " + student.lastName)
                            .setValue(student.firstName + " " + student.lastName)
                        students.push(studentButton);  
                    }
                }
            }
            let socialMenu1 = new StringSelectMenuBuilder()
                .setCustomId("socialMenu1")
                .setPlaceholder("Socialization Partner")
                .addOptions(...students)
            let socialMenu2 = new StringSelectMenuBuilder()
                .setCustomId("socialMenu2")
                .setPlaceholder("Socialization Partner")
                .addOptions(...students)
            let socialMenu3 = new StringSelectMenuBuilder()
                .setCustomId("socialMenu3")
                .setPlaceholder("Socialization Partner")
                .addOptions(...students)
            let socialEmbed = new EmbedBuilder()
                .setTitle("Socialize With Who?")
            let socialInputRow = new ActionRowBuilder().addComponents(socialMenu1);
            let socialInputRow2 = new ActionRowBuilder().addComponents(socialMenu2);
            let socialInputRow3 = new ActionRowBuilder().addComponents(socialMenu3);
            let submitButton = new ButtonBuilder()
                .setCustomId("submitSocial")
                .setLabel("Submit")
                .setStyle(ButtonStyle.Primary)
            let submitRow = new ActionRowBuilder().addComponents(submitButton)
            interaction.message.delete();
            await interaction.reply({embeds:[socialEmbed],components:[socialInputRow,socialInputRow2,socialInputRow3,submitRow]})
        }
        if(interaction.customId=="mixedButton"){
            let mixedModal = new ModalBuilder()
                .setCustomId("mixedModal")
                .setTitle("1 Action")
            let actionOneInput = new TextInputBuilder()
                .setCustomId("actionOneInput")
                .setLabel("Action 1:")
                .setStyle(TextInputStyle.Paragraph)
            let user = interaction.user;
            let player = await db.User.findOne({"discord.id": user.id});
            let day = await db.Day.findById(player.despair.chapters[gameState.chapter-1].days[gameState.day-1])
            day[player.despair.currentPhase][day[player.despair.currentPhase].length-1] = "[ACT][FREE TIME START]MIXED|Unselected|Unselected|Unselected";
            day.save();
            let mixedInputRow = new ActionRowBuilder().addComponents(actionOneInput);
            mixedModal.addComponents(mixedInputRow);
            await interaction.showModal(mixedModal);
        }
    }
    if(interaction.isModalSubmit()){
        if(interaction.customId == "actionModal"){
            let action = interaction.fields.getTextInputValue("actionOneInput");
            let actionTwo = interaction.fields.getTextInputValue("actionTwoInput");
            let user = interaction.user;
            let player = await db.User.findOne({"discord.id": user.id});
            let day = await db.Day.findById(player.despair.chapters[gameState.chapter-1].days[gameState.day-1])
            day[player.despair.currentPhase][day[player.despair.currentPhase].length-1] = "[ACT][FREE TIME START]ACTION|" + action + "|" + actionTwo;
            day.save();
            interaction.message.delete();
            await interaction.reply({content:"Successful submission!"})
            interaction.deleteReply();
            bot.updateServer();
        }
        if(interaction.customId == "mixedModal"){
            let action = interaction.fields.getTextInputValue("actionOneInput");
            let user = interaction.user;
            let player = await db.User.findOne({"discord.id": user.id});
            let day = await db.Day.findById(player.despair.chapters[gameState.chapter-1].days[gameState.day-1])
            day[player.despair.currentPhase][day[player.despair.currentPhase].length-1] = "[ACT][FREE TIME START]ACTION|Unselected|Unselected|" + action;
            day.save();
            let students = [];
            for(let x=0; x<player.despair.reportCards.length; x++){
                if(player.despair.reportCards[x] != player.despair.fullReport){
                    let student = await db.ReportCard.findById(player.despair.reportCards[x]);
                    if(!student.dead){
                        studentButton = new StringSelectMenuOptionBuilder()
                            .setLabel(student.firstName + " " + student.lastName)
                            .setValue(student.firstName + " " + student.lastName)
                        students.push(studentButton); 
                    }
                }
            }
            let socialMenu1 = new StringSelectMenuBuilder()
                .setCustomId("socialMenu1Mixed")
                .setPlaceholder("Socialization Partner")
                .addOptions(...students)
                .setMinValues(0)
                .setMaxValues(students.length)
            let socialMenu2 = new StringSelectMenuBuilder()
                .setCustomId("socialMenu2Mixed")
                .setPlaceholder("Socialization Partner")
                .addOptions(...students)
                .setMinValues(0)
                .setMaxValues(students.length)
            //add social drop down menu
            let mixedInputRow2 = new ActionRowBuilder().addComponents(socialMenu1)
            let mixedInputRow3 = new ActionRowBuilder().addComponents(socialMenu2)
            let submitButton = new ButtonBuilder()
                .setCustomId("submitMixed")
                .setLabel("Submit")
                .setStyle(ButtonStyle.Primary)
            let submitRow = new ActionRowBuilder().addComponents(submitButton)
            let mixedEmbed = new EmbedBuilder()
                .setTitle("Socialize With Who?")
            interaction.message.delete();
            interaction.reply({embeds: [mixedEmbed],components:[mixedInputRow2,mixedInputRow3,submitRow]})
        }
        if(interaction.customId == "reactModal"){
            let action = interaction.fields.getTextInputValue("reactInput")
            let user = interaction.user;
            let player = await db.User.findOne({"discord.id": user.id});
            let day = await db.Day.findById(player.despair.chapters[gameState.chapter-1].days[gameState.day-1])
            day[player.despair.currentPhase][day[player.despair.currentPhase].length-1] = "[ACT]" + action;
            day.save(); 
            interaction.message.delete();
            await interaction.reply({content:"Successful submission!"})
            interaction.deleteReply();
            bot.updateServer();
        }
    }
    if(interaction.customId=="investigationContinue"){
        let user = interaction.user;
        let player = await db.User.findOne({"discord.id":user.id})
        let day = await db.Day.findById(player.despair.chapters[gameState.chapter-1].days[gameState.day-1])
        day[player.despair.currentPhase][day[player.despair.currentPhase].length-1] = "[ACT]" + interaction.values;
        day.save();
        interaction.message.delete();
        await interaction.reply({content:"Successful submission!"})
        interaction.deleteReply();
        bot.updateServer();
    }
    if(interaction.customId.includes("optionButton")){
        let optionNumber = interaction.customId.split("optionButton")[1];
        let user = interaction.user;
        let player = await db.User.findOne({"discord.id": user.id});
        let day = await db.Day.findById(player.despair.chapters[gameState.chapter-1].days[gameState.day-1]);
        let line = day[gameState.phase][day[gameState.phase].length-1];
        let option = line.split("|")[optionNumber];
        day[player.despair.currentPhase][day[player.despair.currentPhase].length-1] = "[ACT]" + option;
        day[player.despair.currentPhase].push(line.split(option)[0].split("[RE:ACT]")[1] + "<CHOSEN>" + option + line.split(option)[1]);
        day.save();
        interaction.message.delete();
        await interaction.reply({content:"Successful submission!"})
        interaction.deleteReply();
        bot.updateServer();
    }
})

bot.sendEmbedWithDescrip = async function(embedTitle,embedDescription,channelId){
    let channel = await bot.channels.cache.get(channelId);
    let customEmbed = new EmbedBuilder()
        .setTitle(embedTitle)
        .setDescription(embedDescription)
    channel.send({embeds: [customEmbed]});
}

bot.sendEmbed = async function(embedTitle,channelId){
    let channel = await bot.channels.cache.get(channelId);
    let customEmbed = new EmbedBuilder()
        .setTitle(embedTitle)
    channel.send({embeds: [customEmbed]});
}

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
    let gameState = await db.GameState.findOne();
    let storyChannel = await bot.channels.cache.get(player.discord.channels.despair.story);
    let gamemasterChannel = await bot.channels.cache.get(player.discord.channels.despair.gamemaster);
    for(let x=player.despair.currentDay-1; x<gameState.day; x++){
        for(let y=player.despair.currentLine+1; y<player.despair.chapters[player.despair.currentChapter-1].days[x][player.despair.currentPhase].length; y++){
            await botFunctions.sendStoryText(storyChannel,gamemasterChannel, player.despair.chapters[player.despair.currentChapter-1].days[x][player.despair.currentPhase][y],player);
        }
        player.despair.currentLine = 0;
    }
    player.despair.currentLine = player.despair.chapters[player.despair.currentChapter-1].days[player.despair.currentDay-1][player.despair.currentPhase].length-1;
    player.save();
    let gamemasterWaiting = false;
    let guild = await bot.guilds.cache.get("659245797333925919")
    let gamemaster = await guild.members.fetch("206648363729289216");
    let user = await guild.members.fetch(player.discord.id)
    if(player.despair.chapters[player.despair.currentChapter-1].days[player.despair.currentDay-1][player.despair.currentPhase][player.despair.currentLine]){
        if(player.despair.chapters[player.despair.currentChapter-1].days[player.despair.currentDay-1][player.despair.currentPhase][player.despair.currentLine].includes("RE:ACT")){
            user.roles.add("660664223625641994")
        }else if(player.despair.chapters[player.despair.currentChapter-1].days[player.despair.currentDay-1][player.despair.currentPhase][player.despair.currentLine].includes("[ACT]")){
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