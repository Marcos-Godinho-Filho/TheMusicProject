document.addEventListener('load', getInfo);

const BASE_URL = 'http://localhost:3000/:id/playlist/:idPl';

let songs = [];
async function getInfo(e) {
    let playlists = document.querySelector('.sidebar-playlists');
    let title = document.querySelector('#title');
    let description = document.querySelector('#description');
    let songCount = document.querySelector("#songCount");
    let img = document.querySelector("#t-img");
    let songsDiv = document.querySelector('#songs');

    const res = await fetch(BASE_URL, {
        method: 'GET'
    });

    const data = await res.json();
    let resultado = data.playlists;
    let id = data.idUser;

    for (let i = 0; i < resultado.length; i++) {
        playlists.innerHTML += `<a href="/${id}/playlist/${i}">${playlists[pos].nomePlaylist}</a>`;
    }

    let playlist = data.playlist;
    title.innerHTML = playlist.nomePlaylist;
    description.innerHTML = playlist.desc;
    songCount.innerHTML = playlist.songs.length() + "";
    img.src = playlist.img;

    songs = playlist.songs;
    let nomeMusica = songs.nomeMusica;
    let nomeArtista = songs.nomeArtista;
    let nomeAlbum = songs.nomeAlbum;
    let previewMusica = songs.previewMusica;
    let imagem = songs.imagem;

    for (let i = 0; i < songs.length; i++) {
        songsDiv.innerHTML += `
            <div class="song" id="song${i + 1}">
                <div class="s-image">
                    <img src="${imagem}" alt="Img" draggable="false">
                </div>
                <div class="s-data">
                    <h1>${nomeMusica}</h1>
                    <h2>${nomeArtista}</h2>
                    <h2>${nomeAlbum}</h2>
                </div>
                <div class="s-buttons">
                    <button style="font-size: 20px;" onclick="removeSong('#song${i + 1}')">
                        <i class="fa-solid fa-trash-can" style="color: #fff;"></i>
                    </button>
                    <button style="font-size: 20px;" onclick="showSongData( '${imagem}', '${nomeMusica}', '${nomeArtista}', '${nomeAlbum}', '${previewMusica}');">  
                        <i class="fa-solid fa-play" style="color: #fff;"></i>
                    </button>
                </div>
            </div>`;
    }
}

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
});

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

        async function postInfo(e) {
            const res = await fetch(baseUrl, {
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

        postInfo();

        hideBox(id);
    })

    document.querySelector('#calcelCreatePlaylist').addEventListener('click', () => {
        hideBox(id);
    })
})

document.querySelector('#play').addEventListener('click', () => {

})

document.querySelector('#delete').addEventListener('click', () => {
    let id = '#deletePlaylistBox';
    let deletePlaylistBoxContent = `
        <h1 class="boxTitle"> Deletar Playlist </h1>
        <p class="message"> Tem certeza que deseja deletar a Playlist? </p>
        <div class="options-buttons">
            <button id="deletePlaylist"> Deletar </button>
            <button id="calcelDeletePlaylist"> Cancelar </button>
        </div>
    `;
    showBox(id, deletePlaylistBoxContent);

    document.querySelector('#deletePlaylist').addEventListener('click', () => {
        hideBox(id);

        deletePlaylist();

        async function deletePlaylist(e) {
            const res = await fetch(BASE_URL, {
                method: 'PUT',
                headers: {
                    "Content-Type": 'application/json'
                },
                body: {
                    posPl: a
                }
            });
        }

        window.location.href = "../Home/home.html"
    })

    document.querySelector('#calcelDeletePlaylist').addEventListener('click', () => {
        hideBox(id);
    })
})

document.querySelector('#edit').addEventListener('click', () => {

    let id = '#editPlaylistBox';
    let editBoxContent = `
        <h1 class="boxTitle"> Editar Playlist </h1>
        <div id="edit-image">
            <button id="edit-img-button" onclick="document.getElementById('fileReader').click()">
                <img id="img-button" alt="Browse" src="${document.querySelector('#t-img').src}">
            </button>
            <input type="file" id="fileReader" accept="image/*">
        </div>
        <div id="edit-data">
            <input type="text" id="newTitle" value="${document.querySelector('#title').value}"> </input> 
            <textarea id="newDescription">${document.querySelector('#description').value}</textarea>
        </div>
        <div class="options-buttons">
            <button id="saveEditPlaylist"> Salvar </button>
            <button id="calcelEditPlaylist"> Cancelar </button>
        </div>
        `;
    showBox(id, editBoxContent);

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
        img.src = '../photos/browse.png';
        img.style.width = '200px';
        img.style.height = '200px';
    })
    document.querySelector('#edit-img-button').addEventListener('mouseout', () => {
        img.src = previousImg;
        img.style.width = '200px';
        img.style.height = '200px';
    })

    document.querySelector('#saveEditPlaylist').addEventListener('click', () => {
        putInfo();

        async function putInfo(e) {
            const res = await fetch(BASE_URL, {
                method: 'PUT',
                headers: {
                    "Content-Type": 'application/json'
                },
                body: {
                    name: document.querySelector('#newTitle').value,
                    description: document.querySelector('#newDescription').value,
                    img: document.querySelector('#img-button').src
                }
            });
        }

        document.querySelector('#title').innerHTML = document.querySelector('#newTitle').value
        document.querySelector('#description').innerHTML = document.querySelector('#newDescription').value;
        const img = document.querySelector('#t-img');
        img.src = document.querySelector('#img-button').src;
        img.style.width = '220px';
        img.style.height = '220px';
        hideBox(id);
    })

    document.querySelector('#calcelEditPlaylist').addEventListener('click', () => {
        hideBox(id);
    })
})

let removeSong = function (idSong) {
    let id = '#removeSongBox';
    let removeSongBoxContent = `
        <h1 class="boxTitle"> Remover música </h1>
        <p class="message"> Tem certeza que deseja remover a música da Playlist? </p>
        <div class="options-buttons">
            <button id="removeSong"> Remover </button>
            <button id="calcelRemoveSong"> Cancelar </button>
        </div>
    `;
    showBox(id, removeSongBoxContent);

    document.querySelector('#removeSong').addEventListener('click', () => {
        
        deleteSong();

        async function deleteSong(e) {
            const res = await fetch(BASE_URL, {
                method: 'PUT',
                headers: {
                    "Content-Type": 'application/json'
                },
                body: {
                    posPl: a,
                    posMs: Number(idSong.slice(4))
                }
            });
        }

        let removedSong = document.querySelector(idSong);
        removedSong.remove();

        hideBox(id);
    })

    document.querySelector('#calcelRemoveSong').addEventListener('click', () => {
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
