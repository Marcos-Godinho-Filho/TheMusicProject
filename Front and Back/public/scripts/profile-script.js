document.addEventListener('load', getInfo);

const BASE_URL = 'http://localhost:3000/:id/home/';

async function getInfo(e) {
    let playlists = document.querySelector('.sidebar-playlists');
    let userTxt = document.querySelector('#user');
    let bio = document.querySelector('#bio');
    let email = document.querySelector('#email');
    let img = document.querySelector('#img-button');
    let corFundo = document.querySelector('#cor');

    const res = await fetch(BASE_URL, {
        method: 'GET'
    });

    const data = await res.json();
    let resultado = data.playlists;
    let id = data.idUser;

    for (let i = 0; i < resultado.length; i++) {
        playlists.innerHTML += `<a href="/${id}/playlist/${i}">${playlists[pos].nomePlaylist}</a>`;
    }

    let user = data.user;

    userTxt.innerHTML = user.nome;
    bio.innerHTML = user.desc;
    email.innerHTML = user.email;

    if (user.imagemPerfil == "")
        img.src = "../imgs/user-icon.png"
    else
        img.src = user.imagemPerfil;

    if (user.corFundo == "")
        corFundo.value = user.corFundo;
    else
        corFundo.value = "#ff0000";
}

const reader = new FileReader();
const fileInput = document.querySelector("#fileReader");
const img = document.querySelector("#img-button");
reader.onload = e => {
    img.src = e.target.result;
    img.style.width = '120px';
    img.style.height = '120px';
}
fileInput.addEventListener('change', e => {
    const f = e.target.files[0];
    reader.readAsDataURL(f);
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

        /* comandos para deletar a playlist no BD */

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
            <input type="text" id="newTitle" value="Playlist 1"> </input> 
            <textarea id="newDescription">Descrição</textarea>
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
        img.src = '../images/browse.png';
        img.style.width = '200px';
        img.style.height = '200px';
    })
    document.querySelector('#edit-img-button').addEventListener('mouseout', () => {
        img.src = previousImg;
        img.style.width = '200px';
        img.style.height = '200px';
    })

    document.querySelector('#saveEditPlaylist').addEventListener('click', () => {
        /* comandos para salvar a edição no BD */

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