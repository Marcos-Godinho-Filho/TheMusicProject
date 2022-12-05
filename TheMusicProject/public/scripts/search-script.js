const BASE_URL = window.location.href

const idUser = BASE_URL.substring(29)

const buscarBtn = document.querySelector("#search")
const inpBx = document.querySelector("#inputBox")
const results = document.querySelector("#results")

buscarBtn.addEventListener('click', buscar)

inpBx.addEventListener('keyup', function (e) {
    e.preventDefault()
    let tecla = e.keyCode
    if (tecla === 13)
        buscarBtn.click()
})

let retorno
function buscar(e) {
    results.innerHTML = ''
    document.querySelector('.container-animation').style.display = 'flex'

    e.preventDefault()
    postInfo()
    setTimeout(getInfo, 2000)

    async function postInfo(e) {
        if (inpBx.value == "") {
            return
        }
        const res = await fetch(BASE_URL + '/results', {
            method: 'POST',
            headers: {
                "Content-Type": 'application/json'
            },
            body: JSON.stringify({
                parcel: inpBx.value
            })
        })
    }

    async function getInfo(e) {
        const res = await fetch(BASE_URL + '/results', {
            method: 'GET',
        })

        const data = await res.json()
        retorno = data.retorno

        document.querySelector('.container-animation').style.display = 'none'

        if (retorno.length == 0)
            results.innerHTML = "<div id='noResults'> Sem resultados para a busca. </div>"
        else {
            for (let i = 0; i < retorno.length; i++) {
                results.innerHTML += `
            <div class="song">
                <div class="s-image">
                    <img src="${retorno[i].imagem}" alt="" draggable="false">
                </div>
                <div class="s-data">
                    <h1>
                        ${retorno[i].nome}
                    </h1>
                    <h2>
                        ${retorno[i].artista}
                    </h2>
                    <h2>
                        ${retorno[i].album}
                    </h2>
                </div>
                <div class="s-buttons">
                    <button style="font-size: 20px" onclick="showSelectPlaylistBox(${i})">
                        <i class="fa-solid fa-plus" style="color: #fff"></i>
                    </button>
                    <button style="font-size: 20px"
                        onclick="showSongData('${retorno[i].imagem}', '${retorno[i].nome}', '${retorno[i].artista}', '${retorno[i].album}', '${retorno[i].preview}')">
                        <i class="fa-solid fa-play" style="color: #fff"></i>
                    </button>
                </div>
            </div>`
            }
        }
    }
}

let idPl

document.querySelector('#createPlaylist').addEventListener('click', () => {
    const id = '#createPlaylistBox'
    let createPlaylistBoxContent = `
            <h1 class="boxTitle"> Criar Playlist </h1>
            <div id="edit-image-cp">
                <button id="edit-img-button-cp" onclick="document.getElementById('fileReader-cp').click()">
                    <img id="img-button-cp" alt="Browse" src="../imgs/playlist-icon.png">
                </button>
                <input type="file" id="fileReader-cp" accept="image/*">
            </div>
            <div id="edit-data-cp">
                <input type="text" id="newTitle" value="Nome"> </input> 
                <textarea maxlength="50" id="newDescription" resize="none">Descrição</textarea>
            </div>
            <div class="options-buttons">
                <button id="confirmCreatePlaylist"> Criar </button>
                <button id="calcelCreatePlaylist"> Cancelar </button>
            </div>
            `
    showBox(id, createPlaylistBoxContent)

    let previousImg = ''

    const reader = new FileReader()
    const fileInput = document.querySelector("#fileReader-cp")
    const img = document.querySelector("#img-button-cp")
    reader.onload = e => {
        img.src = e.target.result
        previousImg = img.src
        img.style.width = '200px'
        img.style.height = '200px'
    }
    fileInput.addEventListener('change', e => {
        const f = e.target.files[0]
        reader.readAsDataURL(f)
    })

    document.querySelector('#edit-img-button-cp').addEventListener('mouseover', () => {
        previousImg = img.src
        img.src = '../imgs/browse.png'
        img.style.width = '200px'
        img.style.height = '200px'
    })
    document.querySelector('#edit-img-button-cp').addEventListener('mouseout', () => {
        img.src = previousImg
        img.style.width = '200px'
        img.style.height = '200px'
    })

    document.querySelector('#confirmCreatePlaylist').addEventListener('click', () => {
        async function createPlaylist(e) {
            const res = await fetch(BASE_URL + '/insertPlaylist', {
                method: 'PUT',
                headers: {
                    "Content-Type": 'application/json'
                },
                body: JSON.stringify({
                    nome: document.querySelector('#newTitle').value,
                    descricao: document.querySelector('#newDescription').value,
                    imagem: document.querySelector('#img-button-cp').src,
                })
            })

            const data = await res.json()
            idPl = data.idPl
            window.location.href = `http://localhost:3000/playlist/${idUser}/${idPl}`
        }

        createPlaylist()
        hideBox(id)
    })

    document.querySelector('#calcelCreatePlaylist').addEventListener('click', () => {
        hideBox(id)
    })
})

const image = document.querySelector('#image')
const title = document.querySelector('#title')
const artist = document.querySelector('#artist')
const album = document.querySelector('#album')

const preview = document.querySelector('#preview')

const playBtn = document.querySelector('#playBtn')
const pauseBtn = document.querySelector('#pauseBtn')
const backwardBtn = document.querySelector('#backwardBtn')
const forwardBtn = document.querySelector('#forwardBtn')

const progressBar = document.querySelector('.music-progress-bar')
const songDuration = document.querySelector('.duration')
const songCurrentTime = document.querySelector('.current-time')

const volumeSlider = document.querySelector('.volume-slider')

const audioPlayer = document.querySelector('#audioPlayer')

function showSongData(imageSrc, titleTxt, artistTxt, albumTxt, previewSrc) {
    document.querySelector('.player').style.display = "flex"
    document.querySelector('#main').style.height = 'calc(100% - 75px - 125px)'
    document.querySelector('#aside').style.height = 'calc(100% - 125px)'

    document.querySelector('#image').src = imageSrc
    document.querySelector('#title').innerHTML = titleTxt
    document.querySelector('#artist').innerHTML = artistTxt
    document.querySelector('#album').innerHTML = albumTxt
    document.querySelector('#preview').src = previewSrc

    audioPlayer.load()

    playBtn.click()

    progressBar.max = audioPlayer.duration
    songDuration.innerHTML = formatTime(29)

    songCurrentTime.innerHTML = '00 : 00'
}

let formatTime = (time) => {
    let min = Math.floor(time / 60)
    if (min < 10) {
        min = `0` + min
    }

    let sec = Math.floor(time % 60)
    if (sec < 10) {
        sec = `0` + sec
    }

    return `${min} : ${sec}`
}

playBtn.addEventListener('click', () => {
    playBtn.style.display = "none"
    pauseBtn.style.display = "inline"

    if (audioPlayer.currentTime >= 29) {
        backwardBtn.click()
    }
    else {
        audioPlayer.play()
    }
})

pauseBtn.addEventListener('click', () => {
    playBtn.style.display = "inline"
    pauseBtn.style.display = "none"

    audioPlayer.pause()
})

backwardBtn.addEventListener('click', () => {
    audioPlayer.currentTime = 0

    playBtn.click()
})

forwardBtn.addEventListener('click', () => {
    audioPlayer.currentTime = 29
})

setInterval(() => {
    songCurrentTime.innerHTML = formatTime(audioPlayer.currentTime)
    progressBar.value = audioPlayer.currentTime * 3.4

    if (audioPlayer.currentTime >= 29) {
        pauseBtn.click()
    }
}, 500)

progressBar.addEventListener('input', () => {
    audioPlayer.currentTime = progressBar.value / 3.4
})

volumeSlider.addEventListener('input', () => {
    audioPlayer.volume = volumeSlider.value
})

let previousVolume = 0
let volumeBtn = document.querySelector('#volumeBtn')

volumeBtn.addEventListener('click', () => {
    let volumeIcon = document.querySelector('#volume-icon')

    if (volumeSlider.value > 0) {
        previousVolume = volumeSlider.value

        volumeSlider.value = 0
        audioPlayer.volume = 0
    }
    else if (volumeSlider.value == 0) {
        volumeSlider.value = previousVolume
        audioPlayer.volume = previousVolume
    }
})

let closeSong = document.querySelector('#closeSong')

closeSong.addEventListener('click', () => {
    audioPlayer.pause()
    document.querySelector('.player').style.display = "none"
    document.querySelector('#main').style.height = '100%'
    document.querySelector('#aside').style.height = '100%'
})

let posicaoMusica
let showSelectPlaylistBox = function (pos) {
    const idPlaylistBox = '#selectPlaylistBox'
    let selectPlaylistBoxContent
    posicaoMusica = pos

    getPlaylists()

    let resultado
    async function getPlaylists(e) {
        const res = await fetch(BASE_URL + '/playlists', {
            method: 'GET'
        })

        const data = await res.json()
        resultado = data.playlists

        console.log(resultado)

        if (resultado.length == 0) {
            document.querySelector("#selectPlaylistBox").style.height = "200px"
            selectPlaylistBoxContent = `
                <p> Você ainda possui nenhuma playlist criada. Clique no botão "Criar Playlist" na barra lateral para poder criá-la e salvar suas músicas favoritas! </p>
                <div class="options-buttons" >
                    <button id="calcelAddSongToPlaylist"> Cancelar </button>
                </div>`
        }
        else {
            selectPlaylistBoxContent = `
            <h1 class="boxTitle"> Adicionar às playlists </h1>
                <p> Selecione a playlist desejada: </p>
                <div id="division"> </div>
                <div id="playlists">`

            for (let i = 0; i < resultado.length; i++) {
                selectPlaylistBoxContent += `
                    <div class="playlist">
                        <input type="checkbox" value="${i}" name="playlist">
                        <label>${resultado[i].nomePlaylist}</label>
                        <br>
                    </div class="playlist">`
            }

            selectPlaylistBoxContent += `
                </div>`

            selectPlaylistBoxContent += `
                <div class="options-buttons" >
                    <button id="addSongToPlaylist"> Adicionar </button>
                    <button id="calcelAddSongToPlaylist"> Cancelar </button>
                </div> `
        }

        showBox(idPlaylistBox, selectPlaylistBoxContent)

        document.querySelector("#calcelAddSongToPlaylist").addEventListener('click', () => {
            hideBox(idPlaylistBox)
        })

        document.querySelector('#addSongToPlaylist').addEventListener('click', () => {

            const playlists = document.getElementsByName("playlist")

            let posicoes = []
            for (let i = 0; i < playlists.length; i++) {
                if (playlists[i].checked)
                    posicoes.push(i)
            }

            async function addSong(e) {
                let musica = retorno[posicaoMusica]

                const res = await fetch(BASE_URL + '/insertSong', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        nomeMusica: musica["nome"],
                        nomeArtista: musica["artista"],
                        nomeAlbum: musica["album"],
                        previewMusica: musica["preview"],
                        imagem: musica["imagem"],
                        posicoes: posicoes,
                        idUser: idUser
                    })
                })
            }

            addSong()

            hideBox(idPlaylistBox)
        })
    }
}

let showBox = function (id, content) {
    document.querySelector('#aside').style.filter = 'blur(7px)'
    document.querySelector('#header').style.filter = 'blur(7px)'
    document.querySelector('#main').style.filter = 'blur(7px)'
    const box = document.querySelector(id)
    box.innerHTML = content
    box.style.display = 'block'
}

let hideBox = function (id) {
    document.querySelector('#aside').style.filter = 'none'
    document.querySelector('#header').style.filter = 'none'
    document.querySelector('#main').style.filter = 'none'
    const box = document.querySelector(id)
    box.innerHTML = ''
    box.style.display = 'none'
}

let showDBResult = function (success) {
    const box = document.querySelector('#dbResultBox')
    box.display = "block"

    if (success) {
        box.innerHTML = "A operação feita com sucesso!"
        box.style.backgroundColor = "#66ff99"
    }
    else {
        box.innerHTML = "Erro! A operação falhou!"
        box.style.backgroundColor = " #ff8080"
    }

    setTimeout(() => {
        box.innerHTML = ""
        box.display = "none"
    }, 3000)
}