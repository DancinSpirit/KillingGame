const db = require("./models");
const dice = require("./dice.js");
const Modifier = require("./modifier.js")
const {EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuOptionBuilder, StringSelectMenuBuilder} = require("discord.js");

let functions = {};
functions.saveGamemasterText = async function(day, phase, sentText, user){
    return new Promise(async (resolve)=>{
        if(sentText.includes("{")){
            let command = sentText.replace("{","").split(`}`)[0];
            let text = sentText.replace("{","").split(`${command}}`)[1];
            switch(command){
                case "EDIT":
                    resolve();
                    break;
                case "RESET CURRENT LINE":
                    user.despair.currentLine = day[phase].length-1;
                    await db.User.findByIdAndUpdate(user._id, {despair: user.despair});
                    resolve();
                    break;
                case "SET CURRENT LINE":
                    user.despair.currentLine = text;
                    await db.User.findByIdAndUpdate(user._id, {despair: user.despair});
                    resolve();
                    break;
                case "ROLL":
                    let modifiers = text.split("|");
                    for(let x=0; x<modifiers.length; x++){
                        dice.addModifier(new Modifier(modifiers[x].split("=")[0], parseInt(modifiers[x].split("=")[1])))
                    }
                    dice.roll();
                    day[phase].push("[ROLL]" + dice.latestRollString)
                    day.save();
                    resolve();
                    break;
                default:
                    console.log("TEST")
                    if(text==""){
                        text="I'm feature testing you can ignore this Kristian."
                    }
                    day[phase].push(text);
                    day.save();
                    resolve();
            }
        }else{
            console.log("TEST21")
            day[phase].push(sentText);
            day.save();
            resolve();
        }
    })
}
functions.sendStoryText = async function(storyChannel, gamemasterChannel, sentText,player){
    return new Promise(async (resolve)=>{
        let gameState = await db.GameState.findOne({});
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
                case "MUSIC STOP":
                    resolve();
                    break;
                case "TRUTH BULLET DISCOVERY":
                    let truthBullet = await db.TruthBullet.findById(text);
                    let truthBulletEmbed = new EmbedBuilder()
                        .setTitle(truthBullet.name)
                        .setDescription(truthBullet.description)
                        .setAuthor({name:"Obtained Truth Bullet!"})
                        .setColor("#ff9c02")
                    await storyChannel.send({embeds: [truthBulletEmbed]})
                    let bulletExists = false;
                    for(let x=0; x<player.despair.truthBullets.length; x++){
                        if(player.despair.truthBullets[x].toString() == truthBullet._id.toString()){
                            bulletExists = true;
                        }
                    }
                    if(!bulletExists){
                        player.despair.truthBullets.push(truthBullet._id);
                        player.save();
                    }
                    resolve();
                    break;
                case "LIE CREATION":
                    let lieBullet = await db.TruthBullet.findById(text);
                    let lieBulletEmbed = new EmbedBuilder()
                        .setTitle(lieBullet.name)
                        .setDescription(lieBullet.description)
                        .setAuthor({name:"Created a Lie!"})
                    await storyChannel.send({embeds: [lieBulletEmbed]})
                    let lieBulletExists = false;
                    for(let x=0; x<player.despair.truthBullets.length; x++){
                        if(player.despair.truthBullets[x].toString() == lieBullet._id.toString()){
                            lieBulletExists = true;
                        }
                    }
                    if(!lieBulletExists){
                        player.despair.truthBullets.push(lieBullet._id);
                        player.save();
                    }
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
                    await gamemasterChannel.send(sentText);
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
                    if(text.includes("FREE TIME START")){
                        let freeTimeEmbed = new EmbedBuilder()
                            .setTitle("FREE TIME")
                            .setDescription("Socialized with " + text.split("FREE TIME START]")[1].split("|")[1] + ", " + text.split("FREE TIME START]")[1].split("|")[2] + ", and " + text.split("FREE TIME START]")[1].split("|")[3])
                        await storyChannel.send({embeds:[freeTimeEmbed]})
                    }
                    await gamemasterChannel.send(sentText);
                    resolve();
                    break;
                case "ULTIMATE ABILITY USAGE":
                    let report = await db.ReportCard.findById(player.despair.fullReport)
                    let abilityEmbed = new EmbedBuilder()
                        .setTitle("Ultimate " + report.ultimate.name)
                        .setDescription(report.ultimate.useText)
                    await storyChannel.send({
                        embeds: [abilityEmbed]
                    })
                    resolve();
                    break;
                case "FREE TIME START":
                    resolve();
                    break;
                case "RE:ACT":
                    if(text.includes("[FREE TIME START]")){
                        let actionButton = new ButtonBuilder()
                        .setCustomId("actionButton")
                        .setLabel("2 Actions")
                        .setStyle(ButtonStyle.Primary)
                        let socialButton = new ButtonBuilder()
                            .setCustomId("socialButton")
                            .setLabel("3 Socializations")
                            .setStyle(ButtonStyle.Primary)
                        let mixedButton = new ButtonBuilder()
                            .setCustomId("mixedButton")
                            .setLabel("1 Action, 2 Socializations")
                            .setStyle(ButtonStyle.Primary)
                        let freeTimeEmbed = new EmbedBuilder()
                            .setTitle("Free Time!")
                            .setDescription("What would you like to do?")
                        let freeTimeRow = new ActionRowBuilder()
                            .addComponents(actionButton,mixedButton,socialButton)
                        await storyChannel.send({embeds: [freeTimeEmbed], components: [freeTimeRow]})
                    }
                    else if(text.includes("[OPTION]")){
                        let title = text.split("|")[1]
                        let description = text.split("|")[0].split("[OPTION]")[1];
                        let optionEmbed = new EmbedBuilder()
                            .setTitle(title)
                            .setDescription(description)
                        let optionsNumber = text.split("|")[2]
                        let optionsNumberTwo = parseInt(optionsNumber)+3;
                        let optionButtons = [];
                        for(let x=3; x<optionsNumberTwo; x++){
                            let option = text.split("|")[x];
                                optionButtons.push(new ButtonBuilder()
                                    .setCustomId("optionButton"+(x))
                                    .setLabel(option)
                                    .setStyle(ButtonStyle.Primary))
                        }
                        let optionsRow = new ActionRowBuilder()
                            .addComponents(...optionButtons)
                        await storyChannel.send({
                            embeds: [optionEmbed], 
                            components: [optionsRow]
                        })
                    }
                    else if(text.includes("[INVESTIGATION CONCLUSION]")){
                        let reactEmbed = new EmbedBuilder()
                            .setTitle("RE:ACT")
                            .setDescription("Investigation Conclusion! Select which Truth Bullets you'd like to share with the group!")
                        let truthBullet;
                        let truthBulletButton;
                        let truthBullets = [];
                        for(let x=0; x<player.despair.truthBullets.length; x++){
                            truthBullet = await db.TruthBullet.findById(player.despair.truthBullets[x])
                            if(truthBullet.chapter==gameState.chapter&&truthBullet.day==gameState.day&&truthBullet.phase==gameState.phase){
                                truthBulletButton = new StringSelectMenuOptionBuilder()
                                    .setLabel(truthBullet.name)
                                    .setValue(truthBullet.name)
                                truthBullets.push(truthBulletButton);
                            }
                        }
                        let truthBulletMenu = new StringSelectMenuBuilder()
                            .setCustomId("investigationContinue")
                            .setPlaceholder("Truth Bullets")
                            .addOptions(...truthBullets)
                            .setMinValues(0)
                            .setMaxValues(truthBullets.length)
                        let reactRow = new ActionRowBuilder()
                            .addComponents(truthBulletMenu)
                        await storyChannel.send({
                            embeds: [reactEmbed],
                            components: [reactRow]
                        })
                    }else{
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
                    }
                    resolve();
                    break;
                default:
                    if(text==""){
                        text="Something went wrong. I'm bugtesting you can ignore this Kristian."
                    }
                    await storyChannel.send(text);
                    resolve();
            }
        }else{
            if(sentText==""){
                resolve();
            }else{
                await storyChannel.send(sentText);
                resolve();
            }
        }
    })
}

module.exports = functions;