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
        $("#bottomright-text").text("E-Handbook")
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
            $(".top").css("background-color","transparent");
            resolve();
        },user.settings.pageSpeed)
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
        $("#bottomright-text").text("Story")
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
            $(".top").css("background-color","black");
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
            $(".top").css("background-color","black");
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
    })
}

animations.reportCardInfo = async function(state, component){
    return new Promise((resolve)=>{
        $(`#sub-${state}-container`).css("display","block");
        $(`#sub-${state}`).attr("id",`old-sub-${state}`);
        $(`#sub-${state}-container`).prepend(`<section id="sub-${state}" class="sub-base"></section>`)
        $(`#sub-${state}`).html(component);
        $(`#sub-${state}-container`).css("transform","translateY(-50%)");
        setTimeout(function(){
            $("#academy-logo").css("transition",`${user.settings.pageSpeed}ms`);
            $("#academy-logo").css("transform","translate(27vw,5vh)");
            $(`#sub-${state}-container`).css("transition",`${user.settings.pageSpeed}ms`);
            $(`#sub-${state}-container`).css("transform","translateY(0%)")
            setTimeout(function(){
                $("#academy-logo").css("transition",`0ms`);
                $(`#sub-${state}-container`).css("transition","0ms");
                $(`#old-sub-${state}`).remove();
                $(`#sub-${state}-container`).css("transform","translate(0%,0%)");
                $(`#sub-${state}-container`).css("display","flex");
                resolve();
            },user.settings.pageSpeed)
        },10);
    })
}