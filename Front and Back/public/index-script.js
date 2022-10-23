let buscarBtn = document.querySelector("#search");
let inpBx = document.querySelector("#inputBox");
let results = document.querySelector("#results");

const baseUrl = 'http://localhost:3000/';

buscarBtn.addEventListener('click', buscar);

inpBx.addEventListener('keyup', function (e) {
    e.preventDefault();
    let tecla = e.keyCode;
    if (tecla === 13)
        buscarBtn.click();
})

function buscar(e) {
    results.innerHTML = 'Buscando...';
    setTimeout(getInfo, 2000);

    e.preventDefault();
    postInfo();
    getInfo();

    async function postInfo(e) {
        if (inpBx.value == "") {
            return
        }
        const res = await fetch(baseUrl, {
            method: 'POST',
            headers: {
                "Content-Type": 'application/json'
            },
            body: JSON.stringify({
                parcel: inpBx.value
            })
        });
    }

    async function getInfo(e) {
        const res = await fetch(baseUrl + 'info/test?key=busca', {
            method: 'GET'
        });

        // console.log(res);
        const data = await res.json();

        let resultado = data.info;
        results.innerHTML = "";

        for (let pos = 0; pos < resultado.length; pos++) {
            results.innerHTML += `
                    <div class="song">
                        <div class="s-image">
                            <img src="${resultado[pos]["image"]}" alt="" draggable="false">
                        </div>
                        <div class="s-data">
                            <h1>${resultado[pos]["title_short"]}</h1>
                            <h2>${resultado[pos]["artist"]}</h2>
                            <h2>${resultado[pos]["album"]}</h2>
                        </div>
                        <div class="s-buttons">
                            <button style="font-size: 28px;"> + </button>
                            <button style="font-size: 20px;" onclick="show('${resultado[pos]["image"]}', '${resultado[pos]["title_short"]}', '${resultado[pos]["artist"]}', '${resultado[pos]["album"]}', '${resultado[pos]["preview"]}');"> 
                                <i class="fa-solid fa-play" style="color: #fff; margin-inline: 16px"></i>
                            </button>
                        </div>
                    </div>
                    `;
        }

        results.innerHTML += '<div class="song-empty"></div>'
    }
}

let image = document.querySelector('#image');
let title = document.querySelector('#title');
let artist = document.querySelector('#artist');
let album = document.querySelector('#album');

let audioPlayer = document.querySelector('#audioPlayer');
let preview = document.querySelector('#preview');

let playBtn = document.querySelector('#playBtn');
let pauseBtn = document.querySelector('#pauseBtn');
let backwardBtn = document.querySelector('#backwardBtn');
let forwardBtn = document.querySelector('#forwardBtn');

let progressBar = document.querySelector('.music-progress-bar')
let songDuration = document.querySelector('.duration');
let songCurrentTime = document.querySelector('.current-time');

let volumeSlider = document.querySelector('.volume-slider')

function show(imageSrc, titleTxt, artistTxt, albumTxt, previewSrc) {
    image.style.display = 'block';

    image.src = imageSrc;
    title.innerHTML = titleTxt;
    artist.innerHTML = artistTxt;
    album.innerHTML = albumTxt;
    preview.src = previewSrc;

    setTimeout(() => {
        alert(audioPlayer.duration)
        progressBar.max = audioPlayer.duration;
        songDuration.innerHTML = formatTime(audioPlayer.duration);
    }, 300);
    songCurrentTime.innerHTML = '00 : 00';

    playBtn.click();
}

const formatTime = (time) => {
    let min = Math.floor(time / 60);
    if (min < 10) {
        min = `0` + min;
    }

    let sec = Math.floor(time % 60);
    if (sec < 10) {
        sec = `0` + sec;
    }

    return `${min} : ${sec}`;
}

playBtn.addEventListener('click', () => {
    playBtn.style.display = "none";
    pauseBtn.style.display = "inline";

    audioPlayer.play();
});

pauseBtn.addEventListener('click', () => {
    playBtn.style.display = "inline";
    pauseBtn.style.display = "none";

    video.pause();
});

backwardBtn.addEventListener('click', () => {
    audioPlayer.currentTime = 0;
})

forwardBtn.addEventListener('click', () => {
    audioPlayer.currentTime = Math.floor(audioPlayer.max);
})

setInterval(() => {
    progressBar.value = audioPlayer.currentTime;
    songCurrentTime.innerHTML = formatTime(audioPlayer.currentTime);
}, 500)

progressBar.addEventListener('change', () => {
    audioPlayer.currentTime = progressBar.value;
})

volumeSlider.addEventListener('input', () => {
    audioPlayer.volume = volumeSlider.value;
})
