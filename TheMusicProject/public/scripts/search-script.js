const BASE_URL = window.location.href

let idUser = BASE_URL.substring(29)

let buscarBtn = document.querySelector("#search")
let inpBx = document.querySelector("#inputBox")
let results = document.querySelector("#results")

buscarBtn.addEventListener('click', buscar)

inpBx.addEventListener('keyup', function (e) {
    e.preventDefault()
    let tecla = e.keyCode
    if (tecla === 13)
        buscarBtn.click()
})

function buscar(e) {
    results.innerHTML = ''
    document.querySelector('.container-animation').style.display = 'flex'

    e.preventDefault()
    postInfo();
    // setTimeout(getInfo(), 2000)

    async function postInfo(e) {
        if (inpBx.value == "") {
            return
        }
        const res = await fetch(BASE_URL, {
            method: 'POST',
            headers: {
                "Content-Type": 'application/json'
            },
            body: JSON.stringify({
                parcel: inpBx.value
            })
        })

        windowlocation.href = `http://localhost:3000/search/${res.json().idUser}/result`
    }

    async function getInfo(e) {
        location.reload()
        document.querySelector('.container-animation').style.display = 'none'
        if (results.childNodes.length == 0)
            results.innerHTML = "<div id='noResults'> Sem resultados para a busca. </div>"
    }
}

document.querySelector('#createPlaylist').addEventListener('click', () => {
    let id = '#createPlaylistBox'
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
                <textarea id="newDescription">Descrição</textarea>
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
            let idPl = data.idPl
            window.location.href = `http://localhost:3000/playlist/${idUser}/${idPl}`
        }

        createPlaylist()
        hideBox(id)
    })

    document.querySelector('#calcelCreatePlaylist').addEventListener('click', () => {
        hideBox(id)
    })
})

let image = document.querySelector('#image')
let title = document.querySelector('#title')
let artist = document.querySelector('#artist')
let album = document.querySelector('#album')

let preview = document.querySelector('#preview')

let playBtn = document.querySelector('#playBtn')
let pauseBtn = document.querySelector('#pauseBtn')
let backwardBtn = document.querySelector('#backwardBtn')
let forwardBtn = document.querySelector('#forwardBtn')

let progressBar = document.querySelector('.music-progress-bar')
let songDuration = document.querySelector('.duration')
let songCurrentTime = document.querySelector('.current-time')

let volumeSlider = document.querySelector('.volume-slider')

let audioPlayer = document.querySelector('#audioPlayer')

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

const formatTime = (time) => {
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
    document.querySelector('#main').style.height = 'calc(100% - 75px)'
    document.querySelector('#aside').style.height = '100%'
})

let posicaoMusica
let showSelectPlaylistBox = function (pos) {
    let idPlaylistBox = '#selectPlaylistBox'
    let selectPlaylistBoxContent
    posicaoMusica = pos

    if (resultado.length == 0) {
        selectPlaylistBoxContent = `
        <p> Você ainda possui nenhuma playlist criada. Clique no botão "Criar Playlist" na barra lateral para poder criá-la e salvar suas músicas favoritas! </p>`
    }
    else {
        selectPlaylistBoxContent = `
        <h1 class="boxTitle"> Adicionar às playlists </h1>
        <p> Selecione a playlist desejada: </p>
        <div id="division"> </div>
        <div id="playlists">
            <ul>`

        for (let i = 0; i < resultado.length; i++) {
            selectPlaylistBoxContent += `
                <li class="playlist" onclick="select(${i})">${resultado[i].nomePlaylist}</li>`
        }

        selectPlaylistBoxContent += `
            <ul>
        </div>`

        selectPlaylistBoxContent += `
        <div class="options-buttons">
            <button id="addSongToPlaylist"> Adicionar </button>
            <button id="calcelDeletePlaylist"> Cancelar </button>
        </div>`
    }

    showBox(idPlaylistBox, selectPlaylistBoxContent)

    let selectedPlaylist

    let posPl
    function select(pos) {
        const playlists = document.getElementsByClassName('playlist')
        posPl = pos

        if (selectedPlaylist !== undefined)
            selectedPlaylist.style.backgroundColor = 'transparent'

        selectedPlaylist = playlists.item(pos)
        selectedPlaylist.style.backgroundColor = '#505050'
    }

    document.querySelector('#addSongToPlaylist').addEventListener('click', () => {

        async function addSong(e) {
            const res = await fetch(BASE_URL + `/${posPl}/insertMusic`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: {
                    nomeMusica: resultadoBusca[posicaoMusica]["nome"],
                    nomeArtista: resultadoBusca[posicaoMusica]["artista"],
                    nomeAlbum: resultadoBusca[posicaoMusica]["album"],
                    previewMusica: resultadoBusca[posicaoMusica]["preview"],
                    imagem: resultadoBusca[posicaoMusica]["imagem"],
                    posPlaylist: posPl,
                    idUser: idUser
                }
            })
        }

        addSong()

        hideBox(id)
    })

    document.querySelector('#calcelDeletePlaylist').addEventListener('click', () => {
        hideBox(id)
    })
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