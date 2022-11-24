document.addEventListener('load', getInfo);

const BASE_URL = window.location.href;

async function getInfo(e) {
    let playlists = document.querySelector('.sidebar-playlists');

    const res = await fetch(BASE_URL, {
        method: 'GET'
    });

    const data = await res.json();
    let resultado = data.playlists;
    let id = data.idUser;

    for (let i = 0; i < resultado.length; i++) {
        playlists.innerHTML += `<a href="/${id}/playlist/${i}">${resultado[pos].nomePlaylist}</a>`;
    }
}

document.addEventListener("DOMContentLoaded", function () {
    let fadeComplete = function (e) {
        stage.appendChild(arr[0]);
    };
    let stage = document.getElementById("slider");
    let arr = stage.getElementsByClassName("slider-a");
    for (var i = 0; i < arr.length; i++) {
        arr[i].addEventListener("animationend", fadeComplete, false);
    }

}, false);

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

        async function criarPlaylist(e) {
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

        criarPlaylist();

        hideBox(id);
    })

    document.querySelector('#calcelCreatePlaylist').addEventListener('click', () => {
        hideBox(id);
    })
})

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