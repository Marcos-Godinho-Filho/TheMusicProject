document.addEventListener('load', getInfoLoad);

const BASE_URL = window.location.href;

async function getInfoLoad(e) {
    let playlists = document.querySelector('.sidebar-playlists');

    const res = await fetch(BASE_URL, {
        method: 'GET'
    });

    const data = await res.json();
    let resultado = data.playlists;
    let id = data.idUser;

    for (let i = 0; i < resultado.length; i++) {
        playlists.innerHTML += `<a href="/${id}/playlist/${i}">${playlists[pos].nomePlaylist}</a>`;
    }
}

let buscarBtn = document.querySelector("#search");
let inpBx = document.querySelector("#inputBox");
let results = document.querySelector("#results");

buscarBtn.addEventListener('click', buscar);

inpBx.addEventListener('keyup', function (e) {
    e.preventDefault();
    let tecla = e.keyCode;
    if (tecla === 13)
        buscarBtn.click();
})

function buscar(e) {
    results.innerHTML = '';
    document.querySelector('.container-animation').style.display = 'flex';

    e.preventDefault();
    postInfo();
    setTimeout(getInfo, 2000);

    async function postInfo(e) {
        if (inpBx.value == "") {
            return;
        }
        const res = await fetch(BASE_URL, {
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
        const res = await fetch(BASE_URL, {
            method: 'GET'
        });

        const data = await res.json();

        let resultado = data.info;

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
                        <button style="font-size: 20px;" onclick="showSelectPlaylistBox()">
                            <i class="fa-solid fa-plus" style="color: #fff;"></i>
                        </button>
                        <button style="font-size: 20px;" onclick="showSongData('${resultado[pos]["image"]}', '${resultado[pos]["title_short"]}', '${resultado[pos]["artist"]}', '${resultado[pos]["album"]}', '${resultado[pos]["preview"]}');"> 
                            <i class="fa-solid fa-play" style="color: #fff;"></i>
                        </button>
                    </div>
                </div>
                `;
        }
        document.querySelector('.container-animation').style.display = 'none';
        if (results.childNodes.length == 0) {
            results.innerHTML = '<div id="noResults"> Sem resultados para a busca. </div>'
        }
    }
}

document.querySelector('#createPlaylist').addEventListener('click', () => {
    let id = '#createPlaylistBox';
    let createPlaylistBoxContent = `
            <h1 class="boxTitle"> Criar Playlist </h1>
            <div id="edit-image">
                <button id="edit-img-button" onclick="document.getElementById('fileReader').click()">
                    <img id="img-button" alt="Browse" src="../imgs/playlist-icon.png">
                </button>
                <input type="file" id="fileReader" accept="image/*">
            </div>
            <div id="edit-data">
                <input type="text" id="newTitle" value="Nome"> </input> 
                <textarea id="newDescription">Descrição</textarea>
            </div>
            <div class="options-buttons">
                <button id="confirmCreatePlaylist"> Criar </button>
                <button id="calcelCreatePlaylist"> Cancelar </button>
            </div>
            `;
    showBox(id, createPlaylistBoxContent);

    let previousImg = '';

    const reader = new FileReader();
    const fileInput = document.querySelector("#fileReader");
    const img = document.querySelector("#img-button");
    reader.onload = e => {
        img.src = e.target.result;
        previousImg = img.src;
        img.style.width = '200px';
        img.style.height = '200px';
    }
    fileInput.addEventListener('change', e => {
        const f = e.target.files[0];
        reader.readAsDataURL(f);
    })

    document.querySelector('#edit-img-button').addEventListener('mouseover', () => {
        previousImg = img.src;
        img.src = '../images/browse.png';
        img.style.width = '200px';
        img.style.height = '200px';
    })
    document.querySelector('#edit-img-button').addEventListener('mouseout', () => {
        img.src = previousImg;
        img.style.width = '200px';
        img.style.height = '200px';
    })

    document.querySelector('#confirmCreatePlaylist').addEventListener('click', () => {

        async function createPlaylist(e) {
            const res = await fetch(BASE_URL + '/insertPlaylist', {
                method: 'POST',
                headers: {
                    "Content-Type": 'application/json'
                },
                body: JSON.stringify({
                    nome: document.querySelector('#newTitle').value,
                    descricao: document.querySelector('#newDescription').value,
                    imagem: document.querySelector('#img-button').src
                })
            });
        }

        createPlaylist();

        hideBox(id);
    })

    document.querySelector('#calcelCreatePlaylist').addEventListener('click', () => {
        hideBox(id);
    })
})

let image = document.querySelector('#image');
let title = document.querySelector('#title');
let artist = document.querySelector('#artist');
let album = document.querySelector('#album');

let preview = document.querySelector('#preview');

let playBtn = document.querySelector('#playBtn');
let pauseBtn = document.querySelector('#pauseBtn');
let backwardBtn = document.querySelector('#backwardBtn');
let forwardBtn = document.querySelector('#forwardBtn');

let progressBar = document.querySelector('.music-progress-bar')
let songDuration = document.querySelector('.duration');
let songCurrentTime = document.querySelector('.current-time');

let volumeSlider = document.querySelector('.volume-slider');

let audioPlayer = document.querySelector('#audioPlayer');

function showSongData(imageSrc, titleTxt, artistTxt, albumTxt, previewSrc) {
    document.querySelector('.player').style.display = "flex";
    document.querySelector('#main').style.height = 'calc(100% - 75px - 125px)';
    document.querySelector('#aside').style.height = 'calc(100% - 125px)';

    document.querySelector('#image').src = imageSrc;
    document.querySelector('#title').innerHTML = titleTxt;
    document.querySelector('#artist').innerHTML = artistTxt;
    document.querySelector('#album').innerHTML = albumTxt;
    document.querySelector('#preview').src = previewSrc;

    audioPlayer.load();

    playBtn.click();

    progressBar.max = audioPlayer.duration;
    songDuration.innerHTML = formatTime(29);

    songCurrentTime.innerHTML = '00 : 00';
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

    if (audioPlayer.currentTime >= 29) {
        backwardBtn.click();
    }
    else {
        audioPlayer.play();
    }
})

pauseBtn.addEventListener('click', () => {
    playBtn.style.display = "inline";
    pauseBtn.style.display = "none";

    audioPlayer.pause();
});

backwardBtn.addEventListener('click', () => {
    audioPlayer.currentTime = 0;

    playBtn.click();
})

forwardBtn.addEventListener('click', () => {
    audioPlayer.currentTime = 29;
})

setInterval(() => {
    songCurrentTime.innerHTML = formatTime(audioPlayer.currentTime);
    progressBar.value = audioPlayer.currentTime * 3.4;

    if (audioPlayer.currentTime >= 29) {
        pauseBtn.click();
    }
}, 500)

progressBar.addEventListener('input', () => {
    audioPlayer.currentTime = progressBar.value / 3.4;
})

volumeSlider.addEventListener('input', () => {
    audioPlayer.volume = volumeSlider.value;
})

let previousVolume = 0;
let volumeBtn = document.querySelector('#volumeBtn');

volumeBtn.addEventListener('click', () => {
    let volumeIcon = document.querySelector('#volume-icon');

    if (volumeSlider.value > 0) {
        previousVolume = volumeSlider.value;

        volumeSlider.value = 0;
        audioPlayer.volume = 0;
    }
    else if (volumeSlider.value == 0) {
        volumeSlider.value = previousVolume;
        audioPlayer.volume = previousVolume;
    }
})

let closeSong = document.querySelector('#closeSong');

closeSong.addEventListener('click', () => {
    audioPlayer.pause();
    document.querySelector('.player').style.display = "none";
    document.querySelector('#main').style.height = 'calc(100% - 75px)';
    document.querySelector('#aside').style.height = '100%';
})

let showSelectPlaylistBox = function () {
    let id = '#selectPlaylistBox';
    let showSelectPlaylistBoxContent = `
        <h1 class="boxTitle"> Adicionar às playlists </h1>
        <p> Selecione a playlist desejada: </p>
        <div id="division"> </div>
    `;

    /* Comandos para pegar no banco de dados as playlists do usuário */

    /* Comando de exemplo para mostrar a formatação: */
    showSelectPlaylistBoxContent += `
        <div id="playlists">
            <ul>
                <li class="playlist" onclick="select(0)">Playlist 1</li>
                <li class="playlist" onclick="select(1)">Playlist 2</li>
                <li class="playlist" onclick="select(2)">Playlist 3</li>
                <li class="playlist" onclick="select(3)">Playlist 4</li>
                <li class="playlist" onclick="select(4)">Playlist 5</li>
            <ul>
        </div>
    `;

    /* Caso não haja nenhuma playlist criada, mostrar uma instrução ao usuário: */
    /* deletePlaylistBoxContent += 
        <p> Você ainda não criou nenhuma playlist. Clique no botão "Criar Playlist" na barra lateral para poder salvar suas músicas favoritas. </p> 
    `;*/

    showSelectPlaylistBoxContent += `
        <div class="options-buttons">
            <button id="addSongToPlaylist"> Adicionar </button>
            <button id="calcelDeletePlaylist"> Cancelar </button>
        </div>
    `;
    showBox(id, showSelectPlaylistBoxContent);

    let selectedPlaylist;

    function select(pos) {
        const playlists = document.getElementsByClassName('playlist');

        selectedPlaylist.style.backgroundColor = 'transparent';

        selectedPlaylist = playlists[pos];
        selectedPlaylist.style.backgroundColor = '#505050';
    }

    document.querySelector('#addSongToPlaylist').addEventListener('click', () => {
        /* comandos para inserir a música na playlist no BD */

        hideBox(id);
    })

    document.querySelector('#calcelDeletePlaylist').addEventListener('click', () => {
        hideBox(id);
    })
}

let showBox = function (id, content) {
    document.querySelector('#aside').style.filter = 'blur(7px)';
    document.querySelector('#header').style.filter = 'blur(7px)';
    document.querySelector('#main').style.filter = 'blur(7px)';
    const box = document.querySelector(id);
    box.innerHTML = content;
    box.style.display = 'block';
}

let hideBox = function (id) {
    document.querySelector('#aside').style.filter = 'none';
    document.querySelector('#header').style.filter = 'none';
    document.querySelector('#main').style.filter = 'none';
    const box = document.querySelector(id);
    box.innerHTML = '';
    box.style.display = 'none';
}
