const BASE_URL = window.location.href;

let idUser = BASE_URL.substring(27);

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
        img.src = '../imgs/browse.png';
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

        createPlaylist;
        hideBox(id);

        let quantas;
        async function getPlaylists(e)
        {
            const res = await fetch(BASE_URL, {
                method: 'GET'
            });
        
            const data = await res.json();
            quantas = data.playlists.length() - 1;
        }

        getPlaylists;
        window.location.href = `/playlist/${idUser}/${quantas}`;
    })

    document.querySelector('#calcelCreatePlaylist').addEventListener('click', () => {
        hideBox(id);
    })
})

let showBox = function (id, content) {
    document.querySelector('#aside').style.filter = 'blur(7px)';
    document.querySelector('#main').style.filter = 'blur(7px)';
    const box = document.querySelector(id);
    box.innerHTML = content;
    box.style.display = 'block';
}

let hideBox = function (id) {
    document.querySelector('#aside').style.filter = 'none';
    document.querySelector('#main').style.filter = 'none';
    const box = document.querySelector(id);
    box.innerHTML = '';
    box.style.display = 'none';
}

let showDBResult = function(success) {
    const box = document.querySelector('#dbResultBox');
    box.display = "block";

    if (success) {
        box.innerHTML = "A operação feita com sucesso!";
        box.style.backgroundColor = "#66ff99";
    }
    else { 
        box.innerHTML = "Erro! A operação falhou!";
        box.style.backgroundColor = " #ff8080";
    }

    setTimeout(() => { 
        box.innerHTML = ""; 
        box.display = "none;";
    }, 3000);
}
