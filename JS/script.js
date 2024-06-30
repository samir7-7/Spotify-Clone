console.log("hello");
let currentSong = new Audio();
let playbtn = document.getElementById("play");

// function to move seekbar
function moveSeekBar(currentTime,totalTime){
    let percent = (currentTime/totalTime)*100;
        document.querySelector(".scircle").style.left = percent +"%";
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = remainingSeconds.toFixed(0).padStart(2, '0'); // Display exactly two digits
    return `${formattedMinutes}:${formattedSeconds}`;
}

function playSong(name){
    currentSong.src = "assets/songs/"+ name;
    currentSong.play();
    playbtn.classList.remove("fa-play");
    playbtn.classList.add("fa-pause");
    document.querySelector(".songname").innerHTML= name;
    document.querySelector(".songtime").innerHTML = "00:00/00:00"
}

async function getSongs() {
    let a = await fetch("http://127.0.0.1:5500/Spotify-Clone/assets/songs/");
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    let songs = [];

    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href)
        }
    }

    return (songs)
}

getSongs();

async function main() {
    let songs = await getSongs();
    var audio = new Audio(songs[0]);

    audio.addEventListener("loadeddata", () => {
        let duration = audio.duration;
        console.log(duration);
    })
    // })



    let ul = document.querySelector(".songs").getElementsByTagName("ol")[0];
    // for (let index = 0; index < songs.length; index++) {
    //     const element = songs[index];
    //     ul.innerHTML= `<li>${element}</li>`
    // }
    for (const song of songs) {
        ul.innerHTML = ul.innerHTML + `
    <li><img src="assets/images/music.svg" alt="">
                            <div class="info">
                                <h4>${song.split("/songs/")[1]}</h4>
                                <p>By Samir Nepal</p>
                            </div>
                            <div class="playnow">
                                <span>Play now</span>
                                <i class="fa-solid fa-play"></i>
                            </div></li>`;
    }

    Array.from(document.querySelector(".songs").getElementsByTagName("li")).forEach((e)=>{
        console.log(e);
        e.addEventListener("click",()=>{
            let song = e.querySelector(".info").firstElementChild.innerHTML.trim();
            playSong(song);
        })
    })

    // attach eventlistner to play, next and previous
    playbtn.addEventListener("click", () => {
       if(currentSong.paused){
        currentSong.play();
        playbtn.classList.remove("fa-play");
        playbtn.classList.add("fa-pause");
       }

       else{
        currentSong.pause();
        playbtn.classList.remove("fa-pause");
        playbtn.classList.add("fa-play");
       }

    });

    currentSong.addEventListener("timeupdate",()=>{
        document.querySelector(".songtime").innerHTML = `${formatTime(currentSong.currentTime)}/${formatTime(currentSong.duration)}`;
        moveSeekBar(currentSong.currentTime,currentSong.duration);
    })

    document.querySelector(".seekbar").addEventListener("click", (e)=>{
        console.log(e);
    })
}

main();