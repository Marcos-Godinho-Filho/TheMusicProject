let buscarBtn = document.querySelector("#search");
let inpBx = document.querySelector("#inputBox");
let results = document.querySelector("#results");

const baseUrl = 'http://localhost:3000/';

buscarBtn.addEventListener('click', buscar);

inpBx.addEventListener('keyup', function(e) {
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
            let preview = resultado[pos]["preview"];

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
                            <button style="font-size: 20px;" onclick="show('${resultado[pos]["image"]}', '${resultado[pos]["title_short"]}', '${resultado[pos]["artist"]}', '${resultado[pos]["album"]}', '${preview}')"> 
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

let audio = document.querySelector('#audioPlayer');
let preview = document.querySelector('#preview');

let playBtn = document.querySelector('#playBtn');
let pauseBtn = document.querySelector('#pauseBtn');

let progressBar = document.querySelector('.music-progress-bar')
let songDuration = document.querySelector('.duration');
let songCurrentTime = document.querySelector('.current-time');

let volumeSlider = document.querySelector('.volume-slider')

let audioPlayer = document.querySelector('.audioPlayer');

function show (image, title, artist, album, preview) {
    document.querySelector('#image').style.display = 'block';

    image.src = this.image;
    title.innerHTML = this.title;
    artist.innerHTML = this.artist;
    album.innerHTML = this.album;
    preview.src = this.preview;

    setTimeout(() => {
        progressBar.max = music.duration;
        songDuration.innerHTML = formatTime(audio.duration);
    }, 300);
    songCurrentTime.innerHTML = '00 : 00';

    playBtn.click();
}

const formatTime = (time) => {
    let min = Math.floor (time / 60);
    if (min < 10){
        min = `0` + min;
    }

    let sec = Math.floor(time % 60);
    if (sec < 10){
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

    audioPlayer.pause();
});

progressBar.addEventListener('change', () => {
    audio.currentTime = progressBar.value;
})

volumeSlider.addEventListener('input', () => {
    audio.volume = volumeSlider.value;
})