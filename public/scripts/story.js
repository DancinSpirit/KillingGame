let invisibleArrow = false;
let playersLoaded = false;
let pageNum = 1;
let index = -1;
let typing = false;
let typeInterrupt = false;
let eventInterrupt = false;
let ctrlButton = true;
let enterButton = true;
let screen = true;
let keyButtons = true;
let enterKeyPressed = false;

const loadBackground = async function(url){
    return new Promise((resolve) =>{
        if(url.includes("[TOP]")){
            $('body').css("background-position", "top");
            url = url.replace("[TOP]","");
        }else{
            $('body').css("background-position", "center center");
        }
        $('body').css("background-image", `url('${url}')`);
        resolve();
    })
}

/* Event Scripts Below This Point */
const activateTitleClick = function(){
    buttons.playerBox = function(){
        $("#player-box").off("click");
        $("#player-box").on("click", async function(){
            $("#right-arrow-box").click();
        })
    }
    buttons.playerBox();
}

const loadEvent = function(){
    buttons.playerBox = function(){
        $("#player-box").off("click")
        $("#player-box").on("click", function(){
            if(continueEvent){
                $("#click-signifier").remove();
                eventInterrupt = false;
                $("#player-box").off("click");
                $(".big-boy").css("transition",user.settings.pageSpeed);
                $(".big-boy").height(0);
                setTimeout(function(){
                    nextLine();
                    $("#player-box").on("click", function(){
                        if(typing){
                            typing = false;
                            typeInterrupt = true;
                        }else{
                            if(continueEvent){
                                typing = false;
                                typeInterrupt = false;
                                $("#click-signifier").remove();
                                nextLine();  
                            }
                        }
                    })
                },user.settings.pageSpeed+100);
            }   
        })
    }
    buttons.playerBox();
}

const applyClass = async function(sentText, eventId, index, clas, newPageBoolean){
    $(`#event-${eventId}-height-box`).append(`<p id="height-check-${index}" class="boxtext">${sentText}</p>`);
        if(user.settings.pageScroll){
            if(newPageBoolean){
                newPage(eventId);
            }else{
                pageCheck(eventId, index, sentText);
            }
            createText($(`#page-${pageNum}`),eventId,index,sentText);
        }else{
            createText($(`#event-${eventId}`),eventId,index,sentText);
        }
    $(`#boxtext-${index}`).addClass(clas)
    printLine(sentText);
}

const nextLine = async function(){
    if(index<text.length-1){
        index++;
        if(text[index].includes("[")){
            let command = text[index].replace("[","").split(`]`)[0];
            let sentText = text[index].replace("[","").split(`${command}]`)[1];
            switch(command){
                case "SCENE TRANSITION":
                    await loadBackground("/images/" + sentText + ".jpg")
                    nextLine();
                    break;
                case "PHILOSOPHER":
                    applyClass(sentText, eventId, index, "philosopher", true);
                    break;
                case "CORSIVA":
                    applyClass(sentText, eventId, index, "corsiva");
                    break;
                case "INDIE FLOWER":
                    applyClass(sentText, eventId, index, "indie-flower");
                    break;
                case "CAVEAT":
                    applyClass(sentText, eventId, index, "caveat");
                    break;
                case "SATISFY":
                    applyClass(sentText, eventId, index, "satisfy");
                    break;
                case "CENTERED":
                    applyClass(sentText, eventId, index, "centered");
                    break;
                case "RECEDING":
                    text1 = sentText.split("<RECEDE>")[0];
                    text2 = sentText.split("<RECEDE>")[1];
                    text3 = sentText.split("<RECEDE>")[2];
                    text4 = sentText.split("<RECEDE>")[3];
                    $(`#event-${eventId}-height-box`).append(`<p id="height-check-${index}" class="boxtext">${sentText}</p>`);
                    if(user.settings.pageScroll){
                        pageCheck(eventId, index, sentText);
                        $(`#page-${pageNum}`).append(`<p id="boxtext-${index}" style="height: ${$(`#height-check-${index}`).height()+36}px" class='boxtext'><span id="boxtext-${index}-1"></span><span class='receded-1' id="boxtext-${index}-2"></span><span class='receded-2' id="boxtext-${index}-3"></span><span class='receded-3' id="boxtext-${index}-4"></span></p>`);
                        typing = true;
                        await typeWriter(`#page-${pageNum}`,"", 0, text1,index,`#boxtext-${index}-1`, 1, {text2:{id:`#boxtext-${index}-2`,text:text2},text3:{id:`#boxtext-${index}-3`,text:text3},text4:{id:`#boxtext-${index}-4`,text:text4}}, true);
                        await typeWriter(`#page-${pageNum}`,"", 0, text2,index,`#boxtext-${index}-2`, 1, {text3:{id:`#boxtext-${index}-3`,text:text3},text4:{id:`#boxtext-${index}-4`,text:text4}},true);
                        await typeWriter(`#page-${pageNum}`,"", 0, text3,index,`#boxtext-${index}-3`, 1, {text4:{id:`#boxtext-${index}-4`,text:text4}},true);
                        await typeWriter(`#page-${pageNum}`,"", 0, text4,index,`#boxtext-${index}-4`, 1);
                        typing = false;
                        loadClickSignifier($(`#page-${pageNum}`));
                    }else{
                        $(`#event-${eventId}`).append(`<p id="boxtext-${index}" style="height: ${$(`#height-check-${index}`).height()+36}px" class='boxtext'><span id="boxtext-${index}-1"></span><span class='shadows' id="boxtext-${index}-2"></span><span id="boxtext-${index}-3"></span></p>`);
                        typing = true;
                        await typeWriter(`#event-${eventId}`,"", 0, text1,index,`#boxtext-${index}-1`, 1, {text2:{id:`#boxtext-${index}-2`,text:text2},text3:{id:`#boxtext-${index}-3`,text:text3},text4:{id:`#boxtext-${index}-4`,text:text4}}, true);
                        await typeWriter(`#event-${eventId}`,"", 0, text2,index,`#boxtext-${index}-2`, 1, {text3:{id:`#boxtext-${index}-3`,text:text3},text4:{id:`#boxtext-${index}-4`,text:text4}},true);
                        await typeWriter(`#event-${eventId}`,"", 0, text3,index,`#boxtext-${index}-3`, 1, {text4:{id:`#boxtext-${index}-4`,text:text4}},true);
                        await typeWriter(`#event-${eventId}`,"", 0, text4,index,`#boxtext-${index}-4`, 1);
                        typing = false;
                        loadClickSignifier($(`#event-${eventId}`));
                    }
                    break;
                case "CUTAWAY IMAGE":
                    $("#cutaway-subtitle").css("display","block")
                    $("#cutaway-image").css("background-image", `url(${sentText.replace("[CUTAWAY IMAGE]","").split("|")[0]})`)
                    $("#cutaway-image-collection").append(`<section class="cutaway-image-container"><div id="${sentText.split("|")[1].replace(/<strong>/g,"").replace(/<\/strong>/g,"")}" class='cutaway-image'></div><div class="cutaway-image-subtitle">${sentText.split("|")[1]}</div></section>`)
                    $("#cutaway-image").css("background-repeat", `no-repeat`)
                    $("#cutaway-image").css("background-size", `contain`)
                    $("#cutaway-image").css("background-position", `center`)
                    $("#cutaway-image").fadeIn();
                    $("#cutaway-subtitle").html(sentText.split("|")[1])
                    $("#cutaway-subtitle").fadeIn();
                    $("#cutaway-image-container").css("display","flex");
                    $("#cutaway-image-container").on("click", function(){
                        $("#cutaway-image").fadeOut();
                        $("#cutaway-subtitle").fadeOut();
                        setTimeout(function(){
                            $("#cutaway-image-container").css("display","none");
                            $("#cutaway-subtitle").css("display","none");
                        },500)
                    })
                    break;
                case "PLAYER ACTION":
                    //Description|Title|NUMofOPTIONS|{OPTIONS WITH CHOSEN OPTION HAVING <CHOSEN>}
                    $("#choice").empty();
                    $("#choice").css("color","white");
                    $("#choice-container").css("border-color","white");
                    ctrlButton = false;
                    enterButton = false;
                    let numberOfOptions = parseInt(sentText.split("|")[2]);
                    $("#choice").append(`<p class='choice-title'>${sentText.split("|")[1]}</p>`)
                    $("#choice").append(`<p class='choice-description'>${sentText.split("|")[0]}</p>`)
                    for(let x=0; x<numberOfOptions; x++){
                        console.log("HM<?")
                        if(sentText.split("|")[x+3].startsWith("<CHOSEN>")){
                            console.log("HELLO?")
                            $("#choice").append(`<div class='choice-option chosen-option'>${sentText.split("|")[x+3].replace("<CHOSEN>","")}</div>`)
                            $(".chosen-option").on("click",function(){
                                $("#choice-container").css("display","none");
                                ctrlButton = true;
                                enterButton = true;
                            })
                        }
                        else
                        $("#choice").append(`<div class='choice-option unchosen-option'>${sentText.split("|")[x+3]}</div>`)
                    }
                    $("#choice-container").css("display","flex");
                    break;
                case "REWARD":
                    //Name|Reward Details|player Color Id
                    $("#choice").empty();
                    $("#choice").css("color","black");
                    ctrlButton = false;
                    enterButton = false;
                    const component = await loadComponent("rewards",false,{name:sentText.split("|")[0],rewards:sentText.split("|")[1]});
                    const player = await loadDatabaseObject("Player",sentText.split("|")[2]);
                    document.documentElement.style.setProperty('--light', player.colors.light);
                    document.documentElement.style.setProperty('--dark', player.colors.dark);
                    document.documentElement.style.setProperty('--darker', player.colors.darker);
                    document.documentElement.style.setProperty('--highlight', player.colors.highlight);
                    document.documentElement.style.setProperty('--background', player.colors.background);
                    $("#choice").append(component);
                    $("#choice").append(`<p class='continue-button'>Continue</p>`);
                    $(".continue-button").on("click",function(){
                        $("#choice-container").css("display","none");
                        ctrlButton = true;
                        enterButton = true;
                    })
                    $("#choice-container").css("display","flex");
                    break;
                case "MUSIC":
                    await loadMusic(sentText);
                    nextLine();
                    break;
                case "MUSIC STOP":
                    stopAudio(song);
                    nextLine();
                    break;
                case "SOUND EFFECT":
                    playSound(sentText);
                    nextLine();
                    break;
                case "ONOMATOPOEIA":
                    playSound(sentText);
                    sentText = "<i>" + sentText + "</i>";
                    $(`#event-${eventId}-height-box`).append(`<p id="height-check-${index}" class="boxtext">${sentText}</p>`);
                    if(user.settings.pageScroll){
                        pageCheck(eventId, index, sentText);
                        createText($(`#page-${pageNum}`),eventId,index,sentText);
                    }else{
                        createText($(`#event-${eventId}`),eventId,index,sentText);
                    }
                    printLine(sentText); 
                    break;
                case "AUTO BREAK":
                    //this is to prevent an automatic next line   
                    break; 
                default:
                    $(`#event-${eventId}-height-box`).append(`<p id="height-check-${index}" class="boxtext">${text[index]}</p>`);
                    if(user.settings.pageScroll){
                        pageCheck(eventId, index, text[index]);
                        createText($(`#page-${pageNum}`),eventId,index,text[index]);
                    }else{
                        createText($(`#event-${eventId}`),eventId,index,text[index]);
                    }
                    printLine(text[index]); 
            }
        }else{
            $(`#event-${eventId}-height-box`).append(`<p id="height-check-${index}" class="boxtext">${text[index]}</p>`);
            if(user.settings.pageScroll){
                pageCheck(eventId, index, text[index]);
                createText($(`#page-${pageNum}`),eventId,index,text[index]);
            }else{
                createText($(`#event-${eventId}`),eventId,index,text[index]);
            }
            printLine(text[index]);
        }
    }else{
        $("#right-arrow-box").click();
    }
}

const printLine = async function(sentText){
    if(user.settings.pageScroll){
        typing = true;
        await typeWriter(`#page-${pageNum}`,"", 0, sentText, index, `#boxtext-${index}`, 1) 
        typing = false;
        loadClickSignifier($(`#page-${pageNum}`));
    }else{
        typing = true;
        await typeWriter(`#event-${eventId}`,"", 0, sentText, index, `#boxtext-${index}`, 1) 
        typing = false;
        loadClickSignifier($(`#event-${eventId}`));
    }
}

const pageCheck = function(eventId){
    let pageHeight = 0;
    for(let x=0; x<$(`#page-${pageNum}`).children().length; x++){
        if($($(`#page-${pageNum}`).children()[x]).hasClass("big-boy")){

        }else{
            pageHeight = pageHeight+$($(`#page-${pageNum}`).children()[x]).height()+20;
        }
    }
    pageHeight = pageHeight+$(`#height-check-${index}`).height()+20+36;
    if(pageHeight>$("#sub-story").height()){
        newPage(eventId);
    }
}

const newPage = function(eventId){
    $(".big-boy").css("transition","0ms");
    $("#title-box-event").css("transition","0ms");
    $(`#page-${pageNum}`).css("height","auto");
    pageNum++;
    $(`#event-${eventId}`).append(`<section id="page-${pageNum}" class = 'page'></section>`)
}

const createText = function($appendBox, eventId,index,sentText){
    $appendBox.append(`<p id="boxtext-${index}" style="height: ${$(`#height-check-${index}`).outerHeight(true)+36}px" class="boxtext"></p>`);
    if(!user.settings.pageScroll)
    $("#sub-story").scrollTop($("#sub-story").prop("scrollHeight"));
    else
    $("#sub-story").scrollTop($("#sub-story").prop("scrollHeight")-20-$("#sub-story").height());
}

const loadClickSignifier = function($appendBox){
    if(index<text.length-1){ 
            $(`#boxtext-${index}`).css("height",`${$(`#height-check-${index}`).outerHeight(true)}px`)  
            $appendBox.append("<div id='click-signifier'><i class='fas fa-scroll fa-blink'></i></div>")
            $("#click-signifier").css("justify-content","left")
            $("#click-signifier").css("padding-left","25px");
            if(!user.settings.pageScroll)
            $("#sub-story").scrollTop($("#sub-story").prop("scrollHeight"));
            else
            $("#sub-story").scrollTop($("#sub-story").prop("scrollHeight")-20-$("#sub-story").height());
            $(".boxtext").css("height","auto")
    }
}

const typeWriter = async function(appendBox, returnString, i, txt, sentIndex, id, speedMod, otherText) {
    return new Promise((resolve) =>{
        if (i < txt.length) {
            returnChar = txt.charAt(i);
            returnString += returnChar;
        for(let x=2; x<=speedMod; x++){
            if(i+x-1<txt.length)
            returnString += txt.charAt(i+x-1);
            else
            i=txt.length;
        }
        $(id).html(returnString) 
        if(i!=txt.length)
        i+=speedMod;
        }
        if(i==txt.length){
            resolve();
        }else{
            let timeout = setTimeout(function(){typeWriter(appendBox, returnString, i, txt, sentIndex, id, speedMod, otherText).then(resolve)}, user.settings.textSpeed)
            if(index!=sentIndex||typeInterrupt){
                if(otherText){
                    if(otherText.text2){
                        $(otherText.text2.id).text(otherText.text2.text);
                    }
                    if(otherText.text3){
                        $(otherText.text3.id).text(otherText.text3.text);
                    }
                    if(otherText.text4){
                        $(otherText.text4.id).text(otherText.text4.text);
                    }
                }
                $(`#boxtext-${sentIndex}`).css("height",`${$(`#height-check-${sentIndex}`).outerHeight(true)}px`)
                $(id).html(txt) 
                clearTimeout(timeout);
                typeInterrupt = false;
                loadClickSignifier($(appendBox));
            }else if(eventInterrupt){
                clearTimeout(timeout);
            }
        }
    })
}