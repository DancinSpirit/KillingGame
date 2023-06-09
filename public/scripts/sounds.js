let song = false;

const playSound = function(url){
    if(!document.getElementById(url.replace(/\s+/g, '-'))){
        $("body").append(`<audio id="${url.replace(/\s+/g, '-')}" src="/sounds/${url}.mp3"></audio>`);
    }else{
        $(`#${url.replace(/\s+/g, '-')}`).attr("src",`/sounds/${url}.mp3`)
    }
    let sound = document.getElementById(url.replace(/\s+/g, '-'));
    console.log(sound);
    sound.volume = user.settings.soundVolume;
    return new Promise(res=>{
        sound.play()
        sound.onended = res
    })
}

const loadMusic = async function(url){
    continueEvent = false;
    song.onended = function(){};
    let repeat = true;
    return new Promise((resolve) =>{
        if(song&&(song!=document.getElementById(url.replace(/\s+/g, '-')))){
            let oldSong = song;
            $(oldSong).animate({volume: 0}, 300);
            setTimeout(function(){
                console.log(oldSong);
                stopAudio(oldSong);
            },300)
        }
        if(url.includes("none")){
            continueEvent = true;
            resolve();
        }else{
            setTimeout(function(){
                if(!document.getElementById(url.replace(/\s+/g, '-'))){
                    $("audio").attr("src","");
                    if(repeat)
                    $("body").append(`<audio id="${url.replace(/\s+/g, '-')}" loop src="/sounds/${url}.mp3"></audio>`);
                    else
                    $("body").append(`<audio id="${url.replace(/\s+/g, '-')}" src="/sounds/${url}.mp3"></audio>`);
                }else{
                    if(document.getElementById(url.replace(/\s+/g, '-')).paused){
                        $(`#${url.replace(/\s+/g, '-')}`).attr("src",`/sounds/${url}.mp3`)
                    }
                }
                song = document.getElementById(url.replace(/\s+/g, '-'));
                console.log(song);
                song.volume = user.settings.musicVolume;
                let played = song.play();
                console.log(played);
                if(played !== undefined){
                    played.then(_ =>{
                        continueEvent = true;
                        resolve();
                    }).catch(error =>{
                        $('html').on("click", function(){
                            song.play();
                        })
                        continueEvent = true;
                        resolve();
                    })
                }
            },300)
        }
    })
}

const stopAudio = function(song){
    song.pause();
    song.currentTime = 0;
}