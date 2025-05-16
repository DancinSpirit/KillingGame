if(!user){
    user = {settings:{}};
    user.settings.pageSpeed = 1000;
}

const animations = {};

animations.left = async function(state, component){
    return new Promise((resolve)=>{
        $(`#sub-${state}`).attr("id",`old-sub-${state}`);
        $(`#sub-${state}-container`).append(`<section id="sub-${state}" class="sub-base"></section>`)
        $(`#sub-${state}`).html(component);
        $(`#sub-${state}-container`).css("transition",`${user.settings.pageSpeed}ms`);
        $(`#sub-${state}-container`).css("transform","translateX(-50%)")
        setTimeout(function(){
            $(`#sub-${state}-container`).css("transition","0ms");
            $(`#old-sub-${state}`).remove();
            $(`#sub-${state}-container`).css("transform","translate(0%,0%)");
            resolve();
        },user.settings.pageSpeed)
    })
}
animations.day = async function(state, component){
    return new Promise((resolve)=>{
        $(`#sub-${state}`).attr("id",`old-sub-${state}`);
        $(`#sub-${state}-container`).append(`<section id="sub-${state}" class="sub-base"></section>`)
        $(`#sub-${state}`).html(component);
        $(`#sub-${state}-container`).css("transition",`${user.settings.pageSpeed}ms`);
        $(`#sub-${state}-container`).css("transform","translateX(-50%)")
        setTimeout(function(){
            $(".event-box").css("width","100%");
            $(".height-box").css("display","block");
            $(`#sub-${state}-container`).css("transition","0ms");
            $(`#old-sub-${state}`).remove();
            $(`#sub-${state}-container`).css("transform","translate(0%,0%)");
            resolve();
        },user.settings.pageSpeed)
        $("#bottomright-text").text("Day "+ info.day + " - " + info.phase.charAt(0).toUpperCase() + info.phase.substring(1))
    })  
}
animations.freeTime = async function(state, component){
    return new Promise((resolve)=>{
        $(`#sub-${state}`).attr("id",`old-sub-${state}`);
        $(`#sub-${state}-container`).append(`<section id="sub-${state}" class="sub-base"></section>`)
        $(`#sub-${state}`).html(component);
        $(`.textbox`).css("transition",`100ms`);
        $(`.textbox`).css("height","0")
        $("#top-section").fadeOut();
        $("#phase-container").css("visbility","hidden");
        $("#phase-container").css("display","flex");
        $("#phase-box").text("F r e e \xa0\xa0T i m e");
        $(`#sub-${state}-container`).css("transform","translateX(-50%)")
        $(".event-box").css("width","100%");
        $(".height-box").css("display","block");
        $(`#old-sub-${state}`).remove();
        $(`#sub-${state}-container`).css("transform","translate(0%,0%)");
        if(song){
            stopAudio(song);
        }
        setTimeout(function(){
            $("#phase-container").css("visibility","visible");
            $("#phase-box").css("height","75px");
            playSound("PhaseShift");
        },100)
        setTimeout(function(){
            $("#phase-box").css("height","1000px");
            $("#phase-container").fadeOut();
            setTimeout(function(){
                $("#top-section").fadeIn();
                $(".textbox").css("transition",`${user.settings.pageSpeed}ms`)
                $(".textbox").css("height","80vh");
                $("#phase-box").css("height","0");
                loadMusic("BeautifulDays");
                setTimeout(function(){
                    $(".textbox").css("transition","0ms");
                    resolve();
                },user.settings.pageSpeed)
            },300)
        },1600)
        $("#bottomright-text").text("Day "+ info.day + " - " + info.phase.charAt(0).toUpperCase() + info.phase.substring(1))
    })  
}
animations.calendar = async function(state, component){
    return new Promise((resolve)=>{
        $(`#sub-${state}`).attr("id",`old-sub-${state}`);
        $(`#sub-${state}-container`).append(`<section id="sub-${state}" class="sub-base"></section>`)
        $(`#sub-${state}`).html(component);
        $(`#sub-${state}-container`).css("transition",`${user.settings.pageSpeed}ms`);
        $(`#sub-${state}-container`).css("transform","translateX(-50%)")
        setTimeout(function(){
            $(".event-box").css("width","50%");
            $("#fill-space").css("display","block");
            $(`#sub-${state}-container`).css("transition","0ms");
            $(`#old-sub-${state}`).remove();
            $(`#sub-${state}-container`).css("transform","translate(0%,0%)");
            resolve();
        },user.settings.pageSpeed)
        $("#topright-text").text("Calendar")
        $("#bottomright-text").text("Chapter " + info.chapter)
    })  
}
animations.right = async function(state, component){
    return new Promise((resolve)=>{
        $(`#sub-${state}`).attr("id",`old-sub-${state}`);
        $(`#sub-${state}-container`).prepend(`<section id="sub-${state}" class="sub-base"></section>`)
        $(`#sub-${state}`).html(component);
        $(`#sub-${state}-container`).css("transform","translateX(-50%)");
        setTimeout(function(){
            $(`#sub-${state}-container`).css("transition",`${user.settings.pageSpeed}ms`);
            $(`#sub-${state}-container`).css("transform","translateX(0%)")
            setTimeout(function(){
                $(`#sub-${state}-container`).css("transition","0ms");
                $(`#old-sub-${state}`).remove();
                $(`#sub-${state}-container`).css("transform","translate(0%,0%)");
                resolve();
            },user.settings.pageSpeed)
        },10);
    })
}
animations.up = async function(state, component){
    return new Promise((resolve)=>{
        $(`#sub-${state}-container`).css("display","block");
        $(`#sub-${state}`).attr("id",`old-sub-${state}`);
        $(`#sub-${state}-container`).append(`<section id="sub-${state}" class="sub-base"></section>`)
        $(`#sub-${state}`).html(component);
        $(`#sub-${state}-container`).css("transition",`${user.settings.pageSpeed}ms`);
        $(`#sub-${state}-container`).css("transform","translateY(-50%)")
        setTimeout(function(){
            $(`#sub-${state}-container`).css("transition","0ms");
            $(`#old-sub-${state}`).remove();
            $(`#sub-${state}-container`).css("transform","translate(0%,0%)");
            $(`#sub-${state}-container`).css("display","flex");
            resolve();
        },user.settings.pageSpeed)
    })
}
animations.down = async function(state, component){
    return new Promise((resolve)=>{
        $(`#sub-${state}-container`).css("display","block");
        $(`#sub-${state}`).attr("id",`old-sub-${state}`);
        $(`#sub-${state}-container`).prepend(`<section id="sub-${state}" class="sub-base"></section>`)
        $(`#sub-${state}`).html(component);
        $(`#sub-${state}-container`).css("transform","translateY(-50%)");
        setTimeout(function(){
            $(`#sub-${state}-container`).css("transition",`${user.settings.pageSpeed}ms`);
            $(`#sub-${state}-container`).css("transform","translateY(0%)")
            setTimeout(function(){
                $(`#sub-${state}-container`).css("transition","0ms");
                $(`#old-sub-${state}`).remove();
                $(`#sub-${state}-container`).css("transform","translate(0%,0%)");
                $(`#sub-${state}-container`).css("display","flex");
                resolve();
            },user.settings.pageSpeed)
        },10);
    })
}

animations.none = async function(state, component){
    return new Promise((resolve)=>{
        $(`#sub-${state}`).attr("id",`old-sub-${state}`);
        $(`#sub-${state}-container`).prepend(`<section id="sub-${state}"  class="sub-base"></section>`)
        $(`#sub-${state}`).html(component);
        $(`#old-sub-${state}`).remove();
        resolve();
    })
}

animations.mainMenu = async function(state, component){
    return new Promise((resolve)=>{
        let stringState = "";
        for(let x=0; x<states.length; x++){
            if(states[x]==state){
                stringState = states[x+1];
            }
        }
        let bottomRightString = "";
        let capitalize = true;
        for (let x=0; x<stringState.length; x++){
            if(capitalize){
                bottomRightString += stringState[x].toUpperCase();
                capitalize = false;
            }else{
                if(stringState[x]=='-'){
                    bottomRightString += " ";
                    capitalize = true;
                }else{
                    bottomRightString += stringState[x];
                }
            }
        }
        if(bottomRightString!="Start Screen"){
            $("#home").css("transition","1000ms");
            $("#home").css("transform", "translate(25vw,-10vh)")
            $("#gun-container").css("transform", "perspective(400px) rotatex(10deg) rotatey(-10deg)")
            $("#circle-container").css("transform", "perspective(400px) rotatex(10deg) rotatey(-10deg) translate(-3vw,-3.35vh)")
            $("#smallcircle-container").css("transform", "perspective(400px) rotatex(10deg) rotatey(-10deg) translate(-1.65vw,-1.75vh)")
            $(`#sub-${state}`).attr("id",`old-sub-${state}`);
            $(`#sub-${state}-container`).prepend(`<section id="sub-${state}" class="sub-base"></section>`)
            $(`#sub-${state}`).html(component);
            $(`#sub-${state}-container`).css("transform","translateX(-50%)");
            $("#nav-buttons").css("transform","translateX(0%)")
            setTimeout(function(){
                $(`#sub-${state}-container`).css("transition",`${user.settings.pageSpeed}ms`);
                $(`#sub-${state}-container`).css("transform","translateX(0%)")
                setTimeout(function(){
                    $(`#sub-${state}-container`).css("transition","0ms");
                    $(`#old-sub-${state}`).remove();
                    $(`#sub-${state}-container`).css("transform","translate(0%,0%)");
                    resolve();
                },user.settings.pageSpeed)
            },10);
        }else{
            $("#home").css("transition","1000ms");
            $("#home").css("transform", "translate(0vw,0vh)")
            $("#gun-container").css("transform", "")
            $("#circle-container").css("transform", "translate(-3vw,-3.35vh)")
            $("#smallcircle-container").css("transform", "translate(-1.65vw,-1.75vh)")
            $(`#sub-${state}-container`).css("display","block");
            $(`#sub-${state}`).attr("id",`old-sub-${state}`);
            $(`#sub-${state}-container`).prepend(`<section id="sub-${state}" class="sub-base"></section>`)
            $(`#sub-${state}`).html(component);
            $(`#sub-${state}-container`).css("transform","translateY(-50%)");
            setTimeout(function(){
                $(`#sub-${state}-container`).css("transition",`${user.settings.pageSpeed}ms`);
                $(`#sub-${state}-container`).css("transform","translateY(0%)")
                setTimeout(function(){
                    $(`#sub-${state}-container`).css("transition","0ms");
                    $(`#old-sub-${state}`).remove();
                    $(`#sub-${state}-container`).css("transform","translate(0%,0%)");
                    $(`#sub-${state}-container`).css("display","flex");
                    resolve();
                },user.settings.pageSpeed)
            },10);
        }
        $("#bottomright-text").text(bottomRightString)
        $("#topright-text").text("Main Menu")
    })
}

animations.handbook = async function(state, component){
    return new Promise((resolve)=>{
        playSound("Handbook");
        $(`#sub-${state}-container`).css("display","block");
        $(`#sub-${state}`).attr("id",`old-sub-${state}`);
        $(`#sub-${state}-container`).append(`<section id="sub-${state}" class="sub-base"></section>`)
        $(`#sub-${state}`).html(component);
        $(`#sub-${state}-container`).css("transition",`${user.settings.pageSpeed}ms`);
        $(`#sub-${state}-container`).css("transform","translateY(-50%)")
        $("#nav-buttons").css("transform","translateX(0%)")
        setTimeout(function(){
            $(`#sub-${state}-container`).css("transition","0ms");
            $(`#old-sub-${state}`).remove();
            $(`#sub-${state}-container`).css("transform","translate(0%,0%)");
            $(`#sub-${state}-container`).css("display","flex");
            $("#academy-logo").fadeIn();
            resolve();
        },user.settings.pageSpeed)
        $("#topright-text").text("E-Handbook")
    })
}
animations.handbookMenu = async function(state, component){
    return new Promise((resolve)=>{
        $(`#sub-${state}-container`).css("display","block");
        $(`#sub-${state}`).attr("id",`old-sub-${state}`);
        $(`#sub-${state}-container`).append(`<section id="sub-${state}" class="sub-base"></section>`)
        $(`#sub-${state}`).html(component);
        $(`#sub-${state}-container`).css("transition",`${user.settings.pageSpeed}ms`);
        $(`#sub-${state}-container`).css("transform","translateY(-50%)")
        $("#academy-logo").css("transition",`${user.settings.pageSpeed}ms`);
        $("#academy-logo").css("transform","translate(0,0)");
        $("#handbook-nav").css("transition",`${user.settings.pageSpeed}ms`);
        $("#handbook-nav").css("transform","translateX(-100%)")
        setTimeout(function(){
            $("#academy-logo").css("transition",`0ms`);
            $("#handbook-nav").css("transition",`0ms`);
            $(`#sub-${state}-container`).css("transition","0ms");
            $(`#old-sub-${state}`).remove();
            $(`#sub-${state}-container`).css("transform","translate(0%,0%)");
            $(`#sub-${state}-container`).css("display","flex");
            $("#top-row").css("transform","translateX(0%)");
            $("#bottom-row").css("transform","translateX(0%)");
            $(".top").css("transition",`${user.settings.pageSpeed}ms`);
            $(".top").css("background-color","transparent");
            $(".top").css("border-bottom","none");
            resolve();
        },user.settings.pageSpeed)
        $("#bottomright-text").text("Main Menu")
    })
}

animations.story = async function(state, component){
    return new Promise((resolve)=>{
        $(`#sub-${state}`).attr("id",`old-sub-${state}`);
        $(`#sub-${state}-container`).prepend(`<section id="sub-${state}" class="sub-base"></section>`)
        $(`#sub-${state}`).html(component);
        $(`#sub-${state}-container`).css("transform","translateX(-50%)");
        $("#nav-buttons").css("transform","translateX(0%)")
        setTimeout(function(){
            $(`#sub-${state}-container`).css("transition",`${user.settings.pageSpeed}ms`);
            $(`#sub-${state}-container`).css("transform","translateX(0%)")
            setTimeout(function(){
                $(`#sub-${state}-container`).css("transition","0ms");
                $(`#old-sub-${state}`).remove();
                $(`#sub-${state}-container`).css("transform","translate(0%,0%)");
                resolve();
            },user.settings.pageSpeed)
        },10);
        $("#topright-text").text("Chapter " + info.chapter)
    }) 
}

animations.reportCard = async function(state, component){
    return new Promise((resolve)=>{
        $(`#sub-${state}-container`).css("display","block");
        $(`#sub-${state}`).attr("id",`old-sub-${state}`);
        $(`#sub-${state}-container`).prepend(`<section id="sub-${state}" class="sub-base"></section>`)
        $(`#sub-${state}`).html(component);
        $(`#sub-${state}-container`).css("transform","translateY(-50%)");
        setTimeout(function(){
            $(`#sub-${state}-container`).css("transition",`${user.settings.pageSpeed}ms`);
            $(`#sub-${state}-container`).css("transform","translateY(0%)")
            $(".top").css("transition",`${user.settings.pageSpeed}ms`);
            $(".top").css("background-color","black");
            $(".top").css("border-bottom","solid white 1px");
            $("#handbook-nav").css("transition",`${user.settings.pageSpeed}ms`);
            $("#handbook-nav").css("transform","translateX(0%)")
            $("#academy-logo").css("transition",`${user.settings.pageSpeed}ms`);
            $("#academy-logo").css("transform","translate(27vw,5vh)");
            setTimeout(function(){
                $("#handbook-nav").css("transition",`0ms`);
                $(`#sub-${state}-container`).css("transition","0ms");
                $(`#old-sub-${state}`).remove();
                $(`#sub-${state}-container`).css("transform","translate(0%,0%)");
                $(`#sub-${state}-container`).css("display","flex");
                resolve();
            },user.settings.pageSpeed)
        },10);
        $("#bottomright-text").text("Report Cards")
    })
}
animations.presents = async function(state, component){
    return new Promise((resolve)=>{
        $(`#sub-${state}-container`).css("display","block");
        $(`#sub-${state}`).attr("id",`old-sub-${state}`);
        $(`#sub-${state}-container`).prepend(`<section id="sub-${state}" class="sub-base"></section>`)
        $(`#sub-${state}`).html(component);
        $(`#sub-${state}-container`).css("transform","translateY(-50%)");
        setTimeout(function(){
            $(`#sub-${state}-container`).css("transition",`${user.settings.pageSpeed}ms`);
            $(`#sub-${state}-container`).css("transform","translateY(0%)")
            $(".top").css("transition",`${user.settings.pageSpeed}ms`);
            $(".top").css("background-color","black");
            $(".top").css("border-bottom","solid white 1px");
            $("#handbook-nav").css("transition",`${user.settings.pageSpeed}ms`);
            $("#handbook-nav").css("transform","translateX(0%)")
            setTimeout(function(){
                $("#handbook-nav").css("transition",`0ms`);
                $(`#sub-${state}-container`).css("transition","0ms");
                $(`#old-sub-${state}`).remove();
                $(`#sub-${state}-container`).css("transform","translate(0%,0%)");
                $(`#sub-${state}-container`).css("display","flex");
                resolve();
            },user.settings.pageSpeed)
        },10);
        $("#bottomright-text").text("Presents")
    })
}

animations.reportCardInfo = async function(state, component){
    return new Promise((resolve)=>{
        $(`#sub-${state}-container`).css("display","none");
        $(`#sub-${state}`).attr("id",`old-sub-${state}`);
        $(`#old-sub-${state}`).remove();
        $(`#sub-${state}-container`).prepend(`<section id="sub-${state}" class="sub-base"></section>`)
        $(`#sub-${state}`).html(component);
        $(`#sub-${state}-container`).css("transform","translateY(-50%)");
        setTimeout(function(){
            $(`#sub-${state}-container`).css("transition",`0ms`);
            $(`#sub-${state}-container`).css("transform","translateY(0%)")
            $(`#sub-${state}-container`).fadeIn();
            setTimeout(function(){
                $("#academy-logo").css("transition",`0ms`);
                $(`#sub-${state}-container`).css("transition","0ms");
                $(`#sub-${state}-container`).css("transform","translate(0%,0%)");
                $(`#sub-${state}-container`).css("display","flex");
                resolve();
            },user.settings.pageSpeed)
        },10);
    })
}

animations.reportPage = async function(state, component){
    return new Promise((resolve)=>{
        $(`#sub-${state}-container`).css("display","none");
        $(`#sub-${state}`).attr("id",`old-sub-${state}`);
        $(`#old-sub-${state}`).remove();
        $(`#sub-${state}-container`).prepend(`<section id="sub-${state}" class="sub-base"></section>`)
        $(`#sub-${state}`).html(component);
        $(`#sub-${state}-container`).css("transform","translateY(-50%)");
        setTimeout(function(){
            $(`#sub-${state}-container`).css("transition",`0ms`);
            $(`#sub-${state}-container`).css("transform","translateY(0%)")
            $(`#sub-${state}-container`).fadeIn();
            setTimeout(function(){
                $(`#sub-${state}-container`).css("transition","0ms");
                $(`#sub-${state}-container`).css("transform","translate(0%,0%)");
                $(`#sub-${state}-container`).css("display","flex");
                resolve();
            },user.settings.pageSpeed)
        },10);
    })
}

animations.rules = async function(state, component){
    return new Promise((resolve)=>{
        $(`#sub-${state}-container`).css("display","block");
        $(`#sub-${state}`).attr("id",`old-sub-${state}`);
        $(`#sub-${state}-container`).prepend(`<section id="sub-${state}" class="sub-base"></section>`)
        $(`#sub-${state}`).html(component);
        $(`#sub-${state}-container`).css("transform","translateY(-50%)");
        setTimeout(function(){
            $(`#sub-${state}-container`).css("transition",`${user.settings.pageSpeed}ms`);
            $(`#sub-${state}-container`).css("transform","translateY(0%)")
            $(".top").css("transition",`${user.settings.pageSpeed}ms`);
            $(".top").css("background-color","black");
            $(".top").css("border-bottom","solid white 1px");
            $("#handbook-nav").css("transition",`${user.settings.pageSpeed}ms`);
            $("#handbook-nav").css("transform","translateX(0%)")
            $("#academy-logo").css("transition",`${user.settings.pageSpeed}ms`);
            $("#academy-logo").css("transform","translate(-15.6vw,4vh)");
            setTimeout(function(){
                $("#academy-logo").css("transition",`0ms`);
                $("#handbook-nav").css("transition",`0ms`);
                $(`#sub-${state}-container`).css("transition","0ms");
                $(`#old-sub-${state}`).remove();
                $(`#sub-${state}-container`).css("transform","translate(0%,0%)");
                $(`#sub-${state}-container`).css("display","flex");
                resolve();
            },user.settings.pageSpeed)
        },10);
        $("#bottomright-text").text("Rules")
    })
}